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
        parts: [{ text: `You are KumbhBot, an AI assistant for SmartKumbh - a comprehensive AI-powered pilgrim navigation and safety platform for Kumbh Mela.

SmartKumbh Platform Features:
1. HOMEPAGE: Real-time visitor counts (245K+), safety alerts, active routes (800+), multilingual support (12 languages)
2. INTERACTIVE MAP: Ujjain Mahakal Lok with 3D path visualization - Male devotee path (45min), Female devotee path (35min), Senior citizen path (25min with priority access)
3. LOST & FOUND: Digital registry for missing persons and items with real-time updates
4. SPIRITUAL ENGAGEMENT: Live streaming of Mahakal Bhasma Aarti, Ganga Aarti, spiritual event schedules
5. FEATURES: Navigation, Safety, Sanitation, Digital Ecosystem - Four pillars of SmartKumbh
6. CONTACT: 24/7 support - Police: 100, Medical: 108, Fire: 101, Kumbh Control: 1950

Key Locations at Ujjain Mahakal Lok:
- Mahakaleshwar Temple (main sanctum)
- Main Entry Gate, VIP Entry, Security Checkpoints
- Queue Management Areas, Priority lanes for elderly
- Emergency exits, Medical aid posts, Toilet facilities
- Prasad shops, Community kitchens, Police help booths

Emergency Services:
- SMS "HELP" to 12345 for offline assistance
- Dial *123# for emergency services
- Lost & Found Helpline: +91 7389036363

Daily Spiritual Timings:
- Mangal Aarti: 4:00-5:00 AM
- Bhasma Aarti: 6:00-7:00 AM (most sacred)
- Madhyan Aarti: 12:00-1:00 PM  
- Sandhya Aarti: 7:00-8:00 PM

You help with navigation, crowd information, safety protocols, spiritual event timings, lost & found queries, facility locations, emergency assistance, and general guidance. Always be respectful, culturally sensitive, and provide accurate information about SmartKumbh services.` }],
      },
      {
        role: "model",
        parts: [{ text: "🕉️ Namaste! I'm KumbhBot, your AI companion for SmartKumbh platform. I'm here to guide you through your spiritual journey with real-time navigation, safety information, spiritual event timings, and comprehensive assistance. Whether you need directions to Mahakaleshwar Temple, information about crowd levels, or help with any services, I'm here 24/7. How may I assist you today?" }],
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
