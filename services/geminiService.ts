import { GoogleGenAI, Chat, GenerateContentResponse, Modality } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// --- Chat Troubleshooting ---
let chatSession: Chat | null = null;

export const initializeChat = () => {
  const ai = getAiClient();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are an expert PC Hardware Technician named 'FixMyRig Bot'.
      Your goal is to help users diagnose and fix PC hardware issues.
      Follow these rules:
      1. Safety First: Always warn users about static electricity (ESD) and unplugging power before touching components.
      2. Step-by-Step: Do not dump a wall of text. Ask clarifying questions to narrow down the problem (e.g., 'Does the fan spin?', 'Are there any beep codes?').
      3. Be clear and concise. Use bullet points for instructions.
      4. If the user mentions a specific part, explain what it does briefly if relevant to the fix.
      5. Tone: Professional, encouraging, and tech-savvy.`,
    },
  });
  return chatSession;
};

export const sendMessageStream = async function* (message: string) {
  if (!chatSession) {
    initializeChat();
  }
  if (!chatSession) throw new Error("Failed to initialize chat session");

  const result = await chatSession.sendMessageStream({ message });
  
  for await (const chunk of result) {
     yield chunk.text;
  }
};

// --- Visual Component Inspection ---
export const analyzeComponentImage = async (base64Image: string, mimeType: string = 'image/jpeg') => {
  const ai = getAiClient();
  
  const prompt = `Analyze this image of a PC component. 
  1. Identify the component (e.g., GPU, Motherboard, RAM, PSU).
  2. Inspect for any visible physical signs of damage such as:
     - Burnt capacitors or resistors (black marks).
     - Bent pins (especially on CPU sockets).
     - Dust buildup clogging fans/heatsinks.
     - Loose cables or improper seating.
  3. If no damage is visible, describe the component and list its common failure symptoms.
  4. Provide a maintenance tip for this specific component.
  
  Format the response with clear headings.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash', // Flash is great for vision
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  return response.text;
};

// --- Resource Finder (Search Grounding) ---
export const findResources = async (query: string) => {
  const ai = getAiClient();
  
  // Using 2.5-flash with search tool
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Find official drivers, manuals, or recent forum solutions for: ${query}. 
    If it's a specific part, look for the manufacturer's support page.
    Summarize the findings and explain why these links are relevant.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text,
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
