'use client';
import { useState } from 'react';

export default function ResumePage() {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [resumeText, setResumeText] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [jobDescription, setJobDescription] = useState(" ");
    const [tailoredResume, setTailoredResume] = useState(null);
    const [isGenerating, setIsGenerating] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            //console.log(selectedFile);
            const form = new FormData();
            form.append('resume', selectedFile);
            form.append('jobDescription', jobDescription);

            //set loading true
            setIsLoading(true);
            const response = await fetch('/api/upload', { method: 'POST', body: form });
            const data = await response.json();

            setResumeText(data.text);
            console.log('response:', data);
            console.log('Resume text:', data.text);
            console.log('Job description:', jobDescription);
        }
        catch (err) {
            throw new Error("error submitting", err);
        }
        finally {
            setIsLoading(false);
        }

    }

    const handleFileChanges = (e) => {
        try {
            const file = e.target.files[0];
            if (file) {
                setSelectedFile(file);
            }
        }
        catch (err) {
            console.log('error uploading file:', err)
        }
    }
    async function HandleGenerate(e) {
        e.preventDefault();
        try {
            if (!resumeText || !jobDescription) {
                console.error('Missing resume text or job description');
                return;
            }

            setIsGenerating(true);

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeData: resumeText,
                    jobDescription: jobDescription
                })
            });

            const data = await response.json();

            if (data.success) {
                setTailoredResume(data.tailoredResume);
                console.log('Tailored resume generated successfully');
            } else {
                console.error('Error generating resume:', data.error);
            }
        }
        catch (err) {
            console.error('Error generating resume:', err);
        }
        finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className='container m-4'>
            <main>
                <h1>Upload your resume</h1>
                <div>
                    <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                        <div>
                            <label htmlFor="file"> Choose a file to Upload</label>
                            <input onChange={handleFileChanges} type="file" id="file" name="file" accept=".doc, .docx, .pdf" />
                        </div>
                        <div>
                            <label htmlFor="jobDescription">Paste the job description</label>
                            <textarea
                                name="jobDescription"
                                id="jobDescription"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows={8}
                                placeholder='Paste/Write the job description here (Do it , dont be lazy!)'
                            />
                        </div>
                        <div>
                            <button
                                disabled={!selectedFile || isLoading || !jobDescription}
                                type="submit"
                                className={isHovered ? "btn-primary" : "btn-secondary"}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                {isLoading ? 'Processing...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                    {isLoading && (
                        <div>
                            <p>Processing your resume, this may take a moment...</p>
                        </div>
                    )}
                </div>
            </main>
            {!isLoading && resumeText && (
                <div className='container mt-3 p-6'>
                    <div>
                        <h2>Extracted Resume</h2>
                        <pre className='whitespace-pre-wrap'>{resumeText}</pre>
                    </div>
                </div>
            )}

            {!isLoading && resumeText && jobDescription && (
                <div className='p-4'>
                    <button
                        disabled={!jobDescription || !resumeText || isGenerating}
                        type="button"
                        className={isHovered ? "btn-primary" : "btn-secondary"}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={HandleGenerate}
                    >
                        {isGenerating ? 'Generating...' : 'Generate tailored resume'}
                    </button>
                </div>
            )}

            {isGenerating && (
                <div className='p-4'>
                    <p>Generating your tailored resume with AI... This may take a moment.</p>
                </div>
            )}

            {!isGenerating && tailoredResume && (
                <div className='container mt-3 p-6'>
                    <div>
                        <h2>Your Tailored Resume</h2>
                        <pre className='whitespace-pre-wrap'>{tailoredResume}</pre>
                    </div>
                </div>
            )}

        </div>
    )
}