import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Route, Shield, Leaf, Microchip, Navigation, AlertTriangle, QrCode, MessageSquare, Calendar, MapPin, Users, Phone, Globe, Zap } from "lucide-react";
import { Link } from "wouter";

export default function FeaturesPage() {
  const features = [
    {
      id: "navigation",
      icon: <Route className="h-12 w-12 text-primary" />,
      title: "Smart Navigation",
      description: "AI-powered route optimization with real-time crowd density analysis",
      details: [
        "Real-time crowd density heatmaps",
        "Optimal route suggestions based on current conditions",
        "Emergency evacuation routes",
        "Multi-path options for different demographics",
        "Landmark-based navigation for elderly pilgrims"
      ]
    },
    {
      id: "safety",
      icon: <Shield className="h-12 w-12 text-destructive" />,
      title: "Advanced Safety System",
      description: "24/7 monitoring and emergency response infrastructure",
      details: [
        "Real-time safety alerts and notifications",
        "Emergency contact system with one-touch calling",
        "Lost & found digital registry",
        "Medical emergency response coordination",
        "Police and security integration"
      ]
    },
    {
      id: "sanitation",
      icon: <Leaf className="h-12 w-12 text-green-600" />,
      title: "Community Cleanliness",
      description: "Crowd-sourced sanitation monitoring and feedback system",
      details: [
        "Real-time cleanliness heatmaps",
        "Community-driven feedback system",
        "Toilet and facility locator",
        "Sanitation staff task management",
        "Water quality monitoring"
      ]
    },
    {
      id: "digital",
      icon: <Microchip className="h-12 w-12 text-accent" />,
      title: "Digital Ecosystem",
      description: "Integrated digital services for seamless pilgrim experience",
      details: [
        "QR-based digital identity system",
        "Multilingual AI chatbot support",
        "Spiritual event scheduling and reminders",
        "Government service integration",
        "Offline SMS-based assistance"
      ]
    },
    {
      id: "qr",
      icon: <QrCode className="h-12 w-12 text-primary" />,
      title: "Digital Identity",
      description: "QR-based identification for enhanced safety and services",
      details: [
        "Unique QR ID for each pilgrim",
        "Emergency contact information storage",
        "Medical information and allergies",
        "Preferred language settings",
        "Quick identification in emergencies"
      ]
    },
    {
      id: "communication",
      icon: <MessageSquare className="h-12 w-12 text-accent" />,
      title: "Multi-Channel Communication",
      description: "Comprehensive communication system for all pilgrims",
      details: [
        "AI-powered multilingual chatbot (KumbhBot)",
        "Voice-based query support",
        "SMS-based offline assistance",
        "Emergency broadcast system",
        "Real-time updates and notifications"
      ]
    }
  ];

  const stats = [
    { icon: <Users className="h-8 w-8 text-primary" />, value: "2.5M+", label: "Pilgrims Served" },
    { icon: <Globe className="h-8 w-8 text-accent" />, value: "12", label: "Languages Supported" },
    { icon: <AlertTriangle className="h-8 w-8 text-destructive" />, value: "99.9%", label: "Safety Response Rate" },
    { icon: <Zap className="h-8 w-8 text-green-600" />, value: "24/7", label: "Real-time Monitoring" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            SmartKumbh Features
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
            Revolutionary AI-powered solutions for the world's largest spiritual gathering
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <div className="flex items-center justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="bg-muted p-4 rounded-full group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{feature.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{detail}</span>
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
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience SmartKumbh?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions of pilgrims who trust SmartKumbh for a safe, spiritual, and seamless journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-secondary" data-testid="get-started-button">
                <Navigation className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="outline" data-testid="explore-map-button">
                <MapPin className="mr-2 h-5 w-5" />
                Explore Interactive Map
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}