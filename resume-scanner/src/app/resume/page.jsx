'use client';
import { useState } from 'react';

export default function ResumePage() {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [resumeText, setResumeText] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    async function handleSubmit(e) {
        e.preventDefault();
        try {
            //console.log(selectedFile);
            const form = new FormData();
            form.append('resume', selectedFile);

            //set loading true
            setIsLoading(true);
            const response = await fetch('/api/upload', { method: 'POST', body: form });
            const data = await response.json();

            setResumeText(data.text);
            console.log('response:', data);
            console.log(data.text);
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
                            <button
                                disabled={!selectedFile || isLoading}
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

        </div>
    )
}