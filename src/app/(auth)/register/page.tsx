"use client";

import { Auth_service, useAppData } from "@/context/appContext";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<"jobseeker" | "jobrecruiter">("jobseeker");
  const [bio, setBio] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const { isAuth, setUser, setIsAuth ,loading} = useAppData();
  const router = useRouter();

  useEffect(() => {
    if (isAuth) {
      router.push("/");
    }
  }, [isAuth, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file for your resume");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Resume file size should be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password || !phoneNumber || !role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (role === "jobseeker" && !resumeFile) {
      toast.error("Please upload your resume in PDF format");
      return;
    }

    setBtnLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone_number", phoneNumber);
      formData.append("role", role);
      if (bio) formData.append("bio", bio);
      if (role === "jobseeker" && resumeFile) {
        formData.append("file", resumeFile);
      }

      const { data } = await axios.post(`${Auth_service}/api/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message || "Registration successful!");

      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 15,
          secure: true,
          path: "/",
        });
      }

      if (data.user) {
        setUser(data.user);
        setIsAuth(true);
      }

      router.push("/");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setBtnLoading(false);
    }
  };
  if(loading) return <Loading/>

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg shadow-lg border">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            Join as a job seeker or a recruiter to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="register-name">Full Name</FieldLabel>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="register-email">Email Address</FieldLabel>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="register-password">Password</FieldLabel>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="register-phone">Phone Number</FieldLabel>
                <Input
                  id="register-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>I am a</FieldLabel>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Button
                    type="button"
                    variant={role === "jobseeker" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setRole("jobseeker")}
                  >
                    Job Seeker
                  </Button>
                  <Button
                    type="button"
                    variant={role === "jobrecruiter" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setRole("jobrecruiter")}
                  >
                    Job Recruiter
                  </Button>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="register-bio">Bio (Optional)</FieldLabel>
                <Input
                  id="register-bio"
                  type="text"
                  placeholder="A short introduction about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Field>

              {role === "jobseeker" && (
                <Field>
                  <FieldLabel htmlFor="register-resume">Resume (PDF)</FieldLabel>
                  <Input
                    id="register-resume"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required
                  />
                  <FieldDescription>
                    Upload your resume in PDF format (max 5MB).
                  </FieldDescription>
                </Field>
              )}

              <Button
                type="submit"
                disabled={btnLoading}
                className="w-full mt-4 h-11"
              >
                {btnLoading ? "Creating Account..." : "Register"}
              </Button>

              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in here
                </Link>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;