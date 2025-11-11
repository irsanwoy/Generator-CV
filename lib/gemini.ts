import Groq from 'groq-sdk';

interface CVData {
  name: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  experienceLevel: string;
  experienceField?: string;
  jobDescription: string;
}

interface GeneratedCV {
  format: 'indonesia' | 'international';
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    period: string;
    achievements: string[];
  }>;
  skills: Array<{
    category: string;
    skills: string[];
  }>;
  keywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  atsScore: number;
  warnings?: Array<{
    type: string;
    message: string;
    recommendations?: string[];
  }>;
}

export async function generateCVContent(
  cvData: CVData, 
  apiKey: string
): Promise<GeneratedCV> {
  const groq = new Groq({ 
    apiKey: apiKey,
    dangerouslyAllowBrowser: true 
  });

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

1. **Detect Language & Format:**
   - If job description is in Indonesian → Generate CV content in INDONESIAN (Bahasa Indonesia)
   - If job description is in English → Generate CV content in ENGLISH
   - Section headings can stay in English for ATS compatibility, but ALL content (summary, achievements, skills) must match the job description language
   - If Indonesian job: use "Fresh graduate" → "Lulusan baru", "Developed" → "Mengembangkan", etc.

2. **Experience Generation Strategy:**
   - If user has experience field that matches job desc → CREATE 2-3 relevant work experiences with that field, make it highly detailed and aligned
   - If user is fresh graduate or experience doesn't match → CREATE 1-2 internship/entry experiences BUT add WARNING section about skill gaps
   - Use REAL-sounding Indonesian company names if job is Indonesian (e.g., "PT Teknologi Solusi", "CV Digital Kreatif")
   - Use international company names if job is in English
   - Include specific metrics and achievements with numbers
   - Use action verbs in the SAME LANGUAGE as job description:
     * Indonesian: "Mengembangkan", "Mengelola", "Meningkatkan", "Mengimplementasikan"
     * English: "Developed", "Managed", "Increased", "Implemented"

3. **Keywords & ATS Optimization:**
   - Extract ALL technical keywords from job description
   - Match 80%+ of required skills in the CV
   - Use both full term AND abbreviation: "Search Engine Optimization (SEO)"
   - Natural integration, NO keyword stuffing

4. **Skills Section:**
   - Write skills in the SAME LANGUAGE as job description
   - Categorize: Technical Skills/Keahlian Teknis, Soft Skills/Keahlian Interpersonal, Tools & Software/Tools & Software
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
Return ONLY valid JSON in this exact format, no markdown formatting:
{
  "format": "indonesia",
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

Generate the complete CV now. Be specific, realistic, and ATS-optimized.
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert CV writer. Always respond with valid JSON only, no markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content || '';
    
    // Clean up markdown if present
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const generatedData = JSON.parse(jsonText) as GeneratedCV;
    return generatedData;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error(`Failed to generate CV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}