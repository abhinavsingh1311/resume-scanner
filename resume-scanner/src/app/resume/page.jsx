'use client';
import { useState } from 'react';

export default function ResumePage() {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            //console.log(selectedFile);
            const form = new FormData();
            form.append('resume', selectedFile);
            const response = await fetch('/api/upload', { method: 'POST', body: form });
            const data = response.json();
            console.log('response:', data);
        }
        catch (err) {
            throw new Error("error submitting", err);
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
        <div>
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
                                disabled={!selectedFile}
                                type="submit"
                                className={isHovered ? "btn-primary" : "btn-secondary"}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}