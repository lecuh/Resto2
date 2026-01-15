
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAIFoodSuggestions = async (preferences: string, menuItems: any[]) => {
  if (!API_KEY) return "AI features require an API Key.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on these user preferences: "${preferences}", suggest 3 items from our menu: ${JSON.stringify(menuItems.map(i => ({name: i.name, desc: i.description, price: i.price})))}. Explain why for each.`,
    config: {
      temperature: 0.7,
      systemInstruction: "You are a helpful and charismatic restaurant waiter AI. Recommend dishes that match the customer's mood and preferences."
    }
  });

  return response.text;
};

export const getAIReservationGuide = async (query: string) => {
  if (!API_KEY) return "AI features require an API Key.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      systemInstruction: "You are the digital concierge for Gourmet Kitchen. Help users with booking questions. Be polite and concise."
    }
  });

  return response.text;
};
