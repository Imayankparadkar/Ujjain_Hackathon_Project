import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/Layout";
import { MapPin, Clock, Star, Navigation, Search, Filter, Phone, Globe, Users, Info, Calendar, Eye } from "lucide-react";
import { Map } from "@/components/ui/map";

interface Attraction {
  id: string;
  name: string;
  category: "temple" | "ghat" | "museum" | "park" | "ashram" | "entertainment";
  description: string;
  location: {
    address: string;
    coordinates: [number, number]; // [lat, lng]
  };
  rating: number;
  reviews: number;
  timings: string;
  entryFee: string;
  highlights: string[];
  nearbyAttractions: string[];
  contact?: string;
  website?: string;
  significance: string;
  bestTimeToVisit: string;
  image: string;
}

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailAttraction, setDetailAttraction] = useState<Attraction | null>(null);

  useEffect(() => {
    // Comprehensive Ujjain attractions data
    const ujjainAttractions: Attraction[] = [
      {
        id: "ATT001",
        name: "Shri Mahakaleshwar Jyotirlinga Temple",
        category: "temple",
        description: "One of the twelve Jyotirlingas, this ancient temple is dedicated to Lord Shiva and is famous for the Bhasma Aarti performed at dawn.",
        location: {
          address: "Rudra Sagar Lake, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1828, 75.7681]
        },
        rating: 4.8,
        reviews: 15420,
        timings: "4:00 AM - 11:00 PM",
        entryFee: "Free (VIP Darshan: ₹251)",
        highlights: ["Bhasma Aarti", "Jyotirlinga", "Ancient Architecture", "Spiritual Significance"],
        nearbyAttractions: ["Harsiddhi Temple", "Ram Ghat", "Kaal Bhairav Temple"],
        contact: "+91-734-2550067",
        website: "mahakaleshwar.nic.in",
        significance: "Most revered Jyotirlinga temple with unique south-facing lingam",
        bestTimeToVisit: "October to March, Early morning for Bhasma Aarti",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT002", 
        name: "Shree Harsiddhi Mata Shaktipeeth Temple",
        category: "temple",
        description: "Ancient Shaktipeeth temple dedicated to Goddess Harsiddhi, known for its beautiful architecture and spiritual ambiance.",
        location: {
          address: "Harsiddhi Tekri, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1815, 75.7692]
        },
        rating: 4.6,
        reviews: 8930,
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        entryFee: "Free",
        highlights: ["Shaktipeeth", "Ancient Sculptures", "Festival Celebrations", "Panoramic Views"],
        nearbyAttractions: ["Mahakaleshwar Temple", "Triveni Museum", "Ram Ghat"],
        contact: "+91-734-2551234",
        significance: "One of the 51 Shaktipeeths where Goddess Sati's elbow fell",
        bestTimeToVisit: "During Navaratri and winter months",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT003",
        name: "Shri Ram Ghat",
        category: "ghat",
        description: "Sacred bathing ghat on the banks of Shipra River, famous for evening aarti and spiritual ceremonies.",
        location: {
          address: "Shipra River, Ram Ghat Road, Ujjain, Madhya Pradesh",
          coordinates: [23.1765, 75.7661]
        },
        rating: 4.5,
        reviews: 6750,
        timings: "24 Hours",
        entryFee: "Free",
        highlights: ["Evening Aarti", "Boat Rides", "Sacred Bathing", "Photography"],
        nearbyAttractions: ["Mahakaleshwar Temple", "Shipra River", "Kaal Bhairav Temple"],
        significance: "Important pilgrimage site for holy baths in Shipra River",
        bestTimeToVisit: "Evening for aarti, winter months",
        image: "https://images.unsplash.com/photo-1566312627554-e6ddd18bfb8a?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT004",
        name: "Shri Kaal Bhairav Temple",
        category: "temple",
        description: "Ancient temple dedicated to Kaal Bhairav, the guardian deity of Ujjain, famous for its unique offering of liquor.",
        location: {
          address: "Kaal Bhairav Road, Ujjain, Madhya Pradesh 456001",
          coordinates: [23.1689, 75.7831]
        },
        rating: 4.7,
        reviews: 9240,
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 10:00 PM",
        entryFee: "Free",
        highlights: ["Unique Offerings", "Ancient Architecture", "Guardian Deity", "Local Culture"],
        nearbyAttractions: ["Mahakaleshwar Temple", "Ram Ghat", "Sandipani Ashram"],
        contact: "+91-734-2552345",
        significance: "Guardian deity of Ujjain, offered liquor as prasad",
        bestTimeToVisit: "Evening hours, winter season",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT005",
        name: "Maharishi Sandipani Ashram",
        category: "ashram",
        description: "Ancient ashram where Lord Krishna and Sudama received education from Guru Sandipani.",
        location: {
          address: "Sandipani Nagar, Ujjain, Madhya Pradesh 456010",
          coordinates: [23.1595, 75.7848]
        },
        rating: 4.4,
        reviews: 5630,
        timings: "6:00 AM - 6:00 PM",
        entryFee: "Free",
        highlights: ["Historical Significance", "Educational Heritage", "Peaceful Environment", "Meditation"],
        nearbyAttractions: ["Kaal Bhairav Temple", "ISKCON Temple", "Bhartihari Caves"],
        contact: "+91-734-2553456",
        significance: "Legendary education center of Lord Krishna",
        bestTimeToVisit: "Morning hours, winter season",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT006",
        name: "Jai Maa Gadhkalika Mata Mandir",
        category: "temple",
        description: "Prominent temple dedicated to Goddess Kalika, known for its spiritual atmosphere and festivals.",
        location: {
          address: "Dewas Road, Ujjain, Madhya Pradesh 456010",
          coordinates: [23.1612, 75.7945]
        },
        rating: 4.3,
        reviews: 4820,
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        entryFee: "Free",
        highlights: ["Goddess Temple", "Festival Celebrations", "Peaceful Environment", "Local Devotion"],
        nearbyAttractions: ["Sandipani Ashram", "ISKCON Temple", "Bhartihari Caves"],
        significance: "Important temple for Goddess Kalika worship",
        bestTimeToVisit: "During festivals, winter months",
        image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT007",
        name: "Triveni Museum",
        category: "museum",
        description: "Museum showcasing the rich cultural heritage, artifacts, and history of Ujjain and surrounding regions.",
        location: {
          address: "Museum Road, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1798, 75.7701]
        },
        rating: 4.2,
        reviews: 3450,
        timings: "10:00 AM - 5:00 PM (Closed on Mondays)",
        entryFee: "₹20 (Adults), ₹10 (Children)",
        highlights: ["Historical Artifacts", "Cultural Heritage", "Educational", "Art Collection"],
        nearbyAttractions: ["Harsiddhi Temple", "Mahakaleshwar Temple", "Ram Ghat"],
        contact: "+91-734-2554567",
        significance: "Repository of regional history and culture",
        bestTimeToVisit: "Morning hours, winter season",
        image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT008",
        name: "Atal Park",
        category: "park",
        description: "Beautiful urban park with recreational facilities, walking tracks, and green spaces for families.",
        location: {
          address: "Atal Bihari Vajpayee Park, Ujjain, Madhya Pradesh 456010",
          coordinates: [23.1567, 75.7823]
        },
        rating: 4.1,
        reviews: 2890,
        timings: "5:00 AM - 10:00 PM",
        entryFee: "₹10 (Entry), ₹5 (Children)",
        highlights: ["Family Recreation", "Walking Tracks", "Children's Play Area", "Greenery"],
        nearbyAttractions: ["Sandipani Ashram", "ISKCON Temple", "Kaal Bhairav Temple"],
        significance: "Popular recreational spot for families",
        bestTimeToVisit: "Evening hours, winter season",
        image: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT009",
        name: "ISKCON Temple, Ujjain",
        category: "temple",
        description: "Modern temple dedicated to Lord Krishna, known for its beautiful architecture and spiritual programs.",
        location: {
          address: "ISKCON Road, Ujjain, Madhya Pradesh 456010",
          coordinates: [23.1589, 75.7867]
        },
        rating: 4.5,
        reviews: 6740,
        timings: "4:30 AM - 1:00 PM, 4:00 PM - 8:30 PM",
        entryFee: "Free",
        highlights: ["Modern Architecture", "Spiritual Programs", "Prasadam", "Cultural Events"],
        nearbyAttractions: ["Sandipani Ashram", "Atal Park", "Kaal Bhairav Temple"],
        contact: "+91-734-2555678",
        website: "iskconujjain.org",
        significance: "International temple promoting Krishna consciousness",
        bestTimeToVisit: "During festivals, evening aarti",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT010",
        name: "Bharat Mata Mandir",
        category: "temple",
        description: "Unique temple dedicated to Mother India, showcasing patriotic spirit and national heritage.",
        location: {
          address: "Dewas Road, Ujjain, Madhya Pradesh 456010",
          coordinates: [23.1634, 75.7912]
        },
        rating: 4.0,
        reviews: 2340,
        timings: "6:00 AM - 8:00 PM",
        entryFee: "Free",
        highlights: ["Patriotic Theme", "National Heritage", "Unique Concept", "Cultural Significance"],
        nearbyAttractions: ["Gadhkalika Temple", "Sandipani Ashram", "ISKCON Temple"],
        significance: "Temple dedicated to Mother India",
        bestTimeToVisit: "National holidays, winter season",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT011",
        name: "Shri Dwarkadhish Gopal Mandir",
        category: "temple",
        description: "Beautiful temple dedicated to Lord Krishna in his Dwarkadhish form, known for its intricate carvings.",
        location: {
          address: "Gopal Mandir Road, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1723, 75.7645]
        },
        rating: 4.4,
        reviews: 4560,
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        entryFee: "Free",
        highlights: ["Krishna Temple", "Intricate Carvings", "Spiritual Atmosphere", "Architecture"],
        nearbyAttractions: ["Ram Ghat", "Mahakaleshwar Temple", "Harsiddhi Temple"],
        contact: "+91-734-2556789",
        significance: "Important Krishna temple with beautiful architecture",
        bestTimeToVisit: "During Krishna festivals, winter months",
        image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT012",
        name: "Jantar Mantar",
        category: "museum",
        description: "Historic astronomical observatory built by Maharaja Jai Singh II, featuring ancient astronomical instruments.",
        location: {
          address: "Jantar Mantar Road, Ujjain, Madhya Pradesh 456010",
          coordinates: [23.1812, 75.7723]
        },
        rating: 4.3,
        reviews: 5670,
        timings: "9:00 AM - 5:00 PM",
        entryFee: "₹25 (Indians), ₹300 (Foreigners)",
        highlights: ["Astronomical Instruments", "Historical Significance", "Educational", "Architecture"],
        nearbyAttractions: ["Mahakaleshwar Temple", "Harsiddhi Temple", "Vikram Kirti Mandir"],
        contact: "+91-734-2557890",
        significance: "Historic astronomical observatory from 18th century",
        bestTimeToVisit: "Morning hours, winter season",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT013",
        name: "Vikram Kirti Mandir Museum",
        category: "museum",
        description: "Museum dedicated to King Vikramaditya and showcasing local history, culture, and archaeological findings.",
        location: {
          address: "Vikram University Campus, Ujjain, Madhya Pradesh 456010",
          coordinates: [23.1756, 75.7834]
        },
        rating: 4.1,
        reviews: 3240,
        timings: "10:00 AM - 5:00 PM (Closed on Sundays)",
        entryFee: "₹15 (Adults), ₹5 (Students)",
        highlights: ["King Vikramaditya", "Archaeological Artifacts", "Local History", "Educational"],
        nearbyAttractions: ["Jantar Mantar", "Kalidasa Academy", "Mahakal Lok"],
        contact: "+91-734-2558901",
        significance: "Dedicated to legendary King Vikramaditya",
        bestTimeToVisit: "Morning hours, weekdays",
        image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT014",
        name: "Kalidasa Sanskrit Akademi",
        category: "museum",
        description: "Academy dedicated to the great Sanskrit poet Kalidasa, promoting Sanskrit literature and culture.",
        location: {
          address: "Kalidasa Road, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1689, 75.7756]
        },
        rating: 4.0,
        reviews: 2180,
        timings: "10:00 AM - 5:00 PM (Closed on Sundays)",
        entryFee: "₹10",
        highlights: ["Sanskrit Literature", "Cultural Heritage", "Educational Programs", "Research Center"],
        nearbyAttractions: ["Vikram Kirti Mandir", "Jantar Mantar", "Mahakaleshwar Temple"],
        contact: "+91-734-2559012",
        website: "kalidasaakademi.org",
        significance: "Center for Sanskrit literature and Kalidasa's works",
        bestTimeToVisit: "Morning hours, cultural events",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT015",
        name: "Mahakal Lok",
        category: "park",
        description: "Modern corridor and cultural complex connecting Mahakaleshwar Temple with various facilities and attractions.",
        location: {
          address: "Mahakal Lok Corridor, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1845, 75.7698]
        },
        rating: 4.6,
        reviews: 8930,
        timings: "5:00 AM - 11:00 PM",
        entryFee: "Free",
        highlights: ["Modern Architecture", "Cultural Complex", "Temple Corridor", "Facilities"],
        nearbyAttractions: ["Mahakaleshwar Temple", "Harsiddhi Temple", "Ram Ghat"],
        significance: "Modern development enhancing temple experience",
        bestTimeToVisit: "Evening hours, all seasons",
        image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT016",
        name: "Mangalnath Mandir",
        category: "temple",
        description: "Ancient temple dedicated to Lord Shiva, believed to be the birthplace of Mars (Mangal) according to Hindu mythology.",
        location: {
          address: "Mangalnath Road, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1567, 75.7612]
        },
        rating: 4.5,
        reviews: 6340,
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        entryFee: "Free",
        highlights: ["Mangal Grah Temple", "Astrological Significance", "Ancient Architecture", "Shipra Bank"],
        nearbyAttractions: ["Ram Ghat", "Shipra River", "Dwarkadhish Temple"],
        contact: "+91-734-2560123",
        significance: "Birthplace of Mars planet according to Hindu astronomy",
        bestTimeToVisit: "Tuesday (Mangal Day), winter season",
        image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT017",
        name: "Navgrah Shani Mandir Ujjain",
        category: "temple",
        description: "Temple dedicated to Lord Shani and all nine planets, known for astrological remedies and spiritual healing.",
        location: {
          address: "Shani Mandir Road, Ujjain, Madhya Pradesh 456010",
          coordinates: [23.1623, 75.7789]
        },
        rating: 4.3,
        reviews: 5240,
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 8:00 PM",
        entryFee: "Free",
        highlights: ["Navgrah Temple", "Astrological Remedies", "Saturn Temple", "Spiritual Healing"],
        nearbyAttractions: ["Mangalnath Temple", "Kaal Bhairav Temple", "ISKCON Temple"],
        contact: "+91-734-2561234",
        significance: "Important temple for planetary remedies",
        bestTimeToVisit: "Saturday (Shani Day), evening hours",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT018",
        name: "Kaliyadeh Palace",
        category: "museum",
        description: "Historic palace built during the Mughal era, now a monument showcasing Indo-Islamic architecture.",
        location: {
          address: "Kaliyadeh Palace Road, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1978, 75.7534]
        },
        rating: 4.2,
        reviews: 3670,
        timings: "9:00 AM - 6:00 PM",
        entryFee: "₹25 (Indians), ₹300 (Foreigners)",
        highlights: ["Mughal Architecture", "Historical Palace", "Indo-Islamic Style", "Photography"],
        nearbyAttractions: ["Bhartrihari Caves", "Shipra River", "Ram Ghat"],
        contact: "+91-734-2562345",
        significance: "Historic Mughal era palace",
        bestTimeToVisit: "Morning hours, winter season",
        image: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT019",
        name: "Bhartrihari Caves",
        category: "park",
        description: "Ancient caves associated with King Bhartrihari, offering peaceful meditation spots and natural beauty.",
        location: {
          address: "Bhartrihari Road, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1989, 75.7501]
        },
        rating: 4.1,
        reviews: 2890,
        timings: "6:00 AM - 6:00 PM",
        entryFee: "₹10",
        highlights: ["Ancient Caves", "Meditation Spot", "Natural Beauty", "Historical Significance"],
        nearbyAttractions: ["Kaliyadeh Palace", "Shipra River", "Chaubis Khamba Temple"],
        significance: "Associated with King Bhartrihari's meditation",
        bestTimeToVisit: "Morning hours, winter season",
        image: "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT020",
        name: "Shri Chaubis Khamba Mata Temple",
        category: "temple",
        description: "Ancient temple with 24 pillars, dedicated to Goddess Durga, known for its unique architecture.",
        location: {
          address: "Chaubis Khamba Road, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1934, 75.7456]
        },
        rating: 4.3,
        reviews: 4120,
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        entryFee: "Free",
        highlights: ["24 Pillars", "Goddess Temple", "Ancient Architecture", "Unique Structure"],
        nearbyAttractions: ["Bhartrihari Caves", "Kaliyadeh Palace", "Bada Ganesh Temple"],
        contact: "+91-734-2563456",
        significance: "Famous for its 24-pillar architecture",
        bestTimeToVisit: "During Navaratri, winter months",
        image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT021",
        name: "Shree Bada Ganesh Mandir",
        category: "temple",
        description: "Large Ganesh temple with impressive idol, popular among devotees for worship and blessings.",
        location: {
          address: "Bada Ganesh Road, Ujjain, Madhya Pradesh 456001",
          coordinates: [23.1712, 75.7598]
        },
        rating: 4.4,
        reviews: 5890,
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        entryFee: "Free",
        highlights: ["Large Ganesh Idol", "Popular Temple", "Devotional Atmosphere", "Festival Celebrations"],
        nearbyAttractions: ["Chintaman Ganesh Temple", "Ram Ghat", "Dwarkadhish Temple"],
        contact: "+91-734-2564567",
        significance: "Famous for large Ganesh idol",
        bestTimeToVisit: "During Ganesh Chaturthi, winter months",
        image: "https://images.unsplash.com/photo-1591069201230-6741aceaa7b4?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT022",
        name: "Shri Chintaman Ganesh Temple",
        category: "temple",
        description: "Ancient Ganesh temple known for fulfilling wishes and removing obstacles, popular pilgrimage site.",
        location: {
          address: "Chintaman Ganesh Road, Ujjain, Madhya Pradesh 456001",
          coordinates: [23.1689, 75.7623]
        },
        rating: 4.5,
        reviews: 7230,
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        entryFee: "Free",
        highlights: ["Wish Fulfillment", "Obstacle Removal", "Ancient Temple", "Spiritual Power"],
        nearbyAttractions: ["Bada Ganesh Temple", "Ram Ghat", "Mahakaleshwar Temple"],
        contact: "+91-734-2565678",
        significance: "Famous for removing obstacles and fulfilling wishes",
        bestTimeToVisit: "Wednesday and Sunday, during Ganesh festivals",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT023",
        name: "WWF Water Park & Resort",
        category: "entertainment",
        description: "Modern water park and resort offering recreational activities, swimming pools, and family entertainment.",
        location: {
          address: "Dewas Road, Ujjain, Madhya Pradesh 456010",
          coordinates: [23.1445, 75.8012]
        },
        rating: 4.0,
        reviews: 3450,
        timings: "10:00 AM - 6:00 PM",
        entryFee: "₹500 (Adults), ₹300 (Children)",
        highlights: ["Water Slides", "Swimming Pools", "Family Entertainment", "Resort Facilities"],
        nearbyAttractions: ["Meghdoot Resort", "Atal Park", "ISKCON Temple"],
        contact: "+91-734-2566789",
        website: "wwfwaterpark.com",
        significance: "Popular recreational destination for families",
        bestTimeToVisit: "Summer months, weekends",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT024",
        name: "Meghdoot Resort Water Park and Club",
        category: "entertainment",
        description: "Resort with water park facilities, club amenities, and recreational activities for tourists and locals.",
        location: {
          address: "Indore Road, Ujjain, Madhya Pradesh 456010",
          coordinates: [23.1512, 75.8034]
        },
        rating: 3.9,
        reviews: 2890,
        timings: "9:00 AM - 7:00 PM",
        entryFee: "₱450 (Adults), ₹250 (Children)",
        highlights: ["Water Park", "Club Facilities", "Resort Stay", "Recreation"],
        nearbyAttractions: ["WWF Water Park", "Atal Park", "Pir Matsyendranath"],
        contact: "+91-734-2567890",
        significance: "Entertainment and recreation complex",
        bestTimeToVisit: "Summer season, holidays",
        image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT025",
        name: "Pir Matsyendranath",
        category: "temple",
        description: "Unique shrine dedicated to Matsyendranath, revered by both Hindu and Muslim communities.",
        location: {
          address: "Pir Matsyendranath Road, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1598, 75.7892]
        },
        rating: 4.2,
        reviews: 3120,
        timings: "6:00 AM - 8:00 PM",
        entryFee: "Free",
        highlights: ["Inter-religious Harmony", "Unique Shrine", "Cultural Significance", "Historical Importance"],
        nearbyAttractions: ["Sandipani Ashram", "ISKCON Temple", "Meghdoot Resort"],
        contact: "+91-734-2568901",
        significance: "Symbol of communal harmony",
        bestTimeToVisit: "Evening hours, winter season",
        image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT026",
        name: "Kumbh Mela Ground, Ujjain",
        category: "park",
        description: "Historic ground where the Simhastha Kumbh Mela is held every 12 years, now used for various cultural events.",
        location: {
          address: "Kumbh Mela Ground, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1634, 75.7534]
        },
        rating: 4.4,
        reviews: 6780,
        timings: "24 Hours (Open during events)",
        entryFee: "Free (Event-based pricing)",
        highlights: ["Kumbh Mela Venue", "Cultural Events", "Historical Significance", "Large Ground"],
        nearbyAttractions: ["Ram Ghat", "Shipra River", "Mangalnath Temple"],
        significance: "Venue for the sacred Kumbh Mela",
        bestTimeToVisit: "During Kumbh Mela (every 12 years), cultural events",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT027",
        name: "Birla Mandir",
        category: "temple",
        description: "Modern temple built by the Birla family, known for its beautiful architecture and peaceful environment.",
        location: {
          address: "Birla Nagar, Ujjain, Madhya Pradesh 456010",
          coordinates: [23.1567, 75.7945]
        },
        rating: 4.2,
        reviews: 4560,
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        entryFee: "Free",
        highlights: ["Modern Architecture", "Peaceful Environment", "Beautiful Gardens", "Spiritual Atmosphere"],
        nearbyAttractions: ["Gadhkalika Temple", "Bharat Mata Mandir", "ISKCON Temple"],
        contact: "+91-734-2569012",
        significance: "Modern temple with traditional values",
        bestTimeToVisit: "Evening hours, winter season",
        image: "https://images.unsplash.com/photo-1580551695436-7b1a2e0f94c3?w=800&q=80&auto=format&fit=crop"
      },
      {
        id: "ATT028",
        name: "Vishnu Sagar Taalab",
        category: "park",
        description: "Historic lake and recreational area offering boating, walking tracks, and scenic beauty.",
        location: {
          address: "Vishnu Sagar Road, Ujjain, Madhya Pradesh 456006",
          coordinates: [23.1823, 75.7589]
        },
        rating: 4.1,
        reviews: 3890,
        timings: "5:00 AM - 9:00 PM",
        entryFee: "₹10 (Entry), ₹50 (Boating)",
        highlights: ["Historic Lake", "Boating", "Walking Tracks", "Scenic Beauty"],
        nearbyAttractions: ["Mahakaleshwar Temple", "Ram Ghat", "Harsiddhi Temple"],
        significance: "Historic water body and recreation spot",
        bestTimeToVisit: "Evening hours, winter season",
        image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80&auto=format&fit=crop"
      }
    ];

    setAttractions(ujjainAttractions);
    setFilteredAttractions(ujjainAttractions);
  }, []);

  useEffect(() => {
    let filtered = attractions;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(attraction => attraction.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(attraction =>
        attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attraction.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAttractions(filtered);
  }, [selectedCategory, searchQuery, attractions]);

  const categories = [
    { value: "all", label: "All Attractions", count: attractions.length },
    { value: "temple", label: "Temples", count: attractions.filter(a => a.category === "temple").length },
    { value: "ghat", label: "Ghats", count: attractions.filter(a => a.category === "ghat").length },
    { value: "museum", label: "Museums", count: attractions.filter(a => a.category === "museum").length },
    { value: "park", label: "Parks", count: attractions.filter(a => a.category === "park").length },
    { value: "ashram", label: "Ashrams", count: attractions.filter(a => a.category === "ashram").length },
    { value: "entertainment", label: "Entertainment", count: attractions.filter(a => a.category === "entertainment").length }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "temple": return "bg-orange-100 text-orange-800";
      case "ghat": return "bg-blue-100 text-blue-800";
      case "museum": return "bg-purple-100 text-purple-800";
      case "park": return "bg-green-100 text-green-800";
      case "ashram": return "bg-yellow-100 text-yellow-800";
      case "entertainment": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewOnMap = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    setShowMap(true);
  };

  const handleGetDirections = (attraction: Attraction) => {
    const [lat, lng] = attraction.location.coordinates;
    // Try to get user's current location for better navigation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          // Open OpenStreetMap with navigation from user location to destination
          const navigationUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLat}%2C${userLng}%3B${lat}%2C${lng}`;
          window.open(navigationUrl, '_blank');
        },
        (error) => {
          // Fallback: Open map centered on destination
          const fallbackUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`;
          window.open(fallbackUrl, '_blank');
          console.log('Location access denied, opening destination on map');
        }
      );
    } else {
      // Fallback for browsers without geolocation
      const fallbackUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`;
      window.open(fallbackUrl, '_blank');
    }
  };

  const handleViewDetails = (attraction: Attraction) => {
    setDetailAttraction(attraction);
    setShowDetailModal(true);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">Sacred Attractions of Ujjain</h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Discover ancient temples, holy ghats, and spiritual sites that have witnessed thousands of years of devotion
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{attractions.length}</div>
              <div className="text-lg text-white/80 font-medium">Total Attractions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{attractions.filter(a => a.category === 'temple').length}</div>
              <div className="text-lg text-white/80 font-medium">Sacred Temples</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">{attractions.filter(a => a.category === 'ghat').length}</div>
              <div className="text-lg text-white/80 font-medium">Holy Ghats</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-2">4.3★</div>
              <div className="text-lg text-white/80 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Sacred Attractions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Find temples, ghats, museums, and spiritual sites that resonate with your journey</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-12">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search temples, ghats, museums..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-4 text-lg border-0 focus:ring-2 focus:ring-orange-500 rounded-2xl bg-gray-50"
                    data-testid="search-attractions"
                  />
                </div>
                <Button
                  onClick={() => setShowMap(!showMap)}
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 border-orange-600 text-orange-600 hover:bg-orange-50 transition-all"
                  data-testid="toggle-map-view"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  {showMap ? "Hide Map" : "Show Map"}
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Filter by Category</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                      selectedCategory === category.value
                        ? "bg-orange-600 text-white shadow-lg hover:bg-orange-700"
                        : "border-2 border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600"
                    }`}
                    data-testid={`filter-${category.value}`}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    <span>{category.label}</span>
                    <Badge 
                      variant="secondary" 
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedCategory === category.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">

        {/* Map Section */}
        {showMap && selectedAttraction && (
          <Card className="mb-12 border-0 rounded-3xl shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8">
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <div className="bg-white/20 p-3 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
                <span>{selectedAttraction.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-96 rounded-2xl overflow-hidden border shadow-inner">
                <Map 
                  center={selectedAttraction.location.coordinates as [number, number]}
                  zoom={15}
                  className="h-full w-full"
                />
              </div>
              <div className="mt-6 p-6 bg-gray-50 rounded-2xl">
                <p className="font-semibold text-gray-900 text-lg">{selectedAttraction.location.address}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Coordinates: {selectedAttraction.location.coordinates.join(", ")}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 px-6 py-3 rounded-2xl border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold"
                  onClick={() => setShowMap(false)}
                >
                  Close Map View
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredAttractions.map((attraction) => (
            <Card key={attraction.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden" data-testid={`attraction-card-${attraction.id}`}>
              <div className="relative">
                <img
                  src={attraction.image}
                  alt={attraction.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <Badge className={`absolute top-4 left-4 px-3 py-1 rounded-2xl text-sm font-semibold ${getCategoryColor(attraction.category)}`}>
                  {attraction.category}
                </Badge>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-2xl px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold">{attraction.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-2xl mb-1" data-testid={`attraction-name-${attraction.id}`}>
                    {attraction.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-white/90">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">{attraction.reviews.toLocaleString()} reviews</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                <p className="text-gray-600 text-base mb-6 leading-relaxed line-clamp-3">
                  {attraction.description}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 font-medium">Location</div>
                      <div className="text-base text-gray-800 font-semibold truncate">{attraction.location.address}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 font-medium">Timings</div>
                      <div className="text-base text-gray-800 font-semibold">{attraction.timings}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="text-lg">💸</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 font-medium">Entry Fee</div>
                      <div className="text-base text-gray-800 font-semibold">{attraction.entryFee}</div>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {attraction.highlights.slice(0, 3).map((highlight, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 text-xs font-medium rounded-2xl border-gray-300">
                        {highlight}
                      </Badge>
                    ))}
                    {attraction.highlights.length > 3 && (
                      <Badge variant="outline" className="px-3 py-1 text-xs font-medium rounded-2xl border-gray-300 text-orange-600">
                        +{attraction.highlights.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleViewDetails(attraction)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg"
                    data-testid={`view-details-${attraction.id}`}
                  >
                    <Info className="h-5 w-5 mr-3" />
                    View Details & Pricing
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleViewOnMap(attraction)}
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-2xl font-semibold"
                      data-testid={`view-map-${attraction.id}`}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Map
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleGetDirections(attraction)}
                      className="border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-2xl font-semibold"
                      data-testid={`get-directions-${attraction.id}`}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </div>

                {/* Contact Info */}
                {(attraction.contact || attraction.website) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex space-x-3 justify-center">
                      {attraction.contact && (
                        <Button 
                          variant="ghost" 
                          className="text-gray-600 hover:text-orange-600 p-3 rounded-2xl"
                          onClick={() => window.open(`tel:${attraction.contact}`, '_self')}
                        >
                          <Phone className="h-5 w-5" />
                        </Button>
                      )}
                      {attraction.website && (
                        <Button 
                          variant="ghost" 
                          className="text-gray-600 hover:text-orange-600 p-3 rounded-2xl"
                          onClick={() => window.open(`https://${attraction.website}`, '_blank')}
                        >
                          <Globe className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAttractions.length === 0 && (
          <div className="text-center py-24">
            <div className="bg-white rounded-3xl shadow-lg p-16 max-w-2xl mx-auto">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <MapPin className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No attractions found</h3>
              <p className="text-xl text-gray-500 mb-8">Try adjusting your search or filter criteria to discover more sacred places</p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Attraction Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {detailAttraction && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-xl">
                  <span>{detailAttraction.name}</span>
                  <Badge className={getCategoryColor(detailAttraction.category)}>
                    {detailAttraction.category}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Hero Image and Rating */}
                <div className="relative">
                  <img
                    src={detailAttraction.image}
                    alt={detailAttraction.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-bold">{detailAttraction.rating}</span>
                      <span className="text-sm text-gray-600">({detailAttraction.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                    <Info className="h-5 w-5" />
                    <span>About</span>
                  </h3>
                  <p className="text-gray-700 mb-4">{detailAttraction.description}</p>
                  
                  {/* Significance */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Spiritual Significance</h4>
                    <p className="text-orange-700">{detailAttraction.significance}</p>
                  </div>
                </div>

                <Separator />

                {/* Pricing & Practical Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                      <span>💰</span>
                      <span>Entry Fee & Pricing</span>
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-lg font-semibold text-green-800">{detailAttraction.entryFee}</p>
                      <p className="text-sm text-green-600 mt-1">
                        {detailAttraction.entryFee === "Free" ? "No entry charges required" : "Check for special darshan pricing"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Timings</span>
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-lg font-semibold text-blue-800">{detailAttraction.timings}</p>
                      <p className="text-sm text-blue-600 mt-1">Daily operating hours</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Best Time to Visit */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Best Time to Visit</span>
                  </h3>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-purple-700">{detailAttraction.bestTimeToVisit}</p>
                  </div>
                </div>

                <Separator />

                {/* Highlights */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Highlights & Features</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {detailAttraction.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="py-2 px-3 text-center">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Location Information */}
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Location & Address</span>
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{detailAttraction.location.address}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Coordinates: {detailAttraction.location.coordinates.join(", ")}
                    </p>
                  </div>

                  {/* Nearby Attractions */}
                  {detailAttraction.nearbyAttractions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Nearby Attractions</h4>
                      <div className="flex flex-wrap gap-2">
                        {detailAttraction.nearbyAttractions.map((nearby, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {nearby}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Contact Information */}
                {(detailAttraction.contact || detailAttraction.website) && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center space-x-2">
                      <Phone className="h-5 w-5" />
                      <span>Contact Information</span>
                    </h3>
                    <div className="space-y-2">
                      {detailAttraction.contact && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{detailAttraction.contact}</span>
                        </div>
                      )}
                      {detailAttraction.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <a 
                            href={`https://${detailAttraction.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {detailAttraction.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => {
                      handleViewOnMap(detailAttraction);
                      setShowDetailModal(false);
                    }}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>View on Map</span>
                  </Button>
                  <Button
                    onClick={() => handleGetDirections(detailAttraction)}
                    className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Get Directions</span>
                  </Button>
                  {detailAttraction.contact && (
                    <Button
                      onClick={() => window.open(`tel:${detailAttraction.contact}`, '_self')}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call</span>
                    </Button>
                  )}
                  {detailAttraction.website && (
                    <Button
                      onClick={() => window.open(`https://${detailAttraction.website}`, '_blank')}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Visit Website</span>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}