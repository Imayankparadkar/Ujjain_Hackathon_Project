import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Route, Shield, Leaf, Microchip, Navigation, AlertTriangle, QrCode, MessageSquare, Calendar, MapPin, Users, Phone, Globe, Zap } from "lucide-react";
import { Link } from "wouter";

export default function FeaturesPage() {
  const features = [
    {
      id: "navigation",
      icon: <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center"><Route className="h-8 w-8 text-blue-600" /></div>,
      title: "Smart Navigation",
      description: "AI-powered route optimization with real-time crowd density analysis for optimal pilgrimage experience",
      details: [
        "Real-time crowd density heatmaps with 3D visualization",
        "Optimal route suggestions based on current conditions",
        "Emergency evacuation routes with GPS integration",
        "Multi-path options for different demographics",
        "Landmark-based navigation for elderly pilgrims"
      ]
    },
    {
      id: "safety",
      icon: <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center"><Shield className="h-8 w-8 text-red-600" /></div>,
      title: "Advanced Safety System",
      description: "24/7 monitoring and emergency response infrastructure with intelligent threat detection",
      details: [
        "Real-time safety alerts and push notifications",
        "Emergency contact system with one-touch calling",
        "Lost & found digital registry with AI matching",
        "Medical emergency response coordination",
        "Police and security integration platform"
      ]
    },
    {
      id: "sanitation",
      icon: <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center"><Leaf className="h-8 w-8 text-green-600" /></div>,
      title: "Community Cleanliness",
      description: "Crowd-sourced sanitation monitoring and feedback system for maintaining hygiene standards",
      details: [
        "Real-time cleanliness heatmaps and reports",
        "Community-driven feedback system with ratings",
        "Toilet and facility locator with availability",
        "Sanitation staff task management system",
        "Water quality monitoring and alerts"
      ]
    },
    {
      id: "digital",
      icon: <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center"><Microchip className="h-8 w-8 text-purple-600" /></div>,
      title: "Digital Ecosystem",
      description: "Integrated digital services for seamless pilgrim experience with modern technology",
      details: [
        "QR-based digital identity system with security",
        "Multilingual AI chatbot support (12 languages)",
        "Spiritual event scheduling and reminders",
        "Government service integration portal",
        "Offline SMS-based assistance for rural areas"
      ]
    },
    {
      id: "qr",
      icon: <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center"><QrCode className="h-8 w-8 text-orange-600" /></div>,
      title: "Digital Identity",
      description: "QR-based identification for enhanced safety and personalized services throughout your journey",
      details: [
        "Unique QR ID for each pilgrim with encryption",
        "Emergency contact information storage",
        "Medical information and allergy alerts",
        "Preferred language settings and accessibility",
        "Quick identification in emergencies with photo"
      ]
    },
    {
      id: "communication",
      icon: <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center"><MessageSquare className="h-8 w-8 text-indigo-600" /></div>,
      title: "Multi-Channel Communication",
      description: "Comprehensive communication system for all pilgrims with advanced AI assistance",
      details: [
        "AI-powered multilingual chatbot (KumbhBot) with 12 languages",
        "Voice-based query support with speech recognition",
        "SMS-based offline assistance for rural connectivity",
        "Emergency broadcast system with geo-targeting",
        "Real-time updates and push notifications"
      ]
    }
  ];

  const stats = [
    { icon: <div className="bg-blue-100 p-4 rounded-full"><Users className="h-8 w-8 text-blue-600" /></div>, value: "2.5M+", label: "Pilgrims Served" },
    { icon: <div className="bg-green-100 p-4 rounded-full"><Globe className="h-8 w-8 text-green-600" /></div>, value: "12", label: "Languages Supported" },
    { icon: <div className="bg-red-100 p-4 rounded-full"><AlertTriangle className="h-8 w-8 text-red-600" /></div>, value: "99.9%", label: "Safety Response Rate" },
    { icon: <div className="bg-purple-100 p-4 rounded-full"><Zap className="h-8 w-8 text-purple-600" /></div>, value: "24/7", label: "Real-time Monitoring" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            SmartKumbh Features
          </h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Revolutionary AI-powered solutions for the world's largest spiritual gathering
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-center mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover the advanced technology and intelligent systems that make SmartKumbh the ultimate pilgrimage companion</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature) => (
              <Card key={feature.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-10">
                  <div className="flex items-start space-x-6">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-3xl text-gray-800 mb-4">{feature.title}</CardTitle>
                      <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 pt-0">
                  <ul className="space-y-4">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-base text-gray-700 leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to Experience SmartKumbh?</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join millions of pilgrims who trust SmartKumbh for a safe, spiritual, and seamless journey to enlightenment
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login">
              <Button className="bg-orange-600 text-white hover:bg-orange-700 px-8 py-4 text-xl font-semibold rounded-2xl shadow-lg" data-testid="get-started-button">
                <Navigation className="mr-3 h-6 w-6" />
                Get Started
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="outline" className="border-2 border-orange-600 text-white hover:bg-orange-50 px-8 py-4 text-xl font-semibold rounded-2xl" data-testid="explore-map-button">
                <MapPin className="mr-3 h-6 w-6" />
                Explore Interactive Map
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}