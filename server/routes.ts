import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import emailjs from '@emailjs/nodejs';

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
});

const createAlertSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  alertType: z.enum(["crowd", "weather", "emergency", "route"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  location: z.string().optional(),
});

const createEventSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  location: z.string().min(1),
  dateTime: z.string(),
  duration: z.number().optional(),
  liveStreamUrl: z.string().optional(),
});

const createLostFoundSchema = z.object({
  type: z.enum(["missing_person", "missing_item", "found_person", "found_item"]),
  reportedBy: z.string().min(1),
  contactPhone: z.string().min(1),
  description: z.string().min(1),
  lastSeenLocation: z.string().optional(),
});

const createCleanlinessReportSchema = z.object({
  location: z.string().min(1),
  facilityType: z.enum(["toilet", "ghat", "general"]),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
  reportedBy: z.string().min(1),
});

const createCrowdDataSchema = z.object({
  location: z.string().min(1),
  latitude: z.string(),
  longitude: z.string(),
  crowdCount: z.number().min(0),
  densityLevel: z.enum(["low", "medium", "high", "critical"]),
});

// Declare global type for contact submissions
declare global {
  var contactSubmissions: any[];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Config endpoint for frontend
  app.get("/api/config", async (req, res) => {
    try {
      const emailjsConfig = {
        serviceId: process.env.EMAILJS_SERVICE_ID,
        templateId: process.env.EMAILJS_TEMPLATE_ID,
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
      };
      
      console.log('EmailJS Config:', {
        serviceId: emailjsConfig.serviceId ? 'SET' : 'MISSING',
        templateId: emailjsConfig.templateId ? 'SET' : 'MISSING', 
        publicKey: emailjsConfig.publicKey ? 'SET' : 'MISSING'
      });
      
      res.json({
        emailjs: emailjsConfig
      });
    } catch (error) {
      console.error('Config endpoint error:', error);
      res.status(500).json({ message: "Failed to fetch config" });
    }
  });

  // Contact form storage endpoint
  app.post("/api/contact/store", async (req, res) => {
    console.log('📧 Contact form submission received for storage:', req.body);
    
    try {
      const contactData = req.body;
      
      // Store in memory for now (in production this would go to database)
      if (!global.contactSubmissions) {
        global.contactSubmissions = [];
      }
      
      global.contactSubmissions.push({
        ...contactData,
        serverTimestamp: new Date().toISOString()
      });
      
      console.log('✅ Contact data stored successfully. Total submissions:', global.contactSubmissions.length);
      
      res.json({ 
        success: true, 
        message: 'Contact data stored successfully',
        id: contactData.id
      });
    } catch (error: any) {
      console.error('❌ Contact storage failed:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to store contact data',
        error: error.message 
      });
    }
  });

  // Get all contact submissions endpoint (for admin)
  app.get("/api/contact/submissions", (req, res) => {
    const submissions = global.contactSubmissions || [];
    console.log('📋 Retrieved contact submissions:', submissions.length);
    res.json({ submissions });
  });

  // Users endpoints
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = createUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Safety Alerts endpoints
  app.get("/api/safety-alerts", async (req, res) => {
    try {
      const alerts = await storage.getAllSafetyAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch safety alerts" });
    }
  });

  app.post("/api/safety-alerts", async (req, res) => {
    try {
      const alertData = createAlertSchema.parse(req.body);
      const alert = await storage.createSafetyAlert({
        ...alertData,
        isActive: true,
        createdBy: req.body.createdBy || "system",
      });
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create safety alert" });
      }
    }
  });

  app.patch("/api/safety-alerts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const alert = await storage.updateSafetyAlert(id, updates);
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to update safety alert" });
    }
  });

  // Spiritual Events endpoints
  app.get("/api/spiritual-events", async (req, res) => {
    try {
      const events = await storage.getAllSpiritualEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch spiritual events" });
    }
  });

  app.post("/api/spiritual-events", async (req, res) => {
    try {
      const eventData = createEventSchema.parse(req.body);
      const event = await storage.createSpiritualEvent({
        ...eventData,
        dateTime: new Date(eventData.dateTime),
        isLive: false,
        reminderUserIds: [],
      });
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid event data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create spiritual event" });
      }
    }
  });

  // Lost & Found endpoints
  app.get("/api/lost-found", async (req, res) => {
    try {
      const cases = await storage.getAllLostFoundCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lost & found cases" });
    }
  });

  app.post("/api/lost-found", async (req, res) => {
    try {
      const caseData = createLostFoundSchema.parse(req.body);
      const case_ = await storage.createLostFoundCase({
        ...caseData,
        status: "active",
        isApproved: false,
      });
      res.status(201).json(case_);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid case data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create lost & found case" });
      }
    }
  });

  app.patch("/api/lost-found/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const case_ = await storage.updateLostFoundCase(id, updates);
      res.json(case_);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lost & found case" });
    }
  });

  // Cleanliness Reports endpoints
  app.get("/api/cleanliness-reports", async (req, res) => {
    try {
      const reports = await storage.getAllCleanlinessReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cleanliness reports" });
    }
  });

  app.post("/api/cleanliness-reports", async (req, res) => {
    try {
      const reportData = createCleanlinessReportSchema.parse(req.body);
      const report = await storage.createCleanlinessReport({
        ...reportData,
        isResolved: false,
      });
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid report data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create cleanliness report" });
      }
    }
  });

  app.patch("/api/cleanliness-reports/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (updates.isResolved) {
        updates.resolvedAt = new Date();
      }
      const report = await storage.updateCleanlinessReport(id, updates);
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cleanliness report" });
    }
  });

  // Crowd Data endpoints
  app.get("/api/crowd-data", async (req, res) => {
    try {
      const crowdData = await storage.getAllCrowdData();
      res.json(crowdData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crowd data" });
    }
  });

  app.post("/api/crowd-data", async (req, res) => {
    try {
      const crowdData = createCrowdDataSchema.parse(req.body);
      const data = await storage.createCrowdData(crowdData);
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid crowd data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create crowd data" });
      }
    }
  });

  // Help Booths endpoints
  app.get("/api/help-booths", async (req, res) => {
    try {
      const booths = await storage.getAllHelpBooths();
      res.json(booths);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch help booths" });
    }
  });

  app.post("/api/help-booths", async (req, res) => {
    try {
      const boothData = req.body;
      const booth = await storage.createHelpBooth({
        ...boothData,
        isActive: true,
        volunteers: boothData.volunteers || [],
        services: boothData.services || [],
      });
      res.status(201).json(booth);
    } catch (error) {
      res.status(500).json({ message: "Failed to create help booth" });
    }
  });

  // Chat Messages endpoints
  app.get("/api/chat-messages", async (req, res) => {
    try {
      const { userId } = req.query;
      const messages = await storage.getChatMessages(userId as string);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat-messages", async (req, res) => {
    try {
      const messageData = req.body;
      const message = await storage.createChatMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to create chat message" });
    }
  });

  // Dashboard stats endpoint
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Emergency broadcast endpoints
  app.post("/api/emergency/broadcast-sms", async (req, res) => {
    try {
      const { message } = req.body;
      // In a real implementation, this would integrate with SMS gateway
      // For now, we'll just log the action
      console.log(`Emergency SMS broadcast: ${message}`);
      res.json({ success: true, message: "SMS broadcast initiated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to broadcast SMS" });
    }
  });

  app.post("/api/emergency/activate-evacuation", async (req, res) => {
    try {
      // Create emergency alert for evacuation
      const alert = await storage.createSafetyAlert({
        title: "EVACUATION ALERT",
        message: "Emergency evacuation routes have been activated. Please follow designated paths to nearest exits.",
        alertType: "emergency",
        priority: "critical",
        location: "All Areas",
        isActive: true,
        createdBy: "Emergency System",
      });
      res.json({ success: true, alert });
    } catch (error) {
      res.status(500).json({ message: "Failed to activate evacuation routes" });
    }
  });

  // Gemini AI Chatbot endpoint
  app.post("/api/chat/ask", async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Use Gemini API key from environment
      const apiKey = process.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback to smart responses if no API key
        const smartResponses = {
          "temple": "🕉️ Mahakaleshwar Temple is open 24/7. Bhasma Aarti happens at 4 AM daily. Current wait time is approximately 25-30 minutes.",
          "crowd": "📊 Current crowd levels: Mahakaleshwar Temple (High), Kal Bhairav (Medium), Harsiddhi (Low). Best time to visit is early morning or late evening.",
          "weather": "🌤️ Today's weather: Partly cloudy, 28°C. Light rain expected after 6 PM. Please carry umbrellas.",
          "route": "🗺️ Best route to Mahakaleshwar: Take the Senior Citizen path for faster access. Avoid Main Gate between 10 AM - 4 PM due to high crowds.",
          "emergency": "🚨 For emergencies, call 108 or visit nearest medical station. Emergency contacts: Police: 100, Medical: 108, Fire: 101",
          "food": "🍽️ Prasad available at temple counter. Food courts located near Main Gate and Parking Area 1. All food is vegetarian and hygienic.",
          "lost": "📢 For lost items or people, immediately contact Lost & Found booth near Information Center or call +91-1234567890",
          "parking": "🚗 Parking areas: Area 1 (70% full), Area 2 (45% full), Area 3 (30% full). Area 3 recommended for quick exit.",
        };

        let response = "🙏 Welcome to SmartKumbh AI Assistant! I can help you with temple information, crowd updates, routes, weather, emergencies, and more. What would you like to know?";
        
        const lowerMessage = message.toLowerCase();
        for (const [keyword, answer] of Object.entries(smartResponses)) {
          if (lowerMessage.includes(keyword)) {
            response = answer;
            break;
          }
        }

        return res.json({ 
          response,
          timestamp: new Date().toISOString(),
          type: "ai_assistant"
        });
      }

      // If Gemini API key is available, use Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      
      const systemPrompt = `You are SmartKumbh AI Assistant, helping pilgrims at Ujjain Maha Kumbh. Provide helpful, accurate information about:
- Temple timings, rituals, and spiritual events
- Crowd levels and best visiting times  
- Weather updates and safety alerts
- Navigation and route guidance
- Emergency services and help booths
- Food, parking, and facilities
- Lost & found assistance

Keep responses concise, helpful, and respectful. Use appropriate emojis. Always prioritize pilgrim safety and spiritual experience.

Context: Current location is Ujjain Maha Kumbh. Major temples include Mahakaleshwar, Kal Bhairav, Harsiddhi. Peak hours are 6-10 AM and 5-9 PM.`;

      const requestBody = {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser Question: ${message}`
          }]
        }]
      };

      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!geminiResponse.ok) {
        throw new Error(`Gemini API error: ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();
      const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request. Please try again.";

      // Store the conversation
      await storage.createChatMessage({
        userId: userId || 'anonymous',
        message: message,
        response: aiResponse
      });

      res.json({ 
        response: aiResponse,
        timestamp: new Date().toISOString(),
        type: "ai_assistant"
      });

    } catch (error) {
      console.error('Chatbot error:', error);
      res.status(500).json({ 
        error: "Sorry, I'm having trouble right now. Please try again or contact help desk.",
        fallback: true
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
