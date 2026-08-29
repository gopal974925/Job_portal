export interface JobOption {
  title: string;
  responsibilities: string;
  why: string;
}

export interface SkillToLearn {
  title: string;
  why: string;
  how: string;
}

export interface SkillCategory {
  category: string;
  skills: SkillToLearn[];
  catagory?: string;
}

export interface LearningApproach {
  title: string;
  points: string[];
}

export interface CareerGuideResponse {
  summary: string;
  jobOptions?: JobOption[];
  skillsToLearn?: SkillCategory[];
  learningApproach?: LearningApproach;
  joboption?: JobOption[];
  skillstolearn?: SkillCategory[];
  learningapproach?: LearningApproach;
}

export type joboption = JobOption;
export type skillstolearn = SkillToLearn;
export type skillcatagory = SkillCategory;
export type learningapporach = LearningApproach;
export type careerguideresponse = CareerGuideResponse;

export interface ScoreCategory {
  score: number;
  feedback: string;
}

export interface ScoreBreakdown {
  formatting?: ScoreCategory;
  keywords?: ScoreCategory;
  structure?: ScoreCategory;
  readability?: ScoreCategory;
  [key: string]: ScoreCategory | undefined;
}

export interface Suggestion {
  category?: string;
  issue: string;
  recommendation?: string;
  priority: "high" | "medium" | "low" | string;
  catagory?: string;
  recommnedation?: string;
}

export interface ResumeAnalysisResponse {
  atsScore: number;
  scoreBreakdown?: ScoreBreakdown;
  scoreBreakedown?: ScoreBreakdown;
  suggestions: Suggestion[];
  strengths?: string[];
  strenghs?: string[];
  summary: string;
}

export type ScoreBreakedown = ScoreBreakdown;
export const utils_service = "http://localhost:3001";
