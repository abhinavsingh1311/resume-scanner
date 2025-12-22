const { extractText } = require('unpdf');

export async function POST(request) {

    try {
        const formData = await request.formData();
        const parsedFile = formData.get('resume')
        console.log(parsedFile.name);
        const buffer = await parsedFile.arrayBuffer();
        const { parser } = await extractText(buffer);
        return Response.json({ succcess: true, fileName: parsedFile.name, parser });

    }
    catch (err) {
        console.log('error with the formdata:', err)
        return Response.json({ error: 'Upload failed' }, { status: 500 });
    }

}
