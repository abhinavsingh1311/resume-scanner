import Anthropic from '@anthropic-ai/sdk';
import { error } from 'node:console';

const client = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'],

});


export async function POST(request) {
    try {
        const { resumeData, jobDescription } = await request.json();
        if (!resumeData || !jobDescription) {
            return Response.json({ error: 'Missing data !' },
                { status: 400 })
        }

        const message = await client.messages.create({
            max_tokens: 4096,
            messages: [{
                role: 'user', content: `Hello Claude, Act as if your an expert on resume analysis and an expert HR Manager, I will provide you with my resume and the job desription
        of the job i am applying for, I want you to review my resume and then compare it against the job description and provide me with an updated and tailored 
        resume. Remmeber to only output doc file, use an ATS friendly format and real metrics, for eg. improved performance by x% that led to customer retention by y%.
        Ensure to keep it under one page if the experience is less than 10 years and use professional fonts only. At the end , I want you to also provide me with 5 bullet points , that 
        are clearly structed and defined (keep them short) . These bullet points should provide me with some advice and takes on how I can improve my resume in general.
        So here is my resume: ${resumeData} and here is the job description: ${jobDescription}`
            }],
            model: 'claude-3-opus-latest',
        });
        return Response.json({ success: true, tailoredResume: message.content[0].text });
    }
    catch (error) {
        console.log("Error getting data :", error);
        return Response.json({ status: 500 })
    }
}
