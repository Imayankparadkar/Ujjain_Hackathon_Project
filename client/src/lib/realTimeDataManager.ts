import { addDocument, updateDocument, getDocuments } from './firebase';

class RealTimeDataManager {
  private intervals: NodeJS.Timeout[] = [];
  
  constructor() {
    this.startDataGeneration();
  }

  private startDataGeneration() {
    // Update crowd data every 30 seconds
    const crowdInterval = setInterval(() => {
      this.updateCrowdData();
    }, 30000);

    // Generate new alerts every 5 minutes
    const alertInterval = setInterval(() => {
      this.generateNewAlert();
    }, 300000);

    // Update event attendance every 2 minutes
    const eventInterval = setInterval(() => {
      this.updateEventAttendance();
    }, 120000);

    // Simulate lost & found updates every 10 minutes
    const lostFoundInterval = setInterval(() => {
      this.updateLostAndFound();
    }, 600000);

    this.intervals.push(crowdInterval, alertInterval, eventInterval, lostFoundInterval);
  }

  private async updateCrowdData() {
    try {
      const locations = [
        { name: "Mahakaleshwar Temple Main Gate", baseCount: 8500 },
        { name: "Male Devotee Route", baseCount: 6000 },
        { name: "Female Devotee Route", baseCount: 4500 },
        { name: "Senior Citizens Priority Path", baseCount: 1200 },
        { name: "VIP Darshan Entry", baseCount: 350 },
        { name: "Temple Inner Sanctum", baseCount: 85 },
        { name: "Prasad Counter Area", baseCount: 1100 },
        { name: "Parking Area 1", baseCount: 2200 },
        { name: "Information Center", baseCount: 650 },
        { name: "Medical Station", baseCount: 120 },
      ];

      const existingData = await getDocuments("crowdData");
      
      for (const location of locations) {
        // Simulate realistic crowd fluctuations
        const timeOfDay = new Date().getHours();
        let multiplier = 1.0;
        
        // Peak hours: 6-9 AM and 5-8 PM
        if ((timeOfDay >= 6 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 20)) {
          multiplier = 1.3 + Math.random() * 0.3;
        } else if (timeOfDay >= 22 || timeOfDay <= 5) {
          multiplier = 0.3 + Math.random() * 0.2;
        } else {
          multiplier = 0.7 + Math.random() * 0.4;
        }

        const newCount = Math.floor(location.baseCount * multiplier);
        const capacity = Math.floor(location.baseCount * 1.2);
        const occupancyRate = Math.round((newCount / capacity) * 100);
        
        let densityLevel = "low";
        let waitTime = "No wait";
        let status = "normal";
        
        if (occupancyRate > 90) {
          densityLevel = "critical";
          waitTime = "45-60 min";
          status = "overcrowded";
        } else if (occupancyRate > 75) {
          densityLevel = "high";
          waitTime = "25-35 min";
          status = "busy";
        } else if (occupancyRate > 50) {
          densityLevel = "medium";
          waitTime = "10-20 min";
          status = "moderate";
        }

        const existingLocation = existingData.find((item: any) => item.location === location.name);
        
        if (existingLocation) {
          await updateDocument("crowdData", existingLocation.id, {
            crowdCount: newCount,
            occupancyRate,
            densityLevel,
            waitTime,
            status,
            lastUpdated: new Date(),
            timestamp: new Date(),
          });
        }
      }
      
      console.log("🔄 Real-time crowd data updated");
    } catch (error) {
      console.error("Error updating crowd data:", error);
    }
  }

