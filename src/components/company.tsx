"use client";

import { useAppData, Job_service } from "@/context/appContext";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Company as CompanyType } from "@/type";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Building2, ExternalLink, Plus, Trash2, ArrowUpRight, Loader2 } from "lucide-react";

const Company = () => {
  const { loading } = useAppData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const token = Cookies.get("token");

  const clearData = () => {
    setName("");
    setDescription("");
    setWebsite("");
    setLogo(null);
  };

  const openDialog = () => {
    setShowModal(true);
  };

  const closeDialog = () => {
    if (btnLoading) return;
    setShowModal(false);
    clearData();
  };

  async function fetchCompanies() {
    try {
      setFetchLoading(true);
      const { data } = await axios.get(`${Job_service}/api/job/company/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies(data.companies || data || []);
    } catch (error) {
      console.error("Error in fetching companies:", error);
    } finally {
      setFetchLoading(false);
    }
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo size must be less than 5MB.");
      return;
    }

    setLogo(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Company name is required.");
      return;
    }

    if (!description.trim()) {
      toast.error("Company description is required.");
      return;
    }

    if (!website.trim()) {
      toast.error("Company website is required.");
      return;
    }

    if (!logo) {
      toast.error("Company logo is required.");
      return;
    }

    try {
      setBtnLoading(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("website", website.trim());
      formData.append("file", logo);

      await axios.post(`${Job_service}/api/job/company/new`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Company added successfully.");
      closeDialog();
      await fetchCompanies();
    } catch (error: any) {
      console.error("Error creating company:", error);
      toast.error(error.response?.data?.message || "Failed to create company.");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteCompany = async (companyId: number | string) => {
    if (
      !confirm(
        "Are you sure you want to delete this company? All associated jobs will also be deleted."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${Job_service}/api/job/company/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Company deleted successfully");
      setCompanies((prev) =>
        prev.filter((c) => (c.company_id || c._id) !== companyId)
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete company");
    }
  };

  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Registered Companies
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your companies, post vacancies, and review applicants.
          </p>
        </div>

        <Button onClick={openDialog} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* Content */}
      {fetchLoading ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : companies.length === 0 ? (
        <Card className="border-dashed p-10 text-center flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg mb-1">No Companies Registered Yet</CardTitle>
          <CardDescription className="max-w-md mb-6">
            Register your company to post job openings and start hiring top talent.
          </CardDescription>
          <Button onClick={openDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add First Company
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {companies.map((company, index) => {
            const companyId = company.company_id || company._id || index;
            return (
              <Card
                key={companyId}
                className="flex flex-col justify-between hover:shadow-md transition-shadow border"
              >
                <div>
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Avatar className="h-14 w-14 border rounded-xl">
                      {company.logo && (
                        <AvatarImage
                          src={company.logo}
                          alt={company.name}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg rounded-xl">
                        {company.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {company.name}
                      </CardTitle>
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span className="truncate">{company.website.replace(/^https?:\/\//, "")}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-2">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {company.description}
                    </p>
                  </CardContent>
                </div>

                <CardFooter className="flex items-center justify-between gap-2 border-t pt-3 bg-muted/20">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCompany(company.company_id || company._id || "")}
                    className="gap-1.5 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>

                  <Link href={`/company/${company.company_id || company._id}`}>
                    <Button variant="default" size="sm" className="gap-1 text-xs">
                      Manage Jobs
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Company Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Register New Company
            </DialogTitle>
            <DialogDescription>
              Enter the company profile information. This will be visible to job applicants.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Corporation"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company-website">Website URL *</Label>
              <Input
                id="company-website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://acme.example.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company-desc">About Company *</Label>
              <textarea
                id="company-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what your company does, its mission and culture..."
                rows={3}
                required
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company-logo">Company Logo *</Label>
              <Input
                id="company-logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                required
              />
              {logo && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected file: {logo.name} ({(logo.size / 1024).toFixed(1)} KB)
                </p>
              )}
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
                {btnLoading ? "Adding..." : "Register Company"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Company;