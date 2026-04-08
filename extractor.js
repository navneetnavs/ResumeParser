const skillsData = require('./skills.json');

const extractSalary = (text) => {
    // Matches common salary formats like 12 LPA, $150k, or ranges [cite: 19, 134, 441]
    const salaryRegex = /(\$?\d{1,3}(?:,\d{3})*(?:\s*-\s*\$?\d{1,3}(?:,\d{3})*)?|[\d.]+\s*(?:LPA|CTC|per annum|per year))/gi;
    const match = text.match(salaryRegex);
    return match ? match[0].trim() : "Not Mentioned";
};

const extractExperience = (text) => {
    // Matches digits followed by "years" [cite: 25, 109, 221]
    const expRegex = /(\d+(\.\d+)?)\s*(?:\+)?\s*years?/gi;
    const match = expRegex.exec(text);
    return match ? parseFloat(match[1]) : 0;
};

const extractSkills = (text) => {
    const foundSkills = [];
    const lowerText = text.toLowerCase();
    
    skillsData.technicalSkills.forEach(skill => {
        // Escape special chars and match as a distinct word [cite: 28]
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped.toLowerCase()}\\b`, 'i');
        if (regex.test(lowerText)) {
            foundSkills.push(skill);
        }
    });
    return [...new Set(foundSkills)];
};

module.exports = { extractSalary, extractExperience, extractSkills };