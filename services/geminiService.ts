
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ListingData } from '../types';

// Freshly instantiate to ensure the most recent API key from window.aistudio is used
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeDesignAndGenerateListing = async (base64Image: string, userDescription: string): Promise<ListingData> => {
  const ai = getAI();
  const imagePart = {
    inlineData: {
      data: base64Image.split(',')[1],
      mimeType: 'image/png',
    },
  };
  const textPart = {
    text: `Identify the niche, aesthetic, and specific keywords for this design. User context: "${userDescription}". 
    Generate a high-converting Etsy listing in JSON format with:
    'title' (max 140 chars), 
    'description' (SEO-friendly markdown), 
    'tags' (exactly 13 optimized keywords).`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "description", "tags"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateMockupFromDesign = async (base64Design: string, promptContext: string): Promise<string | undefined> => {
  const ai = getAI();
  // We use gemini-3-pro-image-preview for professional quality mockups.
  // This requires a paid project API key via window.aistudio.openSelectKey()
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Design.split(',')[1],
            mimeType: 'image/png'
          }
        },
        { text: `A professional high-resolution lifestyle mockup of a high-end product (like a t-shirt or art print) featuring this design. Setting: ${promptContext}. Realistic textures, cinematic studio lighting, premium aesthetic.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};

/**
 * Fix: Added generateMockup to provide high-quality standalone image generation
 * Uses gemini-3-pro-image-preview for high-resolution 1K/2K/4K results.
 */
export const generateMockup = async (prompt: string, aspectRatio: string = "1:1", size: string = "1K"): Promise<string | undefined> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: size as any
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};

/**
 * Fix: Added editMockup to allow AI-powered image editing/inpainting
 * Uses gemini-2.5-flash-image which is the default for editing tasks.
 */
export const editMockup = async (base64Image: string, prompt: string): Promise<string | undefined> => {
  const ai = getAI();
  const imagePart = {
    inlineData: {
      data: base64Image.split(',')[1],
      mimeType: 'image/png',
    },
  };
  const textPart = { text: prompt };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [imagePart, textPart] },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};

export const getTrends = async (): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: "Current top 3 rising niche trends for Etsy Print-on-Demand in 2024. Use search data.",
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return response.text || "Trends unavailable.";
};

export const chatWithAssistant = async (message: string): Promise<string> => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are an Etsy expert advisor."
    }
  });
  const response = await chat.sendMessage({ message });
  return response.text || "Assistant unavailable.";
};
