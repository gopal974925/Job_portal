"use client";

import React, { useState } from "react";
import { BookOpen, Lightbulb, Sparkles, Target, TrendingUp, X } from "lucide-react";
import { CareerGuideResponse, utils_service } from "@/type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";

const Careerguide = () => {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CareerGuideResponse | null>(null);

  const addSkill = () => {
    const skill = currentSkill.trim();

    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const getCareerGuide = async () => {
    if (skills.length === 0) {
      alert("Please add at least one skill");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${utils_service}/api/career`, {
        skills: skills,
      });
      setResponse(data);
    } catch (error:any ) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to generate career guidance"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setSkills([]);
    setCurrentSkill("");
    setResponse(null);
    setOpen(false);
  };

  const jobOptions = response?.jobOptions || response?.joboption || [];
  const skillsToLearn = response?.skillsToLearn || response?.skillstolearn || [];
  const learningApproach = response?.learningApproach || response?.learningapproach;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full
          border bg-blue-50 dark:bg-blue-900 mb-4"
        >
          <Sparkles size={16} className="text-blue-600" />
          <span className="text-sm font-medium">AI-Powered Career Guidance</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Discover Your Career Path
        </h1>

        <p className="text-lg opacity-70 max-w-2xl mx-auto mb-8">
          Get personalized job recommendations and learning roadmaps based on
          your skills.
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button size="lg" className="gap-2 h-12 px-8">
                <Sparkles size={18} />
                Get Career Guidance
              </Button>
            }
          />

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {!response ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="text-blue-600" />
                    Tell us about yourself
                  </DialogTitle>

                  <DialogDescription>
                    Add your technical skills to receive personalized career
                    recommendations.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Add Skill */}
                  <div className="space-y-2">
                    <Label htmlFor="skill">Add Skill</Label>

                    <div className="flex gap-2">
                      <Input
                        id="skill"
                        placeholder="e.g., React, Node.js, Python..."
                        value={currentSkill}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        className="h-11"
                      />

                      <Button
                        onClick={addSkill}
                        type="button"
                        className="h-11"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="space-y-2">
                      <Label>Your Skills ({skills.length})</Label>

                      <div className="flex flex-wrap gap-2">
                        {skills.map((s) => (
                          <div
                            key={s}
                            className="inline-flex items-center gap-2
                            pl-3 pr-2 py-1.5 rounded-full
                            bg-blue-100 dark:bg-blue-900/30
                            border border-blue-200 dark:border-blue-800"
                          >
                            <span className="text-sm font-medium">{s}</span>

                            <Button
                              type="button"
                              onClick={() => removeSkill(s)}
                              className="h-5 w-5 rounded-full bg-red-500
                              hover:bg-red-600 p-0 text-white"
                              aria-label={`Remove ${s}`}
                            >
                              <X size={13} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Generate Button */}
                  <Button
                    onClick={getCareerGuide}
                    disabled={loading || skills.length === 0}
                    className="w-full h-11 gap-2"
                  >
                    <Sparkles size={18} />

                    {loading
                      ? "Generating Career Guidance..."
                      : "Generate Career Guidance"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6 py-4">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <Target className="text-blue-600 shrink-0" size={24} />
                    Your Personalized Career Guide
                  </DialogTitle>
                </DialogHeader>

                {/* Summary */}
                <div
                  className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30
                  border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="text-blue-600 mt-1 shrink-0" size={20} />
                    <div>
                      <h3 className="font-semibold mb-2">Career Summary</h3>
                      <p className="text-sm leading-relaxed opacity-90">
                        {response.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommended Career Paths */}
                {jobOptions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      Recommended Career Paths
                    </h3>

                    <div className="space-y-3">
                      {jobOptions.map((job, index) => (
                        <div
                          className="p-4 rounded-lg border hover:border-blue-500 transition-colors"
                          key={index}
                        >
                          <h4 className="font-semibold text-base mb-2">
                            {job.title}
                          </h4>

                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium opacity-70 block">
                                Responsibilities
                              </span>
                              <span className="opacity-80">
                                {job.responsibilities}
                              </span>
                            </div>

                            <div>
                              <span className="font-medium opacity-70 block">
                                Why this role:
                              </span>
                              <span className="opacity-80">{job.why}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills to learn */}
                {skillsToLearn.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp size={20} className="text-blue-600" />
                      Skills to Enhance Your Career
                    </h3>
                    <div className="space-y-4">
                      {skillsToLearn.map((categoryItem, catIndex) => (
                        <div key={catIndex} className="space-y-2">
                          <h4 className="font-semibold text-sm text-blue-600">
                            {categoryItem.category || categoryItem.catagory}
                          </h4>
                          <div className="space-y-2">
                            {categoryItem.skills?.map((skillItem, skillIndex) => (
                              <div
                                key={skillIndex}
                                className="p-3 rounded-lg bg-secondary text-sm space-y-1"
                              >
                                <p className="font-medium">
                                  {skillItem.title}
                                </p>
                                {skillItem.why && (
                                  <p className="text-xs opacity-70">
                                    <span className="font-medium">Why: </span>
                                    {skillItem.why}
                                  </p>
                                )}
                                {skillItem.how && (
                                  <p className="text-xs opacity-70">
                                    <span className="font-medium">How: </span>
                                    {skillItem.how}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Approach */}
                {learningApproach && (
                  <div
                    className="p-4 rounded-lg border bg-blue-50/50
                    dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                  >
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BookOpen size={20} className="text-blue-600" />
                      {learningApproach.title}
                    </h3>
                    <ul className="space-y-2">
                      {learningApproach.points?.map((point, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-start gap-2"
                        >
                          <span className="text-blue-600 mt-0.5">💠</span>
                          <span
                            className="opacity-90"
                            dangerouslySetInnerHTML={{ __html: point }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  onClick={resetDialog}
                  variant="outline"
                  className="w-full"
                >
                  Start a new Analysis
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Careerguide;