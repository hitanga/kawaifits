import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Error initializing Gemini API:", error);
}

export const getStylistAdvice = async (query: string): Promise<string> => {
  if (!ai) return "I'm sorry, I cannot connect to the fashion brain right now.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: `You are Kawai, a high-end fashion stylist for 'Kawai Fits'.
        Your tone is chic, encouraging, and helpful.
        Keep advice concise (under 50 words).
        You suggest outfits based on occasions, colors, and trends.
        If asked about products, assume we sell elegant dresses, tops, and accessories.`,
      }
    });
    return response.text || "I'm not sure, but pink always looks fabulous!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Let's try a different look. Can you ask again?";
  }
};
