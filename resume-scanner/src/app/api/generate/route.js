import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';

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

        const templatePath = path.join(process.cwd(), 'src', 'template', 'resume-template.docx');
        const templateBuffer = await readFile(templatePath);
        const { value: templateText } = await mammoth.extractRawText({ buffer: templateBuffer });
        const prompt = `You are an expert resume writer and ATS optimization specialist.
                         ## INPUT
                        **Current Resume:**
                        ${resumeData}

                        **Target Job Description:**
                        ${jobDescription}

                        ## TASK
                        Rewrite the resume following the exact structure and formatting rules below.

                        ## FORMATTING RULES (FOLLOW EXACTLY)

                        **HEADER:**
                        - Line 1: Full name in ALL CAPS, centered
                        - Line 2: City, State | Phone | Email | LinkedIn | GitHub (separated by |)

                        **SECTION HEADERS:**
                        - Use these exact headers: EDUCATION, SKILLS, EXPERIENCE, PROJECTS, LEADERSHIP (if applicable)
                        - Each header should be followed by a horizontal line (use "---" on next line)

                        **EDUCATION SECTION:**
                        - **Institution Name**
                        - Date Range should be on the SAME LINE as the institute name
                        - Degree/Diploma (right-aligned: GPA if strong)
                        - Relevant Coursework: list courses separated by commas

                        **SKILLS SECTION:**
                        - Languages: xxx, xxx, xxx
                        - Frameworks: xxx, xxx, xxx
                        - Databases: xxx, xxx
                        - Tools: xxx, xxx, xxx

                        **EXPERIENCE/PROJECTS SECTIONS:**
                        - **Company/Project Name**, Role, Location [right-align: Date Range]
                        - • Achievement bullet with quantified result
                        - • Achievement bullet with quantified result
                        - • Achievement bullet with quantified result

                        **FORMATTING MARKERS:**
                        - Use **text** for bold (names, companies, institutions)
                        - Use • for bullet points
                        - Use bold text for right-aligned dates
                        - Use --- for horizontal lines under section headers

                        ## REFERENCE CONTENT (for structure only)
                        ${templateText}

                        ## REQUIREMENTS
                        - ATS-friendly format (single column, no tables)
                        - Quantify achievements (e.g., "Reduced load time by 40%")
                        - Match keywords from job description naturally
                        - Keep to one page
                        - Be truthful - don't invent experience

                        ## OUTPUT INSTRUCTIONS
                        Return ONLY the formatted resume. No introductions. Start with the name.

                        After the resume, add exactly this separator: |||TIPS|||
                        Then list 5 brief improvement tips.`;

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
        return Response.json({ success: false, error: 'Generation failed' }, { status: 500 });
    }
}
