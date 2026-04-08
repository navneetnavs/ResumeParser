const express = require('express');
const cors = require('cors'); // 1. Added CORS import
const { parsePDF } = require('./parser');
const { extractSalary, extractExperience, extractSkills } = require('./extractor');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Enable CORS so your frontend can talk to this API
app.use(cors()); 
app.use(express.json());

const calculateScore = (resumeSkills, jdSkills) => {
    if (jdSkills.length === 0) return 0;
    const matched = jdSkills.filter(skill => 
        resumeSkills.some(rs => rs.toLowerCase() === skill.toLowerCase())
    );
    // Matching score formula: (Matched JD Skills / Total JD Skills) × 100 [cite: 42]
    return Math.round((matched.length / jdSkills.length) * 100);
};

// API Endpoint for Job Matching 
app.get('/match', async (req, res) => {
    try {
        const resumePath = './data/resume.pdf';
        const resumeText = await parsePDF(resumePath);
        
        if (!resumeText) {
            return res.status(500).json({ error: "Could not parse PDF" });
        }

        const resumeSkills = extractSkills(resumeText);
        
        const sampleJD = {
            jobId: "JD001",
            role: "Backend Developer",
            aboutRole: "Responsible for backend development.",
            // JD Skills Extraction example [cite: 27-29]
            requiredSkills: ["Java", "Spring Boot", "Kafka", "MySQL", "Docker"]
        };

        const score = calculateScore(resumeSkills, sampleJD.requiredSkills);

        // Expected Output JSON Format [cite: 45-62]
        const output = {
            name: resumeText.split('\n').find(l => l.trim() !== '') || "Candidate",
            salary: extractSalary(resumeText),
            yearOfExperience: extractExperience(resumeText),
            resumeSkills: resumeSkills,
            matchingJobs: [{
                jobId: sampleJD.jobId,
                role: sampleJD.role,
                aboutRole: sampleJD.aboutRole,
                // Skill Mapping and Highlighting [cite: 35-38]
                skillsAnalysis: sampleJD.requiredSkills.map(skill => ({
                    skill: skill,
                    presentInResume: resumeSkills.some(rs => rs.toLowerCase() === skill.toLowerCase())
                })),
                matchingScore: score
            }]
        };

        res.json(output);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});