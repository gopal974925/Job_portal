import { ReactNode } from "react";

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


export interface User {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  phone_number?: string;
  role: "jobseeker" | "jobrecruiter" | "jobrecuriter";
  bio: string | null;
  resume: string | null;
  resume_public_id: string | null;
  profile_pic: string | null;
  profile_pic_public_id: string | null;
  skills: string[];
  subscription_status: boolean;
}

export interface AppContextType {
  user: User | null;
  loading: boolean;
  btnLoading: boolean;
  isAuth: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setBtnLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateProfilepic:(formData:any)=>Promise<void>;
  updateResume:(formData:any)=>Promise<void>;
  updateUser:(name:string,phone_number:string,bio:string)=>Promise<void>;
  addSkill:(skill:string)=>Promise<void>;
  removeSkill:(skill:string)=>Promise<void>;
}


export interface AppProviderProps{
  children:ReactNode;
}
export interface Accountpropes{
  user:User;
  isYourAccount:boolean;
}

export interface Job {
  job_id: number;
  title: string;
  description: string;
  salary?: number | string | null;
  location?: string | null;
  job_type?: string | null;
  openings?: number;
  role?: string;
  work_location?: string;
  company_id: number | string;
  posted_by_recruiter_id?: number | string;
  created_at?: string;
  is_active?: boolean;
  company_name?: string;
  company_logo?: string;
}

export interface Company {
  company_id: number | string;
  _id?: string;
  name: string;
  description: string;
  website: string;
  logo: string;
  logo_public_id?: string;
  recruiter_id?: number | string;
  created_at?: string;
  jobs?: Job[];
}