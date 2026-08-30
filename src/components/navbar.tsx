"use client";

import Link from "next/link";
import React, { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Briefcase, User as UserIcon, Home, Info, LogOut, X, Menu, LogIn, UserPlus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { useAppData } from "@/context/appContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuth, user, setUser, setIsAuth ,loading} = useAppData();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const logoutHandler = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="z-50 sticky top-0 bg-background/80 border-b backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1 group">
              <div className="text-2xl font-bold tracking-tight">
                <span className="bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  JOB
                </span>
                <span className="text-red-500">PORTAL</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2 font-medium">
                <Home size={16} />Home
              </Button>
            </Link>

            <Link href="/jobs">
              <Button variant="ghost" className="flex items-center gap-2 font-medium">
                <Briefcase size={16} />Jobs
              </Button>
            </Link>

            <Link href="/about">
              <Button variant="ghost" className="flex items-center gap-2 font-medium">
                <Info size={16} />About
              </Button>
            </Link>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? "":<>{isAuth && user ? (
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="p-1 rounded-full hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-blue-500/30 cursor-pointer">
                        {user.profile_pic && (
                          <AvatarImage src={user.profile_pic} alt={user.name} />
                        )}
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 font-semibold">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />

                <PopoverContent className="w-60 p-3" align="end">
                  <div className="px-2 py-2 mb-2 border-b">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs opacity-70 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium capitalize">
                      {user.role}
                    </span>
                  </div>

                  <Link href="/account">
                    <Button className="w-full justify-start gap-2 text-sm" variant="ghost">
                      <UserIcon size={16} />
                      My Profile
                    </Button>
                  </Link>

                  <Button
                    className="w-full justify-start gap-2 mt-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    variant="ghost"
                    onClick={logoutHandler}
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="gap-2 font-medium">
                    <LogIn size={16} />Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="gap-2 font-medium">
                    <UserPlus size={16} />Register
                  </Button>
                </Link>
              </div>
            )}</>}
            <ModeToggle />
          </div>

          {/* Mobile toggle button */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Button
              onClick={toggleMenu}
              variant="ghost"
              size="icon-sm"
              className="p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      {isOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md px-4 py-4 space-y-2">
          {isAuth && user && (
            <div className="p-3 mb-2 rounded-lg bg-secondary/50 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                {user.profile_pic && <AvatarImage src={user.profile_pic} alt={user.name} />}
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 font-semibold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs opacity-70 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <Link href="/" onClick={toggleMenu}>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11">
              <Home size={18} />
              Home
            </Button>
          </Link>

          <Link href="/jobs" onClick={toggleMenu}>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11">
              <Briefcase size={18} />
              Jobs
            </Button>
          </Link>

          <Link href="/about" onClick={toggleMenu}>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11">
              <Info size={18} />
              About
            </Button>
          </Link>

          {isAuth ? (
            <>
              <Link href="/account" onClick={toggleMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3 h-11">
                  <UserIcon size={18} />
                  My Profile
                </Button>
              </Link>

              <Button
                variant="destructive"
                className="w-full justify-start gap-3 h-11 mt-2"
                onClick={() => {
                  logoutHandler();
                  toggleMenu();
                }}
              >
                <LogOut size={18} />
                Logout
              </Button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2 border-t">
              <Link href="/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full justify-start gap-3 h-11">
                  <LogIn size={18} />
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={toggleMenu}>
                <Button className="w-full justify-start gap-3 h-11">
                  <UserPlus size={18} />
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;