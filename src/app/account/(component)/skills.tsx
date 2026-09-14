"use client";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppData } from "@/context/appContext";
import { Accountpropes } from "@/type";
import { Award, Plus, Sparkle, X } from "lucide-react";
import React, { useState } from "react";

const Skills: React.FC<Accountpropes> = ({ user, isYourAccount }) => {
  const { addSkill, removeSkill, btnLoading } = useAppData();
  const [skill, setSkill] = useState("");

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
    <div className="max-w-5xl mx-auto p-4 py-6">
      <Card className="shadow-lg border-2 overflow-hidden">

<div className="bg-blue-500 p-6">
          <div className="flex items-center gap-3 mb-2">
            
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Award size={24} className="text-blue-500 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {isYourAccount ? "Your Subscription" : `${user?.name}'s Skills`}
            </CardTitle>
          </div>

          {user?.role === "jobseeker" && (
            <CardDescription className="text-blue-50 mt-2">
              {
                user.subscription_status?<div>
                    true
                </div>:<div>
                  false
                </div>
              }
            </CardDescription>
          )}
        </div>



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