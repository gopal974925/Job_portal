"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Job_service, User_service, useAppData } from "@/context/appContext";
import { Company, Job } from "@/type";
import { Loading } from "@/components/ui/loading";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  Plus,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

const CompanyPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const token = Cookies.get("token");

  const { user, isAuth } = useAppData();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  // Add Job Modal State
  const [showModal, setShowModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("full-time");
  const [workLocation, setWorkLocation] = useState("remote");
  const [openings, setOpenings] = useState("1");

  // Applying state
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);

  const clearData = () => {
    setTitle("");
    setRole("");
    setDescription("");
    setSalary("");
    setJobType("full-time");
    setWorkLocation("remote");
    setOpenings("1");
  };

  const openDialog = () => {
    setShowModal(true);
  };

  const closeDialog = () => {
    if (btnLoading) return;
    setShowModal(false);
    clearData();
  };

  async function fetchCompany() {
    if (!id) return;

    try {
      setLoading(true);
      const { data } = await axios.get(`${Job_service}/api/job/company/${id}`);
      setCompany(data);
    } catch (error) {
      console.error("Failed to fetch company", error);
      toast.error("Failed to load company details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const isRecruiterOwner =
    !!user &&
    !!company &&
    Number(user.user_id) === Number(company.recruiter_id ?? 0);

  const handleDeleteJob = async (jobId: number) => {
    if (!window.confirm("Are you sure you want to delete this job position?")) {
      return;
    }

    try {
      await axios.delete(`${Job_service}/api/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Job deleted successfully");
      fetchCompany();
    } catch (error) {
      console.error("Failed to delete job", error);
      toast.error("Failed to delete job");
    }
  };

  const handleApplyJob = async (jobId: number) => {
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
    } catch (error: any) {
      console.error("Apply error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application."
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Job title is required.");
      return;
    }

    if (!role.trim()) {
      toast.error("Role is required.");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }

    if (!company) return;

    try {
      setBtnLoading(true);

      await axios.post(
        `${Job_service}/api/job/new`,
        {
          title: title.trim(),
          description: description.trim(),
          role: role.trim(),
          salary: salary ? Number(salary) : null,
          job_type: jobType,
          work_location: workLocation,
          openings: Number(openings) || 1,
          company_id: company.company_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Job posted successfully!");
      closeDialog();
      fetchCompany();
    } catch (error: any) {
      console.error("Error creating job:", error);
      toast.error(error.response?.data?.message || "Failed to create job.");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (!company) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Card className="max-w-md p-8 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <CardTitle className="text-xl">Company Not Found</CardTitle>
          <CardDescription className="mt-2">
            The company you are looking for does not exist or may have been removed.
          </CardDescription>
          <Link href="/jobs" className="mt-4 inline-block">
            <Button variant="outline">Browse All Jobs</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Filter jobs based on role: recruiters see all, jobseekers see only active
  const displayedJobs = isRecruiterOwner
    ? company.jobs || []
    : (company.jobs || []).filter((j) => j.is_active !== false);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Company Overview Card */}
      <Card className="overflow-hidden border shadow-sm">
        <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-primary" />
        <CardContent className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <Avatar className="h-24 w-24 rounded-2xl border-4 border-background bg-background shadow-md">
              {company.logo && (
                <AvatarImage
                  src={company.logo}
                  alt={company.name}
                  className="object-cover rounded-2xl"
                />
              )}
              <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold text-2xl">
                {company.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Visit Website
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </Button>
                </a>
              )}

              {isRecruiterOwner && (
                <Button onClick={openDialog} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Post Job
                </Button>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {company.name}
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-3xl">
              {company.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Open Positions
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {displayedJobs.length} Available
            </span>
          </div>

          {isRecruiterOwner && (
            <Button onClick={openDialog} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Position
            </Button>
          )}
        </div>

        {displayedJobs.length === 0 ? (
          <Card className="border-dashed p-10 text-center flex flex-col items-center justify-center">
            <Briefcase className="h-10 w-10 text-muted-foreground mb-3" />
            <CardTitle className="text-base">No Open Positions</CardTitle>
            <CardDescription className="max-w-md mt-1 mb-4">
              {isRecruiterOwner
                ? "You haven't posted any jobs for this company yet. Click below to add your first job opening."
                : "This company currently has no open job listings. Please check back later!"}
            </CardDescription>
            {isRecruiterOwner && (
              <Button onClick={openDialog} size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Post Job Opening
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedJobs.map((job) => (
              <Card
                key={job.job_id}
                className="hover:border-primary/50 transition-colors border"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <CardTitle className="text-lg">
                          <Link
                            href={`/jobs/${job.job_id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {job.title}
                          </Link>
                        </CardTitle>

                        {/* Status Badge for recruiter */}
                        {isRecruiterOwner && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              job.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                            }`}
                          >
                            {job.is_active ? "Active" : "Inactive"}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-medium text-muted-foreground">
                        {job.role}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isRecruiterOwner ? (
                        <>
                          <Link href={`/jobs/${job.job_id}`}>
                            <Button variant="outline" size="sm">
                              Applicants / Details
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteJob(job.job_id)}
                            className="gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link href={`/jobs/${job.job_id}`}>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            disabled={applyingJobId === job.job_id}
                            onClick={() => handleApplyJob(job.job_id)}
                            className="gap-1.5"
                          >
                            {applyingJobId === job.job_id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Send className="h-3.5 w-3.5" />
                            )}
                            Apply Now
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {job.work_location || job.location || "Remote"}
                    </span>

                    <span className="flex items-center gap-1 capitalize">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {job.job_type || "Full-time"}
                    </span>

                    {job.salary && (
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <DollarSign className="h-3.5 w-3.5 text-green-600" />
                        ${Number(job.salary).toLocaleString()} / year
                      </span>
                    )}

                    {job.openings && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        {job.openings} opening{job.openings > 1 ? "s" : ""}
                      </span>
                    )}

                    {job.created_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Job Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Post a New Job Position
            </DialogTitle>
            <DialogDescription>
              Create a job vacancy for {company.name}. Jobseekers can view and apply immediately.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateJob} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-role">Category / Role *</Label>
                <Input
                  id="job-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Engineering, Product, Design"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="job-desc">Job Description *</Label>
              <textarea
                id="job-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail key responsibilities, requirements, tech stack, and qualifications..."
                rows={4}
                required
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-type">Employment Type *</Label>
                <select
                  id="job-type"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="work-location">Work Location *</Label>
                <select
                  id="work-location"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="remote">Remote</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-salary">Annual Salary ($ USD)</Label>
                <Input
                  id="job-salary"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 120000"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="job-openings">Openings Count</Label>
                <Input
                  id="job-openings"
                  type="number"
                  min={1}
                  value={openings}
                  onChange={(e) => setOpenings(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={btnLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={btnLoading} className="gap-2">
                {btnLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {btnLoading ? "Publishing..." : "Publish Job"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyPage;