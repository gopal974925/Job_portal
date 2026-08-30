"use client"
import Careerguide from '@/components/careerguide';
import Hero from '@/components/Hero';
import React from 'react'
import ResumeAnalyzer from "@/components/resume_analyzer"
import { useAppData } from '@/context/appContext';
import { Loading } from '@/components/ui/loading';
// import {Button} from "@/components/ui/button"
// import { Card } from '@/components/ui/card';

const Home = () => {
  const {loading}=useAppData();

  if(loading) return <Loading/>
  return (
    <div>
      <Hero/>
      <Careerguide/>
      <ResumeAnalyzer/>
    </div>
  ) 
}

export default Home ;