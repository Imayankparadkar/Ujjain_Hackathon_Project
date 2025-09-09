import { apiRequest, queryClient } from "./queryClient";

// API utility functions for Express backend integration
export const api = {
  // Users
  async getUsers() {
    const response = await fetch("/api/users");
    return response.json();
  },

  async createUser(userData: any) {
    const response = await apiRequest("POST", "/api/users", userData);
    return response.json();
  },

  async updateUser(id: string, updates: any) {
    const response = await apiRequest("PATCH", `/api/users/${id}`, updates);
    return response.json();
  },

  // Safety Alerts
  async getSafetyAlerts() {
    const response = await fetch("/api/safety-alerts");
    return response.json();
  },

  async createSafetyAlert(alertData: any) {
    const response = await apiRequest("POST", "/api/safety-alerts", alertData);
    queryClient.invalidateQueries({ queryKey: ["/api/safety-alerts"] });
    return response.json();
  },

  async updateSafetyAlert(id: string, updates: any) {
    const response = await apiRequest("PATCH", `/api/safety-alerts/${id}`, updates);
    queryClient.invalidateQueries({ queryKey: ["/api/safety-alerts"] });
    return response.json();
  },

  // Spiritual Events
  async getSpiritualEvents() {
    const response = await fetch("/api/spiritual-events");
    return response.json();
  },

  async createSpiritualEvent(eventData: any) {
    const response = await apiRequest("POST", "/api/spiritual-events", eventData);
    queryClient.invalidateQueries({ queryKey: ["/api/spiritual-events"] });
    return response.json();
  },

  async updateSpiritualEvent(id: string, updates: any) {
    const response = await apiRequest("PATCH", `/api/spiritual-events/${id}`, updates);
    queryClient.invalidateQueries({ queryKey: ["/api/spiritual-events"] });
    return response.json();
  },

  // Lost & Found
  async getLostFoundCases() {
    const response = await fetch("/api/lost-found");
    return response.json();
  },

  async createLostFoundCase(caseData: any) {
    const response = await apiRequest("POST", "/api/lost-found", caseData);
    queryClient.invalidateQueries({ queryKey: ["/api/lost-found"] });
    return response.json();
  },

  async updateLostFoundCase(id: string, updates: any) {
    const response = await apiRequest("PATCH", `/api/lost-found/${id}`, updates);
    queryClient.invalidateQueries({ queryKey: ["/api/lost-found"] });
    return response.json();
  },

  // Cleanliness Reports
  async getCleanlinessReports() {
    const response = await fetch("/api/cleanliness-reports");
    return response.json();
  },

  async createCleanlinessReport(reportData: any) {
    const response = await apiRequest("POST", "/api/cleanliness-reports", reportData);
    queryClient.invalidateQueries({ queryKey: ["/api/cleanliness-reports"] });
    return response.json();
  },

  async updateCleanlinessReport(id: string, updates: any) {
    const response = await apiRequest("PATCH", `/api/cleanliness-reports/${id}`, updates);
    queryClient.invalidateQueries({ queryKey: ["/api/cleanliness-reports"] });
    return response.json();
  },

  // Crowd Data
  async getCrowdData() {
    const response = await fetch("/api/crowd-data");
    return response.json();
  },

  async createCrowdData(crowdData: any) {
    const response = await apiRequest("POST", "/api/crowd-data", crowdData);
    queryClient.invalidateQueries({ queryKey: ["/api/crowd-data"] });
    return response.json();
  },

  // Help Booths
  async getHelpBooths() {
    const response = await fetch("/api/help-booths");
    return response.json();
  },

  async createHelpBooth(boothData: any) {
    const response = await apiRequest("POST", "/api/help-booths", boothData);
    queryClient.invalidateQueries({ queryKey: ["/api/help-booths"] });
    return response.json();
  },

  async updateHelpBooth(id: string, updates: any) {
    const response = await apiRequest("PATCH", `/api/help-booths/${id}`, updates);
    queryClient.invalidateQueries({ queryKey: ["/api/help-booths"] });
    return response.json();
  },

  // Dashboard Stats
  async getDashboardStats() {
    const response = await fetch("/api/dashboard/stats");
    return response.json();
  },

  // Chat Messages
  async getChatMessages(userId?: string) {
    const url = userId ? `/api/chat-messages?userId=${userId}` : "/api/chat-messages";
    const response = await fetch(url);
    return response.json();
  },

  async createChatMessage(messageData: any) {
    const response = await apiRequest("POST", "/api/chat-messages", messageData);
    return response.json();
  },

  // Chat with AI
  async askChatbot(message: string, userId?: string) {
    const response = await apiRequest("POST", "/api/chat/ask", { message, userId });
    return response.json();
  },

  // Emergency Functions
  async broadcastEmergencySMS(message: string) {
    const response = await apiRequest("POST", "/api/emergency/broadcast-sms", { message });
    return response.json();
  },

  async activateEvacuationRoute() {
    const response = await apiRequest("POST", "/api/emergency/activate-evacuation", {});
    return response.json();
  }
};

// Real-time polling utility for live updates
export function createPollingSubscription(
  endpoint: string, 
  callback: (data: any) => void, 
  interval: number = 5000
) {
  const poll = async () => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      callback(data);
    } catch (error) {
      console.error(`Polling error for ${endpoint}:`, error);
    }
  };

  // Initial fetch
  poll();

  // Set up polling
  const intervalId = setInterval(poll, interval);

  // Return cleanup function
  return () => clearInterval(intervalId);
}