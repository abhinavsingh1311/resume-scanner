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

        const prompt = `You are an expert resume writer and ATS optimization specialist.
                        ## INPUT
                        **Current Resume:**
                        ${resumeData}

                        **Target Job Description:**
                        ${jobDescription}

                        ## TASK
                        Rewrite the resume to align with the job description while maintaining truthfulness.

                        ## REQUIREMENTS
                        - ATS-friendly format (simple headers, no tables/columns)
                        - Quantify achievements where possible (e.g., "Reduced load time by 40%")
                        - Match keywords from job description naturally
                        - Keep to one page
                        - Use clear section headers: Summary, Experience, Skills, Education etc.

                        ## OUTPUT FORMAT
                        First, output the complete tailored resume in plain text.
                        
                        ## OUTPUT INSTRUCTIONS
                        Return ONLY the resume text. No introductions like "Here is your resume". No explanations. Start directly with the candidate's name and end after the last section.

                        After the resume, add exactly this separator: |||TIPS|||
                        Then, provide 5 brief bullet points on how to strengthen the resume further.`;

        const message = await client.messages.create({
            max_tokens: 4096,
            messages: [{
                role: 'user', content: prompt
            }],
            model: 'claude-3-opus-latest',
        });

        const [resume, tips] = message.content[0].text.split('|||TIPS|||');
        return Response.json({ success: true, tailoredResume: resume.trim(), tips: tips?.trim() });
    }
    catch (error) {
        console.log("Error getting data :", error);
        return Response.json({ status: 500 })
    }
}
