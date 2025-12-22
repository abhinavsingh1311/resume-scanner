export async function POST(request) {

    try {
        const formData = await request.formData();
        const parsedFile = formData.get('resume')
        console.log(parsedFile.name);

        return Response.json({ succcess: true, fileName: parsedFile.name });
    }
    catch (err) {
        console.log('error with the formdata:', err)
        return Response.json({ error: 'Upload failed' }, { status: 500 });
    }

}