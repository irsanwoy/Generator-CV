import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateCVContent(cvData: any, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
You are an expert CV/resume writer and ATS optimization specialist. Generate a complete, ATS-friendly CV based on the following information:

**Personal Info:**
- Name: ${cvData.name}
- Email: ${cvData.email}
- Phone: ${cvData.phone}
- Location: ${cvData.location}
- Education: ${cvData.education}
- Experience Level: ${cvData.experienceLevel}
- Experience Field: ${cvData.experienceField || 'Not specified'}

**Job Description (Target Position):**
${cvData.jobDescription}

**CRITICAL INSTRUCTIONS:**

1. **Detect Location & Format:**
   - If job is in Indonesia or uses Indonesian language → use hybrid format (can use Indonesian company names, but keep sections in English for ATS)
   - If job is international → use international format
   - ALWAYS use English for section headings and skills

2. **Experience Generation Strategy:**
   - If user has experience field that matches job desc → CREATE 2-3 relevant work experiences with that field, make it highly detailed and aligned
   - If user is fresh graduate or experience doesn't match → CREATE 1-2 internship/entry experiences BUT add WARNING section about skill gaps
   - Use REAL-sounding company names (can be fictional but believable)
   - Include specific metrics and achievements with numbers
   - Use action verbs: "Increased", "Managed", "Developed", "Implemented"

3. **Keywords & ATS Optimization:**
   - Extract ALL technical keywords from job description
   - Match 80%+ of required skills in the CV
   - Use both full term AND abbreviation: "Search Engine Optimization (SEO)"
   - Natural integration, NO keyword stuffing

4. **Skills Section:**
   - Categorize: Technical Skills, Soft Skills, Tools/Software
   - Prioritize skills from job description
   - List missing critical skills separately for warnings

5. **Format Rules (ATS-Friendly):**
   - Use standard section headings: PROFESSIONAL SUMMARY, WORK EXPERIENCE, EDUCATION, SKILLS
   - Bullet points, not paragraphs
   - Reverse chronological order
   - Clean, simple format
   - Include quantifiable achievements

6. **Warnings & Recommendations:**
   - If user lacks critical skills → list them with learning recommendations
   - If experience level doesn't match job requirements → provide honest feedback
   - Suggest courses, certifications, or preparation needed

**OUTPUT FORMAT (JSON):**
\`\`\`json
{
  "format": "indonesia" | "international",
  "summary": "2-3 sentences professional summary highly tailored to job desc",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "period": "Month Year - Month Year",
      "achievements": [
        "Achievement 1 with metrics",
        "Achievement 2 with impact",
        "Achievement 3 with results"
      ]
    }
  ],
  "skills": [
    {
      "category": "Technical Skills",
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    },
    {
      "category": "Soft Skills", 
      "skills": ["Skill 1", "Skill 2"]
    },
    {
      "category": "Tools & Software",
      "skills": ["Tool 1", "Tool 2"]
    }
  ],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "atsScore": 85,
  "warnings": [
    {
      "type": "skill-gap",
      "message": "You lack experience in X skill required for this position",
      "recommendations": ["Take course A", "Practice with B", "Get certification C"]
    }
  ]
}
\`\`\`

Generate the complete CV now. Be specific, realistic, and ATS-optimized. Return ONLY valid JSON, no markdown formatting.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown if present
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const generatedData = JSON.parse(jsonText);
    return generatedData;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to generate CV: ${error.message}`);
  }
}