
"use client";

import { Auth_service, useAppData } from "@/context/appContext";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { isAuth, setUser, setIsAuth,loading } = useAppData();
  const router = useRouter();

  useEffect(() => {
    if (isAuth) {
      router.push("/");
    }
  }, [isAuth, router]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBtnLoading(true);

    try {
      const { data } = await axios.post(`${Auth_service}/api/auth/login`, {
        email,
        password,
      });

      toast.success(data.message || "Logged in successfully!");

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });

      setUser(data.user);
      setIsAuth(true);
      router.push("/");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  };
  if(loading) return <Loading/>

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                <Input
                  id="fieldgroup-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FieldDescription>
                  Enter the email address associated with your account.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
                <Input
                  id="fieldgroup-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              <div className="flex items-center justify-between gap-4 pt-2">
                <Button
                  type="reset"
                  variant="outline"
                  onClick={() => {
                    setEmail("");
                    setPassword("");
                  }}
                  disabled={btnLoading}
                >
                  Reset
                </Button>

                <Button type="submit" disabled={btnLoading} className="flex-1">
                  {btnLoading ? "Logging in..." : "Login"}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary font-medium hover:underline"
                >
                  Create one now
                </Link>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
