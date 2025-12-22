import { Document, Packer, TextRun, Paragraph } from 'docx';
import { saveAs } from 'file-saver';

export default async function handleDownload(tailoredResume, fileName) {
    try {
        const newlines = tailoredResume.split('\n');
        //create para for each line
        const para = newlines.map((newline) => {

            return new Paragraph({ children: [new TextRun(newline)] })

        })

        //create document with those new paragraphs
        const document = new Document({
            sections: [{
                properties: {},
                children: para
            }]
        });

        const newBlob = await Packer.toBlob(document);
        saveAs(newBlob, fileName);
        return true;
    }
    catch (err) {
        console.log("error downloading file:", err);
        throw err;
    }
}