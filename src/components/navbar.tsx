"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, User, Home, Info, LogOut, X, Menu, } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";


const Navbar = () => {
  const [isopen, setisopen] = useState(false);

  const togglemenu = () => {
    setisopen((prev) => !prev);
  };

  const isauth = false;

  const logouthandler = () => { };

  return (
    <nav className="z-50 sticky top-0 bg-background/80 border-b backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center lg:px-8">
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
            <Link href={'/'}>
              <Button variant={"ghost"} className="flex items-center gap-2 font-medium">
                <Home size={16} />Home
              </Button>
            </Link>


            <Link href={'/jobs'}>
              <Button variant={"ghost"} className="flex items-center gap-2 font-medium">
                <Briefcase size={16} />Jobs
              </Button>
            </Link>


            <Link href={'/about'}>
              <Button variant={"ghost"} className="flex items-center gap-2 font-medium">
                <Info size={16} />About
              </Button>
            </Link>



          </div>


          {/* right side actions */}

          <div className="hidden md:flex items-center gap-3">
            {isauth ?
              <Popover>
                <PopoverTrigger
                  render={
                    <Button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <Avatar
                        className="h-9 w-9 ring-2 ring-offset-2 ring-offset-background ring-blue-500/20
        cursor-pointer hover:ring-blue-500/40 transition-all"
                      >
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600">
                          P
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />

                <PopoverContent className="w-56 p-2" align="end">
                  <div className="px-3 py-2 mb-2 border-b">
                    <p className="text-sm font-semibold">Gopal</p>

                    <p className="text-xs opacity-60 truncate">
                      gbhunia819@gail.com
                    </p>
                  </div>

                  <Link href="/account">
                    <Button
                      className="w-full justify-start gap-2"
                      variant="ghost"
                    >
                      <User size={16} />
                      My Profile
                    </Button>
                  </Link>

                  <Button
                    className="w-full justify-start gap-2 mt-1"
                    variant="ghost"
                    onClick={logouthandler}
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </PopoverContent>
              </Popover>
              : <Link href={'/login'}><Button className="gap-2 ">
                <User size={16} />Sign In
              </Button></Link>}
            <ModeToggle />
          </div>
          {/* mobile buttton */}

          <div className=" md:hidden flex items-center gap-3">
            <ModeToggle />
            <Button onClick={togglemenu} className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle-menu "> {isopen ? <X size={24} /> : <Menu size={24} />}

            </Button>
          </div>
        </div>
      </div>

      {/* mobile view */}

      <div className={`md:hidden border-t overflow-hidden transition-all 
        duration-300 ease-in-out ${isopen ? "max-h-96 opacity-100" : "max-h-0-opacity-0"}`}>
        <div className="px-3 py-3 space-y-1 bg-background/95 backdrop-blur-md">
          {/* isauth or user */}
          {/* Mobile menu */}

<div
  className={`md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${
    isopen
      ? "max-h-96 opacity-100"
      : "max-h-0 opacity-0"
  }`}
>
  <div className="px-3 py-3 space-y-1 bg-background/95 backdrop-blur-md">

    <Link href="/" onClick={togglemenu}>
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 h-11"
      >
        <Home size={18} />
        Home
      </Button>
    </Link>

    <Link href="/jobs" onClick={togglemenu}>
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 h-11"
      >
        <Briefcase size={18} />
        Jobs
      </Button>
    </Link>

    <Link href="/about" onClick={togglemenu}>
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 h-11"
      >
        <Info size={18} />
        About
      </Button>
    </Link>

    {isauth ? (
      <>
        <Link href="/account" onClick={togglemenu}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11"
          >
            <User size={18} />
            My Profile
          </Button>
        </Link>

        <Button
          variant="destructive"
          className="w-full justify-start gap-3 h-11"
          onClick={() => {
            logouthandler();
            togglemenu();
          }}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </>
    ) : (
      <Link href="/login" onClick={togglemenu}>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 mt-2"
        >
          <User size={18} />
          Sign In
        </Button>
      </Link>
    )}
  </div>
</div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;