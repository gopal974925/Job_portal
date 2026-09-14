"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { Job_service, User_service, useAppData } from "@/context/appContext";
import { Job } from "@/type";
import { Loading } from "@/components/ui/loading";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Send,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Application {
  application_id: number;
  job_id: number;
  applicant_id: number;
  application_email: string;
  status: string;
  resume: string;
  applied_at: string;
  subscription_status: boolean;
}

const JobDetailPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const token = Cookies.get("token");

  const { user, isAuth } = useAppData();
  const [job, setJob] = useState<
    (Job & { company_website?: string; company_description?: string }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  // Recruiter: applications
  const [applications, setApplications] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);

  // Jobseeker: applying
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState<number | null>(null);

  const handleStatusUpdate = async (applicationId: number, newStatus: string) => {
    try {
      setUpdatingAppId(applicationId);
      await axios.put(
        `${Job_service}/api/job/application/update/${applicationId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Application marked as ${newStatus}`);
      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (error: any) {
      console.error("Status update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update application status"
      );
    } finally {
      setUpdatingAppId(null);
    }
  };

  async function fetchJob() {
    if (!id) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${Job_service}/api/job/${id}`);
      setJob(data);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      toast.error("Failed to load job details.");
    } finally {
      setLoading(false);
    }
  }

  async function checkUserApplied() {
    if (!token || !user || user.role !== "jobseeker" || !id) return;
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
        const hasApplied = data.applications.some(
          (app: any) => Number(app.job_id) === Number(id)
        );
        setApplied(hasApplied);
      }
    } catch (error) {
      // Non-critical, ignore
    }
  }

  async function fetchApplications() {
    if (!token || !id) return;
    try {
      setAppsLoading(true);
      const { data } = await axios.get(
        `${Job_service}/api/job/application/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplications(data.applications || []);
    } catch (error) {
      // Not owner or forbidden
    } finally {
      setAppsLoading(false);
    }
  }

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (job) {
      if (
        user &&
        user.role === "jobrecruiter" &&
        Number(user.user_id) === Number(job.posted_by_recruiter_id)
      ) {
        fetchApplications();
      } else if (user && user.role === "jobseeker") {
        checkUserApplied();
      }
    }
  }, [job, user]);

  const handleApply = async () => {
    if (!isAuth || !user) {
      toast.error("Please login as a job seeker to apply.");
      router.push("/login");
      return;
    }

    if (user.role !== "jobseeker") {
      toast.error("Only job seekers can apply for positions.");
      return;
    }

    if (!user.resume) {
      toast.error("Please upload your resume in your profile before applying.");
      router.push("/account");
      return;
    }

    try {
      setApplying(true);
      const { data } = await axios.post(
        `${User_service}/api/user/apply/job`,
        { job_id: Number(id) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message || "Application submitted successfully!");
      setApplied(true);
    } catch (error: any) {
      console.error("Apply error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loading />;

  if (!job) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <Card className="p-10 border-dashed">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <CardTitle className="text-xl">Job Not Found</CardTitle>
          <CardDescription className="mt-2 mb-6">
            This job listing may have expired or been removed.
          </CardDescription>
          <Link href="/jobs">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Job Board
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isRecruiterOwner =
    !!user &&
    user.role === "jobrecruiter" &&
    Number(user.user_id) === Number(job.posted_by_recruiter_id);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Back Button */}
      <Link href="/jobs">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </Link>

      {/* Main Header Card */}
      <Card className="border shadow-sm">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 rounded-xl border shrink-0">
                {job.company_logo && (
                  <AvatarImage
                    src={job.company_logo}
                    alt={job.company_name || "Company"}
                    className="object-cover rounded-xl"
                  />
                )}
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xl">
                  {job.company_name?.charAt(0).toUpperCase() || "C"}
                </AvatarFallback>
              </Avatar>

              <div>
                <Link
                  href={`/company/${job.company_id}`}
                  className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  {job.company_name}
                </Link>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
                  {job.title}
                </h1>

                <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                  {job.role}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="shrink-0 flex items-center gap-3">
              {isRecruiterOwner ? (
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-medium">
                  You posted this job
                </span>
              ) : applied ? (
                <Button variant="secondary" disabled className="gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Already Applied
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleApply}
                  disabled={applying}
                  className="gap-2"
                >
                  {applying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Apply for this Role
                </Button>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y py-4">
            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Workplace
              </span>
              <p className="text-sm font-semibold capitalize">
                {job.work_location || job.location || "Remote"}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" /> Type
              </span>
              <p className="text-sm font-semibold capitalize">
                {job.job_type || "Full-time"}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-green-600" /> Salary
              </span>
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                {job.salary ? `$${Number(job.salary).toLocaleString()} / yr` : "Undisclosed"}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-primary" /> Openings
              </span>
              <p className="text-sm font-semibold">
                {job.openings || 1} available
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              About the Role
            </h2>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Company Brief Card */}
          {job.company_description && (
            <div className="rounded-xl border bg-muted/30 p-5 space-y-2 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  About {job.company_name}
                </h3>

                {job.company_website && (
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Visit Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {job.company_description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recruiter Applications Management Section */}
      {isRecruiterOwner && (
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Received Applications</CardTitle>
                <CardDescription>
                  Review candidates who submitted their resumes for this position.
                </CardDescription>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                {applications.length} Candidates
              </span>
            </div>
          </CardHeader>

          <CardContent>
            {appsLoading ? (
              <div className="flex min-h-[150px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : applications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No candidates have applied to this position yet.
              </p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.application_id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-muted/20"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        {app.application_email}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
                            app.status === "hired"
                              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800"
                              : app.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              app.status === "hired"
                                ? "bg-green-500"
                                : app.status === "rejected"
                                ? "bg-red-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {app.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Edit application status */}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={updatingAppId === app.application_id}
                              className="gap-1 text-xs"
                            >
                              {updatingAppId === app.application_id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                              )}
                              Update Status
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(app.application_id, "submitted")}
                            className="gap-2 text-xs"
                          >
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            Submitted
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(app.application_id, "hired")}
                            className="gap-2 text-xs"
                          >
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Hired
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(app.application_id, "rejected")}
                            className="gap-2 text-xs text-destructive"
                          >
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Rejected
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>



                      {app.resume && (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button variant="outline" size="sm" className="gap-1 text-xs">
                            View Resume
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobDetailPage;

