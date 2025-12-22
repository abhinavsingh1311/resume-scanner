import { extractText, getDocumentProxy } from 'unpdf';
import mammoth from 'mammoth';

export async function POST(request) {

    try {
        const formData = await request.formData();
        const parsedFile = formData.get('resume');
        const jobDescription = formData.get('jobDescription');
        console.log(parsedFile.name);
        const buffer = await parsedFile.arrayBuffer();
        let text;

        if (parsedFile.name.endsWith('.pdf')) {
            const pdf = await getDocumentProxy(new Uint8Array(buffer));
            const result = await extractText(pdf, { mergePages: true });
            text = result.text;
        }
        else if (parsedFile.name.endsWith('.docx') || parsedFile.name.endsWith('.doc')) {
            const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
            text = result.value;
        }
        else {
            return Response.json({ error: 'Unsupported file type' }, { status: 400 });
        }

        return Response.json({ success: true, fileName: parsedFile.name, text, jobDescription });

    }
    catch (err) {
        console.log('error with the formdata:', err)
        return Response.json({ error: 'Upload failed' }, { status: 500 });
    }

}
