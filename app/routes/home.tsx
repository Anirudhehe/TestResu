import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants/index";
import ResumeCard from "~/components/ResumeCard";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { usePuterStore } from '~/lib/puter'

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TestResu" },
    { name: "description", content: "Test Your Resume and Become Job Ready!" },
  ];
}

export default function Home() {
   const {auth} = usePuterStore();
  const navigate= useNavigate();

  useEffect(()=>{
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  },[auth.isAuthenticated])
  
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Test Your Resume and Track Your Applications</h1>
        <h2>
          Optimize your resume, monitor progress, and land interviews faster.
        </h2>
      </div>
    {resumes.length>0 && (      
      <div className="resume-section flex flex-row gap-2">
      
      {resumes.map((resm)=>(
        <ResumeCard key={resm.id} resume={resm}/>
      ))}
    </div>
    )}
    </section>
  </main>;
}
