"use client";
import { useAppData, Job_service } from "@/context/appContext";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Company as CompanyType } from "@/type";
import toast from "react-hot-toast";
import Link from "next/link";

const Company = () => {
    const { loading } = useAppData();
    const addReference = useRef<HTMLDivElement | null>(null);
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

        const fileInput = document.getElementById(
            "company-logo"
        ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }
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

    const handleLogoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
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

            formData.append("name", name);
            formData.append("description", description);
            formData.append("website", website);
            formData.append("file", logo);

            await axios.post(`${Job_service}/api/job/company/new`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Company added successfully.");  

            clearData();
            setShowModal(false);

            await fetchCompanies();
        } catch (error: any) {
            console.error("Error creating company:", error);
            toast.error(error.response?.data?.message || "Failed to create company.");
        } finally {
            setBtnLoading(false);
        }
    };

    const deleteCompany = async (companyId: number | string) => {
        if (!confirm("Are you sure you want to delete this company? All associated jobs will also be deleted.")) {
            return;
        }

        try {
            await axios.delete(`${Job_service}/api/job/company/${companyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Company deleted successfully");
            setCompanies((prev) => prev.filter((c) => (c.company_id || c._id) !== companyId));
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
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6 ">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Companies
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage companies added to your job portal.
                    </p>
                </div>
                <button
                    onClick={openDialog}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-gray transition hover:bg-blue-700"
                >
                    + Add Company
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-blue-300 shadow-sm">
                {fetchLoading ? (
                    <div className="flex min-h-[200px] items-center justify-center">
                        <p className="text-gray-500">
                            Loading companies...
                        </p>
                    </div>
                ) : companies.length === 0 ? (
                    <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                            🏢
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                            No companies yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Add your first company to start posting jobs.
                        </p>
                        <button
                            onClick={openDialog}
                            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            + Add Company
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-red-500 text-left">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        Company
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        Description
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                                        Website
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                                        Action
                                    </th>
                                 
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map((company, index) => {
                                    const companyId = company.company_id || company._id || index;
                                    return (
                                        <tr
                                            key={companyId}
                                            className="border-b last:border-b-0 hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                               <Link href={`/company/${companyId}`} className="text-sm font-medium text-blue-600 hover:underline">
                                                     <div className="flex items-center gap-3">
                                                    {company.logo ? (
                                                        <img
                                                            src={company.logo}
                                                            alt={company.name}
                                                            className="h-12 w-12 rounded-lg border object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 font-semibold text-blue-600">
                                                            {company.name
                                                                ?.charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {company.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                </Link>
                                            </td>
                                            <td className="max-w-xs px-6 py-4">
                                                <p className="line-clamp-2 text-sm text-gray-600">
                                                    {company.description}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    Visit website
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                                                    onClick={() =>
                                                        deleteCompany(
                                                            company.company_id || company._id || ""
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div ref={addReference} className="hidden" />

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-blue-300 shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Add Company
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Enter company information below.
                                </p>
                            </div>

                            <button
                                onClick={closeDialog}
                                disabled={btnLoading}
                                className="text-2xl text-gray-400 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >
                            {/* Name */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter company name"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Enter company description"
                                    rows={4}
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Website
                                </label>

                                <input
                                    type="url"
                                    value={website}
                                    onChange={(e) =>
                                        setWebsite(e.target.value)
                                    }
                                    placeholder="https://example.com"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Logo */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Company Logo
                                </label>

                                <input
                                    id="company-logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="block w-full cursor-pointer rounded-lg border border-gray-300 text-sm text-gray-500 file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-2.5 file:text-sm file:font-medium"
                                />

                                {logo && (
                                    <p className="mt-2 text-xs text-gray-500">
                                        Selected: {logo.name}
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 border-t pt-5">
                                <button
                                    type="button"
                                    onClick={closeDialog}
                                    disabled={btnLoading}
                                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={btnLoading}
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {btnLoading
                                        ? "Adding..."
                                        : "Add Company"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Company;