const fs = require('fs');
const pdfjsLib = require('pdfjs-dist');

const parsePDF = async (filePath) => {
    try {
        const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
        const loadingTask = pdfjsLib.getDocument({ data: dataBuffer, verbosity: 0 });
        const pdf = await loadingTask.promise;
        
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += pageText + "\n";
        }
        
        return fullText;
    } catch (error) {
        console.error("Error parsing file:", error.message);
        return null;
    }
};

module.exports = { parsePDF };