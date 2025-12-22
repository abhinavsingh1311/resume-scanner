const { extractText, getDocumentProxy } = require('unpdf');

export async function POST(request) {

    try {
        const formData = await request.formData();
        const parsedFile = formData.get('resume')
        console.log(parsedFile.name);
        const buffer = await parsedFile.arrayBuffer();
        const pdf = await getDocumentProxy(new Uint8Array(buffer));
        const { text } = await extractText(pdf, { mergePages: true });
        return Response.json({ success: true, fileName: parsedFile.name, text });

    }
    catch (err) {
        console.log('error with the formdata:', err)
        return Response.json({ error: 'Upload failed' }, { status: 500 });
    }

}
