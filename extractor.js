const skillsData = require('./skills.json');

const extractSalary = (text) => {
    const salaryRegex = /(\$?\d{1,3}(?:,\d{3})*(?:\s*-\s*\$?\d{1,3}(?:,\d{3})*)?|[\d.]+\s*(?:LPA|CTC|per annum|per year))/gi;
    const match = text.match(salaryRegex);
    return match ? match[0].trim() : "Not Mentioned";
};

const extractExperience = (text) => {
    const expRegex = /(\d+(\.\d+)?)\s*(?:\+)?\s*years?/gi;
    const match = expRegex.exec(text);
    return match ? parseFloat(match[1]) : 0;
};

const extractSkills = (text) => {
    const foundSkills = [];
    const lowerText = text.toLowerCase();
    
    skillsData.technicalSkills.forEach(skill => {
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped.toLowerCase()}\\b`, 'i');
        if (regex.test(lowerText)) {
            foundSkills.push(skill);
        }
    });
    return [...new Set(foundSkills)];
};

module.exports = { extractSalary, extractExperience, extractSkills };