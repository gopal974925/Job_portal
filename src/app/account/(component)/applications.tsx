"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { User_service } from "@/context/appContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, MapPin, DollarSign, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Application {
  application_id: number;
  job_id: number;
  applicant_id: number;
  application_email: string;
  status: string;
  resume: string;
  applied_at: string;
  subscription_status: boolean;
  job_title: string;
  job_salary: string | number;
  job_location: string;
}

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${User_service}/api/user/getallapplication`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Card className="border shadow-lg">
          <CardContent className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Card className="border shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Your Job Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-10">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Applications Found</h3>
              <p className="text-sm text-muted-foreground mb-6">
                You haven t applied to any jobs yet. Start exploring opportunities!
              </p>
              <Link href="/jobs">
                <Button>
                  Browse Jobs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.application_id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg border hover:border-primary/50 transition-colors bg-muted/10"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between sm:justify-start gap-3">
                      <Link href={`/jobs/${app.job_id}`} className="hover:underline font-semibold text-lg text-foreground">
                        {app.job_title}
                      </Link>
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

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="capitalize">{app.job_location || "Remote"}</span>
                      </div>
                      {app.job_salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>${Number(app.job_salary).toLocaleString()} / yr</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <Link href={`/jobs/${app.job_id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        View Job <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Applications;

