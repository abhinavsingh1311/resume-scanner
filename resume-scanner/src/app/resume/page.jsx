'use client';
import { useState } from 'react';
import Link from 'next/link';
import handleDownload from '../../components/document';

export default function ResumePage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [resumeText, setResumeText] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [jobDescription, setJobDescription] = useState("");
    const [tailoredResume, setTailoredResume] = useState(null);
    const [isGenerating, setIsGenerating] = useState(null);
    const [tips, setTips] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const form = new FormData();
            form.append('resume', selectedFile);
            form.append('jobDescription', jobDescription);

            setIsLoading(true);
            const response = await fetch('/api/upload', { method: 'POST', body: form });
            const data = await response.json();

            setResumeText(data.text);
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

    async function handleGenerate(e) {
        e.preventDefault();
        try {
            if (!resumeText || !jobDescription) {
                console.error('Missing resume text or job description');
                return;
            }

            setIsGenerating(true);

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeData: resumeText,
                    jobDescription: jobDescription
                })
            });

            const data = await response.json();

            if (data.success) {
                setTailoredResume(data.tailoredResume);
                setTips(data.tips);
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

    // RESULT VIEW
    if (tailoredResume && tips) {
        return (
            <div className="h-screen flex flex-col items-center bg-amber-50 bg-[url(/bg-leaves.jpg)] bg-cover bg-top dark:bg-black">
                <div className="flex-1 flex-col w-full max-w-4xl p-12 lg:px-16">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="font-bold text-2xl tracking-wide text-brown-700">
                            Your Tailored Resume
                        </h1>
                        <button
                            onClick={() => {
                                setTailoredResume(null);
                                setResumeText(null);
                                setJobDescription("");
                                setSelectedFile(null);
                                setTips(null);
                            }}
                            className="text-sm px-4 py-2 rounded-md bg-stone-200 text-brown-700 hover:bg-stone-300 transition-colors"
                        >
                            Start Over
                        </button>
                    </div>

                    {/* Resume Card */}
                    <div className="bg-amber-50 rounded-lg shadow-md p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-lg text-brown-600">Resume Preview</h2>
                            <button
                                onClick={() => {
                                    const baseName = selectedFile.name.replace(/\.(pdf|docx?)$/i, '');
                                    handleDownload(tailoredResume, `${baseName}-tailored.docx`);
                                }}
                                className="p-2 rounded-md bg-primary text-gray-100 hover:bg-secondary hover:text-[saddlebrown] transition-colors"
                            >
                                Download doc file
                            </button>
                        </div>
                        <div className="bg-stone-50 border-2 rounded-md p-4 max-h-96 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm text-stone-800 font-sans">
                                {tailoredResume}
                            </pre>
                        </div>
                    </div>

                    {/* Tips Card */}
                    <div className="bg-amber-50 rounded-lg shadow-md px-10 py-4">
                        <h2 className="font-semibold text-lg text-brown-600 mb-3">
                            Improvement Tips (Trust me AI gave these , not hardcoded!)
                        </h2>
                        <pre className="whitespace-pre-wrap text-sm text-stone-700 font-sans">
                            {tips}
                        </pre>
                    </div>

                </div>
            </div>
        );
    }

    // FORM VIEW
    return (
        <div className="min-h-screen flex flex-col items-center bg-amber-50  bg-[url(/bg-leaves.jpg)] bg-cover bg-top dark:bg-black py-8">
            <div className="flex flex-col w-full max-w-3xl px-6 bg-amber-50 p-12 lg:px-16">

                {/* Back Link */}
                <div className="mb-6">
                    <Link
                        href='/'
                        className="inline-flex items-center text-brown-400 hover:text-[orange] transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-stone-50 rounded-lg shadow-md p-6 lg:p-8">
                    <h1 className="font-bold text-2xl tracking-wide text-brown-700 text-center mb-6">
                        Upload Your Resume
                    </h1>

                    <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                        {/* File Input */}
                        <div className="mb-6">
                            <label
                                htmlFor="file"
                                className="block font-semibold text-brown-600 mb-2"
                            >
                                Choose a file
                            </label>
                            <div className="border-2 border-lined border-stone-300 rounded-lg p-6 text-center hover:border-brown-400 transition-colors">
                                <input
                                    onChange={handleFileChanges}
                                    type="file"
                                    id="file"
                                    name="file"
                                    accept=".doc, .docx, .pdf"
                                    className="w-full text-stone-600 bg-amber-50"

                                />
                                {/* {selectedFile && (
                                    <p className="mt-2 text-sm text-green-600">
                                        {selectedFile.name}
                                    </p>
                                )} */}
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="mb-6">
                            <label
                                htmlFor="jobDescription"
                                className="block font-semibold text-brown-600 mb-2"
                            >
                                Paste the job description
                            </label>
                            <textarea
                                name="jobDescription"
                                id="jobDescription"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows={6}
                                placeholder="Don't be lazy, provide thorough description ;)"
                                className="w-full p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-400 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={!selectedFile || isLoading || !jobDescription.trim()}
                            type="submit"
                            className="w-full py-3 rounded-md bg-primary text-gray-100 hover:bg-secondary hover:text-[saddlebrown] disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed transition-colors font-semibold"
                        >
                            {isLoading ? 'Processing...' : 'Extract Resume'}
                        </button>
                    </form>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="mt-6 p-4 bg-amber-100 rounded-lg text-center">
                            <p className="text-brown-600">Processing your resume...</p>
                        </div>
                    )}
                </div>

                {/* Extracted Resume Section */}
                {!isLoading && resumeText && (
                    <div className="bg-white rounded-lg shadow-md p-6 lg:p-8 mt-6">
                        <h2 className="font-semibold text-lg text-brown-600 mb-3">
                            Extracted Resume
                        </h2>
                        <div className="bg-stone-50 rounded-md p-4 max-h-64 overflow-y-auto mb-4">
                            <pre className="whitespace-pre-wrap text-sm text-stone-700 font-sans">
                                {resumeText}
                            </pre>
                        </div>

                        <button
                            disabled={!jobDescription.trim() || isGenerating}
                            type="button"
                            onClick={handleGenerate}
                            className="w-full py-3 rounded-md bg-brown text-gray-100 hover:bg-secondary hover:text-[saddlebrown] disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed transition-colors font-semibold"
                        >
                            {isGenerating ? 'SHEEEEEEEPS' : 'Generate Tailored Resume'}
                        </button>

                        {isGenerating && (
                            <div className="mt-4 p-4 bg-amber-100 rounded-lg text-center">
                                <p className="text-brown-600">
                                    Generating your tailored resume with AI... HAVE PATIENCE !!
                                </p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}