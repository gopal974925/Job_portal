"use client";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppData } from "@/context/appContext";
import { Accountpropes } from "@/type";
import { Award, CheckCircle2, Crown, Plus, Sparkle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Skills: React.FC<Accountpropes> = ({ user, isYourAccount }) => {
  const { addSkill, removeSkill, btnLoading } = useAppData();
  const [skill, setSkill] = useState("");
  const router = useRouter();

  const AddSkillhandler = async () => {
    if (!skill.trim()) return;
    await addSkill(skill.trim());
    setSkill("");
  };

  const handlekeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      AddSkillhandler();
    }
  };

  const removeSkillhandler = async (skillToRemove: string) => {
    if (confirm(`Are you sure you want to remove "${skillToRemove}"?`)) {
      await removeSkill(skillToRemove);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Subscription Section */}
      {isYourAccount && user?.role === "jobseeker" && (
        <Card className="shadow-lg border-2 overflow-hidden">
          <div className="bg-blue-500 p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Crown size={24} className="text-blue-500 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Your Subscription
              </CardTitle>
            </div>
            <CardDescription className="text-blue-50 mt-2">
              Manage your premium features and benefits.
            </CardDescription>
          </div>
          
          <div className="p-6">
            <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border">
              {!user.subscription_status ? (
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-semibold text-lg mb-1">No Active Subscription</p>
                    <p className="text-sm opacity-70">
                      Subscribe to unlock premium features and benefits.
                    </p>
                  </div>
                  <Button className="gap-2" onClick={() => router.push("/subscribe")}>
                    <Crown size={18} /> Subscribe Now
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={20} className="text-green-600" />
                      <p className="font-semibold text-lg text-green-600">Active Subscription</p>
                    </div>
                    <p className="text-sm opacity-70">
                      You are currently enjoying premium benefits.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-medium border border-green-200 dark:border-green-800">
                    <CheckCircle2 size={18} /> Subscribed
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Skills Section */}
      <Card className="shadow-lg border-2 overflow-hidden">
        <div className="bg-blue-500 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Award size={24} className="text-blue-500 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {isYourAccount ? "Your Skills" : `${user?.name}'s Skills`}
            </CardTitle>
          </div>

          {user?.role === "jobseeker" && (
            <CardDescription className="text-blue-50 mt-2">
              Showcase your skills to potential employers. Add your skills below to highlight your expertise and stand out in the job market.
            </CardDescription>
          )}
        </div>

        {/* Add skill input area */}
        {isYourAccount && (
          <div className="p-4 border-b">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Sparkle
                  className="text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="e.g. React, Node.js, Python..."
                  className="h-11 pl-10 bg-background w-full"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyDown={handlekeypress}
                />
              </div>
              <Button
                onClick={AddSkillhandler}
                className="h-11 gap-2 px-6"
                disabled={!skill.trim() || btnLoading}
              >
                <Plus size={18} /> Add Skill
              </Button>
            </div>
          </div>
        )}

        {/* Skills list */}
        <div className="p-6">
          {user?.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-sm font-medium transition-colors"
                >
                  <span>{s}</span>
                  {isYourAccount && (
                    <button
                      type="button"
                      onClick={() => removeSkillhandler(s)}
                      className="hover:text-red-500 transition-colors rounded-full p-0.5"
                      title={`Remove ${s}`}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No skills added yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Skills;