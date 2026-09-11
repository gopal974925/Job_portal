"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Job_service, User_service, useAppData } from "@/context/appContext";
import { Job } from "@/type";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  Loader2,
  MapPin,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const JobsPage = () => {
  const router = useRouter();
  const token = Cookies.get("token");
  const { user, isAuth } = useAppData();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [selectedWorkLocation, setSelectedWorkLocation] = useState<string>("all");

  // Application submission tracking
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  // Fetch jobs
  async function fetchJobs() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTitle.trim()) params.append("title", searchTitle.trim());
      if (searchLocation.trim()) params.append("location", searchLocation.trim());

      const url = `${Job_service}/api/job/all${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const { data } = await axios.get(url);
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch user's existing applications to highlight already applied jobs
  async function fetchUserApplications() {
    if (!token || !user || user.role !== "jobseeker") return;
    try {
      const { data } = await axios.get(
        `${User_service}/api/user/getallapplication`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.applications) {
        setAppliedJobs(data.applications.map((app: any) => app.job_id));
      }
    } catch (error) {
      // Non-critical, ignore silent fail
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (isAuth && user) {
      fetchUserApplications();
    }
  }, [isAuth, user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearchTitle("");
    setSearchLocation("");
    setSelectedJobType("all");
    setSelectedWorkLocation("all");
    setTimeout(() => {
      fetchJobs();
    }, 50);
  };

  const handleApply = async (jobId: number) => {
    if (!isAuth || !user) {
      toast.error("Please log in as a job seeker to apply.");
      router.push("/login");
      return;
    }

    if (user.role !== "jobseeker") {
      toast.error("Only job seekers can apply for open positions.");
      return;
    }

    if (!user.resume) {
      toast.error("Please upload your resume in your profile before applying.");
      router.push("/account");
      return;
    }

    try {
      setApplyingJobId(jobId);
      const { data } = await axios.post(
        `${User_service}/api/user/apply/job`,
        { job_id: jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message || "Application submitted successfully!");
      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (error: any) {
      console.error("Apply error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application."
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  // Client-side filtering for job_type and work_location
  const filteredJobs = jobs.filter((job) => {
    if (
      selectedJobType !== "all" &&
      job.job_type?.toLowerCase() !== selectedJobType.toLowerCase()
    ) {
      return false;
    }
    if (
      selectedWorkLocation !== "all" &&
      job.work_location?.toLowerCase() !== selectedWorkLocation.toLowerCase()
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Find Your Next Dream Role
        </h1>
        <p className="text-base text-muted-foreground">
          Explore hundreds of active verified opportunities from leading tech companies and startups.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <Card className="border shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3"
          >
            {/* Title / Role Input */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Job title, role, or keywords..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Location Input */}
            <div className="sm:col-span-4 relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="City, state, or location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Search Button */}
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-muted-foreground flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Filters:
              </span>

              {/* Job Type Filter */}
              <div className="flex items-center gap-1.5">
                <label className="text-muted-foreground">Type:</label>
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs outline-none focus-visible:border-ring"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Work Location Filter */}
              <div className="flex items-center gap-1.5">
                <label className="text-muted-foreground">Workplace:</label>
                <select
                  value={selectedWorkLocation}
                  onChange={(e) => setSelectedWorkLocation(e.target.value)}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs outline-none focus-visible:border-ring"
                >
                  <option value="all">All Workplace</option>
                  <option value="remote">Remote</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {(searchTitle ||
              searchLocation ||
              selectedJobType !== "all" ||
              selectedWorkLocation !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Available Opportunities
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {filteredJobs.length} Jobs
          </span>
        </h2>
      </div>

      {/* Jobs Listing */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading active jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="border-dashed p-12 text-center flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">No Job Matches Found</CardTitle>
          <CardDescription className="max-w-md mt-2 mb-6">
            We couldn't find any active positions matching your criteria. Try adjusting your search keywords or removing active filters.
          </CardDescription>
          <Button variant="outline" onClick={handleResetFilters} className="gap-2">
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs.includes(job.job_id);

            return (
              <Card
                key={job.job_id}
                className="flex flex-col justify-between hover:shadow-md hover:border-primary/50 transition-all border"
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3.5">
                      <Avatar className="h-12 w-12 rounded-xl border shrink-0">
                        {job.company_logo && (
                          <AvatarImage
                            src={job.company_logo}
                            alt={job.company_name || "Company"}
                            className="object-cover rounded-xl"
                          />
                        )}
                        <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
                          {job.company_name?.charAt(0).toUpperCase() || "C"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/company/${job.company_id}`}
                          className="text-xs font-semibold text-primary hover:underline block truncate"
                        >
                          {job.company_name || "Company"}
                        </Link>

                        <CardTitle className="text-lg mt-0.5 truncate">
                          <Link
                            href={`/jobs/${job.job_id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {job.title}
                          </Link>
                        </CardTitle>

                        <p className="text-xs text-muted-foreground mt-0.5">
                          {job.role}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-md">
                        <MapPin className="h-3 w-3 text-primary" />
                        {job.work_location || job.location || "Remote"}
                      </span>

                      <span className="flex items-center gap-1 capitalize bg-muted/60 px-2 py-1 rounded-md">
                        <Clock className="h-3 w-3 text-primary" />
                        {job.job_type || "Full-time"}
                      </span>

                      {job.salary && (
                        <span className="flex items-center gap-1 font-semibold text-foreground bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded-md">
                          <DollarSign className="h-3 w-3" />
                          ${Number(job.salary).toLocaleString()} / yr
                        </span>
                      )}

                      {job.openings && (
                        <span className="flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-md">
                          <Users className="h-3 w-3 text-primary" />
                          {job.openings} opening{job.openings > 1 ? "s" : ""}
                        </span>
                      )}

                      {job.created_at && (
                        <span className="flex items-center gap-1 ml-auto text-[11px]">
                          <Calendar className="h-3 w-3" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="flex items-center justify-between gap-3 border-t pt-3 bg-muted/20">
                  <Link href={`/jobs/${job.job_id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Details
                    </Button>
                  </Link>

                  {isApplied ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      className="gap-1.5 text-xs text-green-700 dark:text-green-400"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Applied
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={applyingJobId === job.job_id}
                      onClick={() => handleApply(job.job_id)}
                      className="gap-1.5 text-xs"
                    >
                      {applyingJobId === job.job_id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      Apply Now
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobsPage;

