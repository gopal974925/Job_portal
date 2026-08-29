import Careerguide from '@/components/careerguide';
import Hero from '@/components/Hero';
import React from 'react'
import ResumeAnalyzer from "@/components/resume_analyzer"
// import {Button} from "@/components/ui/button"
// import { Card } from '@/components/ui/card';

const home = () => {
  return (
    <div>
      <Hero/>
      <Careerguide/>
      <ResumeAnalyzer/>
    </div>
  ) 
}

export default home ;