  private async generateNewAlert() {
    try {
      const alertTypes = [
        {
          title: "🌧️ Weather Update",
          message: "Light drizzle expected in next 2 hours. Covered walkways are available at all major routes.",
          alertType: "weather",
          priority: "medium",
          location: "All Areas",
        },
        {
          title: "🚧 Temporary Route Change",
          message: "North Gate temporarily congested. Redirecting traffic to East and West gates for faster entry.",
          alertType: "infrastructure",
          priority: "high",
          location: "North Gate",
        },
        {
          title: "📱 Free WiFi Available",
          message: "High-speed WiFi hotspots activated at all information centers. Network: SmartKumbh-Free",
          alertType: "network",
          priority: "low",
          location: "Information Centers",
        },
        {
          title: "🏥 Medical Support Enhanced",
          message: "Additional ambulances and medical staff deployed due to increased pilgrim count.",
          alertType: "medical",
          priority: "medium",
          location: "All Medical Stations",
        },
        {
          title: "🔊 Special Announcement",
          message: "Lost child found safe at Information Center. All missing person cases being actively monitored.",
          alertType: "announcement",
          priority: "low",
          location: "Information Centers",
        }
      ];

      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      
      await addDocument("safetyAlerts", {
        ...randomAlert,
        isActive: true,
        createdBy: "AI Monitoring System",
        createdAt: new Date(),
        estimatedDuration: `${Math.floor(Math.random() * 4) + 1} hours`,
        affectedAreas: [randomAlert.location],
      });

      console.log("🚨 New safety alert generated:", randomAlert.title);
    } catch (error) {
      console.error("Error generating alert:", error);
    }
  }

  private async updateEventAttendance() {
    try {
      const events = await getDocuments("spiritualEvents");
      
      for (const event of events) {
        if (event.currentAttendees && event.capacity) {
          // Simulate realistic attendance changes
          const timeUntilEvent = new Date(event.dateTime.seconds * 1000).getTime() - Date.now();
          const hoursUntilEvent = timeUntilEvent / (1000 * 60 * 60);
          
          let attendanceChange = 0;
          if (hoursUntilEvent > 0 && hoursUntilEvent < 2) {
            // Increase attendance as event approaches
            attendanceChange = Math.floor(Math.random() * 20) + 5;
          } else if (hoursUntilEvent < 0 && hoursUntilEvent > -1) {
            // Event in progress, slight fluctuations
            attendanceChange = Math.floor(Math.random() * 10) - 5;
          }

          const newAttendance = Math.min(
            event.capacity,
            Math.max(0, event.currentAttendees + attendanceChange)
          );

          if (newAttendance !== event.currentAttendees) {
            await updateDocument("spiritualEvents", event.id, {
              currentAttendees: newAttendance,
              lastUpdated: new Date(),
            });
          }
        }
      }
      
      console.log("📅 Event attendance updated");
    } catch (error) {
      console.error("Error updating events:", error);
    }
  }

  private async updateLostAndFound() {
    try {
      const cases = await getDocuments("lostAndFound");
      const activeCases = cases.filter((case_: any) => case_.status === "active");
      
      if (activeCases.length > 0) {
        // Randomly resolve some cases
        const caseToResolve = activeCases[Math.floor(Math.random() * activeCases.length)];
        
        if (Math.random() < 0.3) { // 30% chance to resolve a case
          await updateDocument("lostAndFound", caseToResolve.id, {
            status: caseToResolve.type.includes("person") ? "reunited" : "claimed",
            resolvedAt: new Date(),
            resolvedBy: "Station Officer",
          });
          
          console.log("✅ Lost & Found case resolved:", caseToResolve.name);
        }
      }

      // Occasionally add new found items
      if (Math.random() < 0.2) { // 20% chance to add new found item
        const foundItems = [
          "Mobile Phone", "Wallet", "Water Bottle", "Reading Glasses", 
          "Key Ring", "Umbrella", "Scarf", "Prayer Beads", "Small Bag"
        ];
        
        const randomItem = foundItems[Math.floor(Math.random() * foundItems.length)];
        
        await addDocument("lostAndFound", {
          type: "found_item",
          name: randomItem,
          description: `${randomItem} found at temple premises`,
          foundLocation: "Information Center",
          foundTime: new Date(),
          foundBy: "Volunteer Team",
          status: "found",
          storageLocation: "Lost Property Office",
          caseNumber: `LF-2024-${Date.now().toString().slice(-3)}`,
          condition: "Good",
        });
      }
    } catch (error) {
      console.error("Error updating lost & found:", error);
    }
  }

  public stopDataGeneration() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }
}

// Create singleton instance
export const realTimeDataManager = new RealTimeDataManager();

// Auto-start data generation when imported
export const startRealTimeUpdates = () => {
  console.log("🚀 Real-time data generation started for hackathon demo!");
  return realTimeDataManager;
};

export default realTimeDataManager;