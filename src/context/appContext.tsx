"use client";
import { AppContextType, AppProviderProps, User } from "@/type";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast, {Toaster} from "react-hot-toast"
import Cookies from "js-cookie";
import axios from "axios";

export const utils_service = "http://13.200.217.93:3001";
export const Auth_service = "http://13.200.217.93:4000";
export const Job_service = "http://13.200.217.93:3003";
export const User_service = "http://13.200.217.93:3002";
export const payment_service="http://13.200.217.93:5005"

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        setIsAuth(false);
        setUser(null);
        return;
      }

      try {
        const { data } = await axios.get(`${User_service}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data);
        setIsAuth(true);
      } catch (error:any) {
        Cookies.remove("token");
        setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


  async function updateProfilepic(formData: any) {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const { data } = await axios.put(
        `${User_service}/api/user/update/picupdate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message || "Profile picture updated successfully");
      if (data.updateduser) {
        setUser((prev) =>
          prev ? { ...prev, profile_pic: data.updateduser.profile_pic } : null
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  }
   async function updateResume(formData: any) {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const { data } = await axios.put(
        `${User_service}/api/user/update/resumeupdate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message || "Resume updated successfully");
      if (data.updateduser) {
        setUser((prev) =>
          prev ? { ...prev, resume: data.updateduser.resume } : null
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to update resume");
    } finally {
      setLoading(false);
    }
  }
  async function updateUser(name: string, phoneNumber: string, bio: string) {
    setBtnLoading(true);
    try {
      const token = Cookies.get("token");
      const { data } = await axios.put(
        `${User_service}/api/user/update/profile`,
        { name, phone_number: phoneNumber, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message || "Profile updated successfully");
      if (data.user) {
        setUser((prev) => (prev ? { ...prev, ...data.user } : null));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to update profile");
    } finally {
      setBtnLoading(false);
    }
  }

  async function addSkill(skill: string) {
    setBtnLoading(true);
    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${User_service}/api/user/skill/add`,
        { skillname: skill.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message || "Skill added successfully");
      setUser((prev) => {
        if (!prev) return null;
        const currentSkills = prev.skills || [];
        if (currentSkills.includes(skill.trim())) return prev;
        return {
          ...prev,
          skills: [...currentSkills, skill.trim()],
        };
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to add skill");
    } finally {
      setBtnLoading(false);
    }
  }

  async function removeSkill(skill: string) {
    setBtnLoading(true);
    try {
      const token = Cookies.get("token");
      const { data } = await axios.delete(
        `${User_service}/api/user/skill/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            skillname: skill.trim(),
          },
        }
      );
      toast.success(data.message || "Skill removed successfully");
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          skills: (prev.skills || []).filter((s) => s !== skill.trim()),
        };
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to remove skill");
    } finally {
      setBtnLoading(false);
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        btnLoading,
        isAuth,
        setUser,
        setLoading,
        setIsAuth,
        setBtnLoading,
        updateProfilepic,
        updateResume,
        updateUser,
        addSkill,
        removeSkill,
      }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppProvider");
  }
  return context;
};
