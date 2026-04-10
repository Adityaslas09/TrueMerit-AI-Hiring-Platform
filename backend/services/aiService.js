const { GoogleGenAI } = require('@google/genai');

const evaluateProject = async (description, techStack) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Falling back to mock evaluation.");
      return {
        aiComplexityScore: Math.floor(Math.random() * 5) + 5,
        aiFeedback: "Mock Feedback: Please set GEMINI_API_KEY to enable AI evaluation."
      };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = 'gemini-2.5-flash';

    const systemInstruction = `You are a Senior Technical Recruiter and Staff Software Engineer. Evaluate the following project based on its description and tech stack.
Provide a score between 1 and 10 for 'complexity' (how complex and impactful the project is) and actionable feedback (1-2 sentences).
Look for realistic usage vs resume padding.
Return EXACTLY a JSON format:
{
  "aiComplexityScore": <number 1-10>,
  "aiFeedback": "<string>"
}
Do not return any markdown formatting like \`\`\`json. Return pure JSON.`;

    const promptText = `Project Description: ${description}\nTech Stack: ${techStack.join(', ')}`;

    const response = await ai.models.generateContent({
        model: model,
        contents: promptText,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.3,
        }
    });

    try {
        // Strip markdown if AI still outputs it
        const cleanedResponse = response.text().replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsed = JSON.parse(cleanedResponse);
        return {
            aiComplexityScore: parsed.aiComplexityScore || Math.floor(Math.random() * 5) + 5,
            aiFeedback: parsed.aiFeedback || "Could not parse specific feedback."
        };
    } catch (e) {
        console.error("Failed to parse Gemini JSON output:", e, response.text());
        return {
            aiComplexityScore: 6,
            aiFeedback: "AI evaluated but response format was invalid."
        };
    }

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return {
      aiComplexityScore: 5,
      aiFeedback: "AI evaluation failed due to server error."
    };
  }
};

module.exports = { evaluateProject };
