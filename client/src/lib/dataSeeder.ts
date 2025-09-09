import { addDocument } from './firebase';

class DataSeeder {
  private isSeeded = false;

  async seedInitialData() {
    // Check if already seeded to avoid duplicates
    if (this.isSeeded || localStorage.getItem('smartkumbh_seeded')) {
      console.log('📊 Data already seeded, skipping...');
      return;
    }

    console.log('🌱 Seeding initial SmartKumbh data...');

    try {
      // Seed users
      await this.seedUsers();
      
      // Seed crowd data locations
      await this.seedCrowdData();
      
      // Seed spiritual events
      await this.seedSpiritualEvents();
      
      // Seed safety alerts
      await this.seedSafetyAlerts();
      
      // Seed lost & found cases
      await this.seedLostAndFound();
      
      // Seed cleanliness reports
      await this.seedCleanlinessReports();
      
      // Seed help booths
      await this.seedHelpBooths();

      // Mark as seeded
      localStorage.setItem('smartkumbh_seeded', 'true');
      this.isSeeded = true;
      
      console.log('✅ Comprehensive hackathon dummy data generated successfully!');
      console.log('📊 Generated: Safety Alerts, Events, Crowd Data, Lost & Found, Cleanliness Reports, Help Booths');
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  }

  private async seedUsers() {
    const users = [
      {
        name: "Raj Kumar Sharma",
        email: "raj.sharma@example.com",
        phone: "+91-9876543210",
        aadhaarNumber: "1234-5678-9012",
        emergencyContact: "+91-9876543211",
        age: 45,
        city: "Delhi",
        isVerified: true,
        isBlocked: false,
        role: "pilgrim",
        preferences: { language: "hindi", accessibility: false },
        pilgrimType: "devotee"
      },
      {
        name: "Priya Patel",
        email: "priya.patel@example.com",
        phone: "+91-9876543212",
        aadhaarNumber: "2345-6789-0123",
        emergencyContact: "+91-9876543213",
        age: 32,
        city: "Mumbai",
        isVerified: true,
        isBlocked: false,
        role: "pilgrim",
        preferences: { language: "gujarati", accessibility: false },
        pilgrimType: "family_group"
      },
      {
        name: "Dr. Arvind Singh",
        email: "arvind.singh@example.com",
        phone: "+91-9876543214",
        emergencyContact: "+91-9876543215",
        age: 58,
        city: "Indore",
        isVerified: true,
        isBlocked: false,
        role: "admin",
        department: "Medical",
        pilgrimType: "staff"
      },
      {
        name: "Sunita Devi",
        email: "sunita.devi@example.com",
        phone: "+91-9876543216",
        emergencyContact: "+91-9876543217",
        age: 67,
        city: "Ujjain",
        isVerified: true,
        isBlocked: false,
        role: "pilgrim",
        preferences: { language: "hindi", accessibility: true },
        pilgrimType: "senior_citizen"
      },
      {
        name: "Mohammed Khan",
        email: "mohammed.khan@example.com",
        phone: "+91-9876543218",
        emergencyContact: "+91-9876543219",
        age: 28,
        city: "Bhopal",
        isVerified: false,
        isBlocked: false,
        role: "pilgrim",
        preferences: { language: "urdu", accessibility: false },
        pilgrimType: "young_devotee"
      }
    ];

    for (const user of users) {
      await addDocument("users", user);
    }
  }

  private async seedCrowdData() {
    const locations = [
      {
        location: "Mahakaleshwar Temple Main Gate",
        latitude: "23.1815",
        longitude: "75.7682",
        crowdCount: 8500,
        capacity: 10000,
        occupancyRate: 85,
        densityLevel: "high",
        waitTime: "45 min",
        status: "busy",
        facilities: ["security", "information", "medical"],
        safetyRating: 4.5
      },
      {
        location: "Male Devotee Route",
        latitude: "23.1820", 
        longitude: "75.7685",
        crowdCount: 6200,
        capacity: 8000,
        occupancyRate: 78,
        densityLevel: "medium",
        waitTime: "25 min",
        status: "moderate",
        facilities: ["security", "restrooms", "water"],
        safetyRating: 4.2
      },
      {
        location: "Female Devotee Route",
        latitude: "23.1810",
        longitude: "75.7685", 
        crowdCount: 4100,
        capacity: 6000,
        occupancyRate: 68,
        densityLevel: "medium",
        waitTime: "15 min",
        status: "moderate",
        facilities: ["security", "restrooms", "water", "baby_care"],
        safetyRating: 4.7
      },
      {
        location: "Senior Citizens Priority Path",
        latitude: "23.1825",
        longitude: "75.7680",
        crowdCount: 1200,
        capacity: 2000,
        occupancyRate: 60,
        densityLevel: "low",
        waitTime: "5 min",
        status: "comfortable",
        facilities: ["wheelchair", "medical", "seating", "shade"],
        safetyRating: 5.0
      },
      {
        location: "VIP Darshan Entry",
        latitude: "23.1812",
        longitude: "75.7675",
        crowdCount: 350,
        capacity: 500,
        occupancyRate: 70,
        densityLevel: "medium",
        waitTime: "10 min",
        status: "exclusive",
        facilities: ["security", "ac_waiting", "premium_restrooms"],
        safetyRating: 5.0
      },
      {
        location: "Temple Inner Sanctum",
        latitude: "23.1818",
        longitude: "75.7678",
        crowdCount: 85,
        capacity: 100,
        occupancyRate: 85,
        densityLevel: "high",
        waitTime: "20 min",
        status: "sacred",
        facilities: ["priests", "offerings"],
        safetyRating: 4.8
      },
      {
        location: "Prasad Distribution Center",
        latitude: "23.1822",
        longitude: "75.7683",
        crowdCount: 1100,
        capacity: 1500,
        occupancyRate: 73,
        densityLevel: "medium",
        waitTime: "12 min",
        status: "active",
        facilities: ["prasad", "food", "water"],
        safetyRating: 4.3
      },
      {
        location: "Main Parking Area",
        latitude: "23.1830",
        longitude: "75.7690",
        crowdCount: 2200,
        capacity: 3000,
        occupancyRate: 73,
        densityLevel: "medium",
        waitTime: "8 min",
        status: "available",
        facilities: ["parking", "security", "shuttle"],
        safetyRating: 4.1
      },
      {
        location: "Information Center Hub",
        latitude: "23.1808",
        longitude: "75.7672",
        crowdCount: 650,
        capacity: 800,
        occupancyRate: 81,
        densityLevel: "high",
        waitTime: "15 min",
        status: "busy",
        facilities: ["information", "wifi", "charging", "maps"],
        safetyRating: 4.6
      },
      {
        location: "Medical Emergency Station",
        latitude: "23.1813",
        longitude: "75.7690",
        crowdCount: 120,
        capacity: 200,
        occupancyRate: 60,
        densityLevel: "low",
        waitTime: "2 min",
        status: "standby",
        facilities: ["ambulance", "doctor", "pharmacy", "first_aid"],
        safetyRating: 5.0
      }
    ];

    for (const location of locations) {
      await addDocument("crowdData", {
        ...location,
        lastUpdated: new Date(),
        timestamp: new Date()
      });
    }
  }

  private async seedSpiritualEvents() {
    const events = [
      {
        name: "Mahakal Bhasma Aarti",
        description: "Sacred morning ritual with ashes from cremation grounds, most powerful darshan of Lord Shiva",
        location: "Mahakaleshwar Temple Main Sanctum",
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 90,
        capacity: 500,
        currentAttendees: 445,
        liveStreamUrl: "https://smartkumbh.live/bhasma-aarti",
        isLive: false,
        spiritualSignificance: "Most sacred aarti in Ujjain, performed only here",
        ticketPrice: 0,
        languages: ["Sanskrit", "Hindi"],
        ageRestriction: "All ages welcome",
        dressCode: "Traditional attire preferred"
      },
      {
        name: "Ganga Aarti",
        description: "Evening prayers at the sacred Shipra river with hundreds of lamps",
        location: "Triveni Sangam, Shipra River",
        dateTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        duration: 60,
        capacity: 2000,
        currentAttendees: 1650,
        liveStreamUrl: "https://smartkumbh.live/ganga-aarti",
        isLive: false,
        spiritualSignificance: "Evening prayers to River Goddess Shipra",
        ticketPrice: 0,
        languages: ["Sanskrit", "Hindi"],
        ageRestriction: "Family friendly",
        specialFeatures: ["Boat rides available", "Photography allowed"]
      },
      {
        name: "Sandhya Aarti",
        description: "Beautiful sunset prayers with traditional hymns and incense",
        location: "All Temple Complexes",
        dateTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
        duration: 45,
        capacity: 5000,
        currentAttendees: 3200,
        liveStreamUrl: "https://smartkumbh.live/sandhya-aarti",
        isLive: false,
        spiritualSignificance: "Evening gratitude prayers",
        ticketPrice: 0,
        languages: ["Multiple languages"],
        specialFeatures: ["Multiple locations", "Wheelchair accessible"]
      },
      {
        name: "Shri Ram Katha",
        description: "Traditional storytelling of Ramayana with local cultural performances",
        location: "Cultural Amphitheater",
        dateTime: new Date(Date.now() + 14 * 60 * 60 * 1000), // 14 hours from now
        duration: 180,
        capacity: 3000,
        currentAttendees: 2100,
        liveStreamUrl: "https://smartkumbh.live/ram-katha",
        isLive: false,
        spiritualSignificance: "Epic story of Lord Rama's journey",
        ticketPrice: 0,
        languages: ["Hindi", "English subtitles"],
        specialFeatures: ["Cultural performances", "Children activities"]
      },
      {
        name: "Midnight Shiva Abhishek",
        description: "Special midnight prayers and sacred bath ceremony for Lord Shiva",
        location: "Mahakaleshwar Temple",
        dateTime: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
        duration: 120,
        capacity: 200,
        currentAttendees: 156,
        liveStreamUrl: "https://smartkumbh.live/midnight-abhishek",
        isLive: false,
        spiritualSignificance: "Sacred midnight worship, very auspicious",
        ticketPrice: 500,
        languages: ["Sanskrit", "Hindi"],
        ageRestriction: "Adults only",
        dressCode: "White attire only",
        specialFeatures: ["Limited entry", "VIP darshan included"]
      }
    ];

    for (const event of events) {
      await addDocument("spiritualEvents", {
        ...event,
        reminderUserIds: [],
        organizer: "Mahakaleshwar Temple Trust",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  private async seedSafetyAlerts() {
    const alerts = [
      {
        title: "🌤️ Weather Advisory",
        message: "Pleasant weather expected throughout the day. Temperature: 22-28°C. Light breeze from east.",
        alertType: "weather",
        priority: "low",
        location: "All Areas",
        isActive: true,
        createdBy: "Weather Monitoring System",
        estimatedDuration: "24 hours",
        affectedAreas: ["All Areas"],
        actionRequired: false
      },
      {
        title: "🚐 Shuttle Service Update",
        message: "Additional shuttle buses deployed on Main Route due to increased pilgrim flow. Frequency: Every 5 minutes.",
        alertType: "transport",
        priority: "medium",
        location: "Transport Hub",
        isActive: true,
        createdBy: "Transport Coordinator",
        estimatedDuration: "Until evening",
        affectedAreas: ["Main Route", "Parking Areas"],
        actionRequired: false
      },
      {
        title: "📱 Free WiFi Activated",
        message: "High-speed internet available at all Information Centers. Network: 'SmartKumbh-Free' | Password: 'Mahakal2024'",
        alertType: "network",
        priority: "low",
        location: "Information Centers",
        isActive: true,
        createdBy: "IT Department",
        estimatedDuration: "24/7 available",
        affectedAreas: ["Information Centers", "Medical Stations"],
        actionRequired: false
      },
      {
        title: "🏥 Enhanced Medical Support",
        message: "Additional ambulances and specialist doctors on standby. 24/7 emergency helpline: 108",
        alertType: "medical",
        priority: "medium",
        location: "All Medical Stations",
        isActive: true,
        createdBy: "Medical Chief",
        estimatedDuration: "Ongoing",
        affectedAreas: ["Medical Stations", "Main Routes"],
        actionRequired: false
      },
      {
        title: "🎯 QR Code Checkpoint Active",
        message: "SmartKumbh QR verification points operational. Get your digital pilgrim ID for faster processing.",
        alertType: "technology",
        priority: "medium",
        location: "All Entry Points",
        isActive: true,
        createdBy: "Digital Services",
        estimatedDuration: "24/7 active",
        affectedAreas: ["Entry Gates", "Information Centers"],
        actionRequired: true,
        actionText: "Generate QR Code"
      }
    ];

    for (const alert of alerts) {
      await addDocument("safetyAlerts", {
        ...alert,
        createdAt: new Date(),
        lastUpdated: new Date(),
        viewCount: Math.floor(Math.random() * 500) + 100
      });
    }
  }

  private async seedLostAndFound() {
    const cases = [
      {
        type: "missing_person",
        name: "Ramesh Kumar (Age 8)",
        description: "8-year-old boy, wearing red shirt and blue shorts, speaks Hindi",
        reportedBy: "Sunita Kumar (Mother)",
        contactPhone: "+91-9876541234",
        lastSeenLocation: "Near Prasad Counter",
        lastSeenTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: "active",
        isApproved: true,
        distinguishingFeatures: "Small birthmark on left cheek, wearing blue cap",
        emergencyContact: "+91-9876541235",
        policeStationNotified: true,
        publicBroadcast: true,
        caseNumber: "MP-2024-001"
      },
      {
        type: "found_item",
        name: "Samsung Galaxy Mobile Phone",
        description: "Black Samsung Galaxy smartphone with purple phone case and screen protector",
        foundLocation: "Information Center",
        foundTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        foundBy: "Volunteer Rakesh",
        status: "found",
        storageLocation: "Lost Property Office",
        caseNumber: "FI-2024-007",
        condition: "Good working condition",
        additionalDetails: "Phone is locked, wallpaper shows family photo"
      },
      {
        type: "missing_person",
        name: "Indira Devi (Age 72)",
        description: "Elderly lady, wearing white saree, uses walking stick, speaks Hindi/Gujarati",
        reportedBy: "Mukesh Patel (Son)",
        contactPhone: "+91-9876542345",
        lastSeenLocation: "Female Devotee Route",
        lastSeenTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        status: "active",
        isApproved: true,
        distinguishingFeatures: "Wears glasses, has silver bracelet, slight hearing difficulty",
        emergencyContact: "+91-9876542346",
        medicalConditions: "Diabetes, blood pressure medication required",
        policeStationNotified: true,
        publicBroadcast: true,
        caseNumber: "MP-2024-002"
      },
      {
        type: "found_item",
        name: "Gold Chain",
        description: "Gold chain with Ganesh pendant, medium weight",
        foundLocation: "Temple Main Gate",
        foundTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        foundBy: "Security Guard Ravi",
        status: "found",
        storageLocation: "Security Office",
        caseNumber: "FI-2024-008",
        condition: "Excellent condition",
        additionalDetails: "Engraved with initials 'S.K.' on back of pendant"
      },
      {
        type: "found_item",
        name: "Prescription Glasses",
        description: "Reading glasses in brown frame case, progressive lenses",
        foundLocation: "Medical Station",
        foundTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        foundBy: "Dr. Sharma",
        status: "found",
        storageLocation: "Medical Station Counter",
        caseNumber: "FI-2024-009",
        condition: "Good condition",
        additionalDetails: "Prescription appears to be for elderly person"
      }
    ];

    for (const case_ of cases) {
      await addDocument("lostAndFound", {
        ...case_,
        createdAt: new Date(),
        lastUpdated: new Date(),
        priority: case_.type.includes("missing_person") ? "high" : "medium"
      });
    }
  }

  private async seedCleanlinessReports() {
    const reports = [
      {
        location: "Main Temple Restrooms",
        facilityType: "restroom",
        rating: 4,
        feedback: "Clean and well-maintained. Could use more tissue paper dispensers.",
        reportedBy: "Priya Sharma",
        isResolved: false,
        issues: ["supply_shortage"],
        priority: "medium",
        reportTime: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        location: "Food Court Area",
        facilityType: "dining",
        rating: 5,
        feedback: "Excellent cleanliness standards. Staff very attentive to hygiene.",
        reportedBy: "Amit Patel",
        isResolved: true,
        assignedStaff: "Sanitation Team A",
        resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        priority: "low",
        reportTime: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      {
        location: "Parking Area Toilets",
        facilityType: "restroom",
        rating: 2,
        feedback: "Needs immediate attention. Water shortage and cleanliness issues.",
        reportedBy: "Rajesh Kumar",
        isResolved: false,
        issues: ["water_shortage", "cleaning_required"],
        priority: "high",
        reportTime: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        location: "Information Center",
        facilityType: "facility",
        rating: 5,
        feedback: "Very clean and organized. Staff helpful and area well-maintained.",
        reportedBy: "Sunita Devi",
        isResolved: true,
        assignedStaff: "Facility Management",
        priority: "low",
        reportTime: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        location: "Prasad Distribution Area",
        facilityType: "food_service",
        rating: 3,
        feedback: "Generally clean but floors get slippery. Need better drainage.",
        reportedBy: "Mohammed Khan",
        isResolved: false,
        issues: ["drainage", "floor_maintenance"],
        priority: "medium",
        reportTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000) // 1.5 hours ago
      }
    ];

    for (const report of reports) {
      await addDocument("cleanlinessReports", {
        ...report,
        createdAt: new Date(),
        lastUpdated: new Date(),
        inspectionDue: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next inspection in 24 hours
      });
    }
  }

  private async seedHelpBooths() {
    const helpBooths = [
      {
        name: "Main Information Center",
        location: "Temple Entrance",
        coordinates: { latitude: "23.1808", longitude: "75.7672" },
        staffMembers: ["Rajesh Sharma", "Priya Patel"],
        languages: ["Hindi", "English", "Gujarati", "Marathi"],
        services: ["information", "directions", "emergency_assistance", "lost_and_found", "first_aid", "wifi"],
        contactNumber: "+91-9876501234",
        operatingHours: "24/7",
        currentStatus: "active",
        visitorsHelped: 1456,
        avgResponseTime: "2 minutes",
        specializations: ["Senior citizen assistance", "Wheelchair support", "Language translation"],
        facilities: ["Seating area", "Water dispenser", "Phone charging", "Maps and brochures"]
      },
      {
        name: "Medical Emergency Station",
        location: "Medical Complex",
        coordinates: { latitude: "23.1813", longitude: "75.7690" },
        staffMembers: ["Dr. Arvind Singh", "Nurse Sita Devi", "Paramedic Ravi"],
        languages: ["Hindi", "English"],
        services: ["emergency_medical", "first_aid", "ambulance", "pharmacy", "health_checkup"],
        contactNumber: "+91-9876502345",
        operatingHours: "24/7",
        currentStatus: "active",
        visitorsHelped: 234,
        avgResponseTime: "1 minute",
        emergencyLevel: "Level 1 Trauma Center",
        equipment: ["Ambulance", "Defibrillator", "Oxygen", "Wheelchair", "Stretcher"]
      },
      {
        name: "Security & Safety Hub",
        location: "Main Gate Security",
        coordinates: { latitude: "23.1815", longitude: "75.7682" },
        staffMembers: ["Inspector Mohan Singh", "Constable Ramesh", "Constable Sunita"],
        languages: ["Hindi", "English"],
        services: ["security", "lost_and_found", "emergency_response", "crowd_control"],
        contactNumber: "+91-9876503456",
        operatingHours: "24/7",
        currentStatus: "active",
        visitorsHelped: 567,
        avgResponseTime: "30 seconds",
        specializations: ["Crowd management", "Emergency evacuation", "VIP security"],
        equipment: ["CCTV monitoring", "Metal detectors", "Radio communication", "Emergency sirens"]
      },
      {
        name: "Senior Citizen Support Center",
        location: "Priority Path Entrance",
        coordinates: { latitude: "23.1825", longitude: "75.7680" },
        staffMembers: ["Volunteer Kamal", "Volunteer Sushma"],
        languages: ["Hindi", "English", "Gujarati"],
        services: ["wheelchair_assistance", "priority_access", "companion_service", "medical_support"],
        contactNumber: "+91-9876504567",
        operatingHours: "6:00 AM - 10:00 PM",
        currentStatus: "active",
        visitorsHelped: 189,
        avgResponseTime: "1 minute",
        specializations: ["Elderly care", "Disability support", "Comfort assistance"],
        facilities: ["Wheelchair rental", "Seating area", "Shade", "Rest area", "Medical kit"]
      },
      {
        name: "Transport Coordination Hub",
        location: "Parking Area",
        coordinates: { latitude: "23.1830", longitude: "75.7690" },
        staffMembers: ["Transport Officer Vishnu", "Coordinator Geeta"],
        languages: ["Hindi", "English"],
        services: ["transport_info", "shuttle_service", "parking_assistance", "route_planning"],
        contactNumber: "+91-9876505678",
        operatingHours: "5:00 AM - 11:00 PM",
        currentStatus: "active",
        visitorsHelped: 892,
        avgResponseTime: "3 minutes",
        specializations: ["Route optimization", "Traffic management", "Shuttle coordination"],
        facilities: ["Transport maps", "Shuttle schedules", "Parking tickets", "Route guidance"]
      }
    ];

    for (const booth of helpBooths) {
      await addDocument("helpBooths", {
        ...booth,
        createdAt: new Date(),
        lastUpdated: new Date(),
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        totalRatings: Math.floor(Math.random() * 200) + 50
      });
    }
  }
}

// Create and export singleton
export const dataSeeder = new DataSeeder();

// Auto-seed when imported
export const initializeData = async () => {
  await dataSeeder.seedInitialData();
  console.log('🚀 Real-time data generation started for hackathon demo!');
  console.log('🎯 SmartKumbh Hackathon Demo Ready!');
  console.log('📊 Features: Real-time data, QR codes, Firebase integration, Admin panel with 2FA');
};

export default dataSeeder;