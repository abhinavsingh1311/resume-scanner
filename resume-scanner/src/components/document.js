import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export default async function handleDownload(tailoredResume, fileName) {
    try {
        let cleanedResume = tailoredResume
            .replace(/\[RIGHT:\s*/g, '')  // Remove [RIGHT: 
            .replace(/\]/g, '')            // Remove closing ]
            .replace(/\\/g, '');           // Remove backslashes

        const lines = cleanedResume.split('\n');
        const children = [];
        let lastWasEmpty = false;

        for (const line of lines) {
            // Skip empty lines but add spacing
            if (line.trim() === '') {
                if (lastWasEmpty) continue;
                lastWasEmpty = true;
                children.push(new Paragraph({ text: '' }));
                continue;
            }

            lastWasEmpty = false;

            // Horizontal line (section divider)
            if (line.trim() === '---') {
                children.push(new Paragraph({
                    border: {
                        bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' }
                    },
                    text: ''
                }));
                continue;
            }

            // Section headers (all caps headers)
            if (/^(EDUCATION|SKILLS|EXPERIENCE|PROJECTS|LEADERSHIP|SUMMARY|TECHNICAL SKILLS|CERTIFICATIONS)$/.test(line.trim())) {
                children.push(new Paragraph({
                    children: [new TextRun({ text: line.trim(), bold: true, size: 24 })],
                    spacing: { before: 200 },
                    border: {
                        bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' }
                    }
                }));
                continue;
            }

            // Name (first non-empty line, centered, large, bold)
            if (children.length === 0 || (children.length === 1 && children[0].text === '')) {
                const name = line.trim().replace(/\*\*/g, '');
                children.push(new Paragraph({
                    children: [new TextRun({ text: name, bold: true, size: 36 })],
                    alignment: AlignmentType.CENTER
                }));
                continue;
            }

            // Contact info line (contains |, centered)
            if (line.includes('|') && children.length <= 2) {
                children.push(new Paragraph({
                    children: [new TextRun({ text: line.trim().replace(/\\/g, ''), size: 21 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 0 }  // No space after contact line
                }));
                continue;
            }

            // Bullet points
            if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('>')) {
                const text = line.trim().replace(/^[•\->]\s*/, '').replace(/\*\*/g, '');
                children.push(new Paragraph({
                    children: [new TextRun({ text: `• ${text}`, size: 21 })],
                    indent: { left: 360 }
                }));
                continue;
            }

            // Lines with **bold** markers
            if (line.includes('**')) {
                const parts = line.split(/(\*\*.*?\*\*)/);
                const textRuns = parts.map(part => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return new TextRun({ text: part.slice(2, -2), bold: true, size: 21 });
                    }
                    return new TextRun({ text: part.replace(/\\/g, ''), size: 21 });
                });
                children.push(new Paragraph({ children: textRuns }));
                continue;
            }

            // Regular line
            children.push(new Paragraph({
                children: [new TextRun({ text: line.replace(/\\/g, ''), size: 21 })]
            }));
        }

        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: { top: 720, right: 720, bottom: 720, left: 720 }
                    }
                },
                children
            }]
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, fileName);
        return true;
    }
    catch (err) {
        console.log("error downloading file:", err);
        throw err;
    }
}