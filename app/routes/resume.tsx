import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import type { Route } from '../+types/root';
import { usePuterStore } from '~/lib/puter';
import Summary from '~/components/Summary';
import ATS from '~/components/ATS';
import Details from '~/components/Details';
export function meta({}: Route.MetaArgs) {
  return [
    { title: "TestResu | Review" },
    { name: "description", content: "Get a full scale Analysis of Your Resume..." },
  ];
}
const resume = () => {
  const {auth,kv,fs,isLoading} = usePuterStore();
  const {id} = useParams();

  const[resumeUrl,setResumeUrl]=useState('');
  const[imageUrl,setImageUrl]=useState('');
  const[feedback,setFeedback]=useState<Feedback | null>(null);
  const navigate = useNavigate();
    useEffect(()=>{
    if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
  },[isLoading])

  useEffect(()=>{
    const loadResume = async ()=>{
      const resume = await kv.get(`resume:${id}`);
      
      if(!resume) return;
      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath.path);
      if(!resumeBlob) return;
      
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl); 
      const imageBlob = await fs.read(data.imageFile.path);
      if(!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
      setFeedback(data.feedback);
      console.log({resumeUrl,imageUrl,feedback:data.feedback})



    };
    loadResume();
  },[id])

  return (
    <main className='!pt-0'>
      <nav className='resume-nav z-10 relative'>
        <Link to='/' className='back-button'>
          <img src="/icons/back.svg" alt="back button" className='w-2.5 h-2.5'/>
          <span className='text-gray-600 text-sm font-semibold'>Back to Home Page</span>
        </Link>
      </nav>
      <div className='flex flex-row w-full max-lg:flex-col-reverse'>
        <section className='feedback-section bg-[url("/images/bg-small.svg")] bg-cover h-[100vh] items-center justify-center pt-16'>
          {/* Added pt-16 for padding-top so nav is not overlapped */}
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-200 gradient-border max-sm:m-0 w-fit h-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img src={imageUrl} alt="Resume Image" title="Resume" className="block max-w-full h-auto" />
              </a>
            </div>
          )}
        </section>
        <section className='feedback-section'>
          <h2 className='text-4xl !text-black font-bold'>Resume Review</h2>
          {feedback ? (
            <div className='flex flex-col animate-in fade-in duration-1000 gap-8'>
             <Summary feedback = {feedback}/>
             <ATS score = {feedback.ATS.score || 0} suggestions={feedback.ATS.tips || [] }/>
              <Details feedback={feedback}/>

            </div>
          ):(
            <img src="/images/resume-scan-2.gif" alt="searching" className='w-full' />
          )}

        </section>
      </div>

    </main>
    )
}

export default resume