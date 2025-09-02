import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "demo-api-key");

export class KumbhBot {
  private model;
  private chatSession: any;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.initializeChat();
  }

  private initializeChat() {
    const chatHistory = [
      {
        role: "user",
        parts: [{ text: "You are KumbhBot, an AI assistant for SmartKumbh - a digital platform for Kumbh Mela pilgrims. You help with navigation, safety information, spiritual event timings, lost & found queries, and general assistance. Always be helpful, respectful, and culturally sensitive. Provide accurate information about Kumbh Mela traditions, safety protocols, and available services." }],
      },
      {
        role: "model",
        parts: [{ text: "Namaste! I'm KumbhBot, your AI companion for the SmartKumbh platform. I'm here to help you with navigation, safety information, spiritual event timings, and any questions about your pilgrimage. How may I assist you today?" }],
      },
    ];

    this.chatSession = this.model.startChat({
      history: chatHistory,
    });
  }

  async sendMessage(message: string, language: string = "en"): Promise<string> {
    try {
      let prompt = message;
      
      // Add language context if not English
      if (language !== "en") {
        const languageMap: { [key: string]: string } = {
          "hi": "Hindi",
          "bn": "Bengali",
          "ta": "Tamil",
          "te": "Telugu",
          "ml": "Malayalam",
          "kn": "Kannada",
          "gu": "Gujarati",
          "mr": "Marathi",
          "or": "Odia",
          "pa": "Punjabi",
          "ur": "Urdu"
        };
        
        const languageName = languageMap[language] || "English";
        prompt = `Please respond in ${languageName}. User message: ${message}`;
      }

      const result = await this.chatSession.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      return "I apologize, but I'm having trouble responding right now. Please try again or contact our support team.";
    }
  }

  async translateMessage(message: string, targetLanguage: string): Promise<string> {
    try {
      const prompt = `Translate the following message to ${targetLanguage}: ${message}`;
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error translating message:", error);
      return message; // Return original message if translation fails
    }
  }

  async analyzeLocation(locationQuery: string): Promise<string> {
    try {
      const prompt = `The user is asking about this location in Kumbh Mela context: "${locationQuery}". Provide helpful information about crowd levels, nearby facilities, spiritual significance, and navigation tips. Keep it concise and practical.`;
      
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error analyzing location:", error);
      return "I couldn't analyze that location right now. Please try again or check the map for current information.";
    }
  }
}

export const kumbhBot = new KumbhBot();
