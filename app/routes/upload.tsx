import { AIResponseFormat, prepareInstructions } from 'constants/index';
import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router';
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';
const upload = () => {
    const {auth,isLoading,fs,ai,kv} = usePuterStore();
    const [isProcessing,setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const [statusText,setStatusText] = useState('');
    const[file,setFile]=useState<File | null>(null);
    const handleFileSelect = (file: File | null) =>{
        setFile(file)
    }

    const handleAnalyse = async ({companyName,jobTitle,jobDescription}:{companyName:string,jobTitle:string,jobDescription:string,file:File} )=>{
        setIsProcessing(true);
        setStatusText('Uploading the file...');
        if (!file) {
            setStatusText('No file selected.');
            setIsProcessing(false);
            return;
        }
        const uploadedFile = await fs.upload([file]); 

        if(!uploadedFile) return setStatusText('Error uploading the file');

        setStatusText('Converting to an Image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Failed to convert PDF to image');
        setStatusText('Uploading the image');
        const uploadedImage = await fs.upload([imageFile.file]); 

        if(!uploadedImage) return setStatusText('Error uploading the image');
        setStatusText('Preparing Data for analyse...')
        const uuid = generateUUID();

        const data ={
            id: uuid,
            resumePath:uploadedFile,
            imageFile:uploadedImage,
            companyName,
            jobTitle,
            jobDescription,
            feedback:"",
        }
        
        await kv.set(`resume:${uuid}`,JSON.stringify(data));
        setStatusText('Analysing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle,jobDescription})
        )
        if(!feedback) return setStatusText("No feedback recieved");

        const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete, redirecting...");
    console.log(data);
    
    }

    const handleSubmit =(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData  = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title')as string;
        const jobDescription = formData.get('job-description')as string;
        
        if(!file) return;

        handleAnalyse({companyName,jobDescription,jobTitle,file});
    }

  return (
   <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
    <section className="main-section">
        <div className='page-heading py-16'>
            <h1>
                AI Feedback for your Dream Job
            </h1>
            {isProcessing ? (
                <>
                <h2>
                    {statusText}
                </h2>
                <img src="/images/resume-scan.gif" className='w-full' alt="scanning" /></>
            ):(<>
            <h2>
                    Drop Your Resume Here & Get ATS score and Tips
                </h2>
            </>
                
            )}
            {!isProcessing && (
                <form id = "upload-form" onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
                    <div className='form-div'>
                        <label htmlFor="company-name">Company Name</label>
                        <input type="text" name="company-name" id="company-name" placeholder='Comapany Name' />

                    </div>
                    <div className='form-div'>
                        <label htmlFor="job-title">Job Title</label>
                        <input type="text" name="job-title" id="job-title" placeholder='Job Title' />

                    </div>
                    <div className='form-div'>
                        <label htmlFor="company-name">Job Description</label>
                        <textarea rows={5} name="job-description" id="job-descriptio" placeholder='Job Description '/>

                    </div>
                    <div className='form-div'>
                        <label htmlFor="uploader">Upload Resume</label>
                    </div>
                       <FileUploader onFileSelect = {handleFileSelect}/>
                    <button className='primary-button'>Analyse Resume</button>

                </form>
            ) }
        </div>
    </section>
    </main>
  )
}

export default upload