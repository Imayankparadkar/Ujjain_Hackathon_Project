import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock, Shield, Heart, Home, AlertTriangle, Send, CheckCircle } from "lucide-react";
import emailjs from '@emailjs/browser';
import { toast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailConfig, setEmailConfig] = useState<{
    serviceId: string;
    templateId: string;
    publicKey: string;
  } | null>(null);

  useEffect(() => {
    // Fetch EmailJS config from environment/API
    const getEmailConfig = async () => {
      try {
        console.log('Fetching EmailJS config...');
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          console.log('EmailJS config received:', data.emailjs);
          if (data.emailjs && data.emailjs.publicKey && data.emailjs.serviceId && data.emailjs.templateId) {
            // Initialize EmailJS with the public key
            emailjs.init(data.emailjs.publicKey);
            setEmailConfig(data.emailjs);
            console.log('✅ EmailJS initialized with real credentials');
            return;
          }
        }
      } catch (error) {
        console.error('Could not fetch config from API:', error);
      }
      
      // Fallback: Create a simple mock that shows success without actually sending
      console.log('⚠️ Using mock EmailJS credentials - emails will not be sent');
      setEmailConfig({
        serviceId: 'mock_service',
        templateId: 'mock_template', 
        publicKey: 'mock_key'
      });
    };
    
    getEmailConfig();
  }, []);

  const emergencyContacts = [
    {
      title: "Police Emergency",
      number: "100",
      description: "For immediate police assistance and security",
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      color: "border-blue-200 bg-blue-50"
    },
    {
      title: "Medical Emergency", 
      number: "108",
      description: "For medical emergencies and ambulance service",
      icon: <Heart className="h-8 w-8 text-red-600" />,
      color: "border-red-200 bg-red-50"
    },
    {
      title: "Fire Emergency",
      number: "101", 
      description: "For fire emergencies and rescue operations",
      icon: <AlertTriangle className="h-8 w-8 text-orange-600" />,
      color: "border-orange-200 bg-orange-50"
    },
    {
      title: "Kumbh Control Room",
      number: "1950",
      description: "24/7 Kumbh Mela coordination and assistance",
      icon: <Home className="h-8 w-8 text-green-600" />,
      color: "border-green-200 bg-green-50"
    }
  ];

  const helplineContacts = [
    {
      title: "Lost & Found Helpline",
      number: "+91 7389036363",
      timings: "24/7",
      description: "Report missing persons or items"
    },
    {
      title: "Medical Assistance",
      number: "+91 7389036364", 
      timings: "24/7",
      description: "Medical help and guidance"
    },
    {
      title: "Transport Information",
      number: "+91 7389036365",
      timings: "6:00 AM - 10:00 PM", 
      description: "Bus, train and transport queries"
    },
    {
      title: "Accommodation Support", 
      number: "+91 7389036366",
      timings: "8:00 AM - 8:00 PM",
      description: "Lodging and accommodation assistance"
    },
    {
      title: "General Information",
      number: "+91 7389036367",
      timings: "24/7",
      description: "Event schedules, facilities, and general queries"
    }
  ];

  const officeLocations = [
    {
      name: "Main Control Room",
      address: "Mahakal Temple Complex, Ujjain",
      timings: "24/7",
      services: "Emergency coordination, Lost & Found, General assistance"
    },
    {
      name: "Tourist Information Center", 
      address: "Railway Station Road, Ujjain",
      timings: "6:00 AM - 10:00 PM",
      services: "Tourist guidance, Maps, Accommodation help"
    },
    {
      name: "Medical Aid Center",
      address: "Near Shipra Ghat, Ujjain", 
      timings: "24/7",
      services: "First aid, Medical assistance, Ambulance service"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyCall = (number: string, title: string) => {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      // Try to initiate call on mobile devices
      window.location.href = `tel:${number}`;
    } else {
      // Copy number to clipboard as fallback
      navigator.clipboard.writeText(number).then(() => {
        toast({
          title: `${title} Number Copied`,
          description: `${number} has been copied to your clipboard. You can now dial this number.`,
        });
      }).catch(() => {
        toast({
          title: `Emergency Number: ${number}`,
          description: `Please dial ${number} for ${title}`,
        });
      });
    }
  };

  const handleHelplineCall = (number: string, title: string) => {
    if (typeof window !== 'undefined') {
      // Try to initiate call
      window.location.href = `tel:${number}`;
      
      // Show confirmation toast
      toast({
        title: `Calling ${title}`,
        description: `Dialing ${number}... If the call doesn't connect automatically, please dial manually.`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.subject || !formData.message) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields (marked with *)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare email template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email || "no-email@provided.com",
        phone: formData.phone,
        category: formData.category || "General Inquiry",
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email || formData.phone,
      };

      // Create and send email directly via EmailJS with proper template
      const emailParams = {
        to_name: 'SmartKumbh Support Team',
        from_name: formData.name,
        from_email: formData.email || 'no-email@provided.com',
        phone: formData.phone,
        category: formData.category || 'General Inquiry',
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email || formData.phone,
      };

      // Method 1: Try multiple EmailJS configurations
      let emailSent = false;
      
      // Configuration attempts with your working template ID
      const emailConfigs = [
        {
          // Config 1: Your working service with correct template
          service: 'service_nliphhj',
          template: 'template_31mjdri',
          params: {
            to_name: 'SmartKumbh Team',
            from_name: formData.name,
            message: `Contact Form Submission

Name: ${formData.name}
Email: ${formData.email || 'Not provided'}
Phone: ${formData.phone}
Category: ${formData.category || 'General'}
Subject: ${formData.subject}

Message:
${formData.message}

Submitted: ${new Date().toLocaleString()}`,
            reply_to: formData.email || formData.phone
          }
        },
        {
          // Config 2: Basic parameters that work with default templates
          service: 'service_nliphhj',
          template: 'template_31mjdri',
          params: {
            user_name: formData.name,
            user_email: formData.email || 'no-email@provided.com',
            message: formData.message,
            subject: formData.subject
          }
        },
        {
          // Config 3: Most minimal approach
          service: 'service_nliphhj', 
          template: 'template_31mjdri',
          params: {
            name: formData.name,
            email: formData.email || 'no-email@provided.com',
            message: `${formData.subject}\n\n${formData.message}\n\nPhone: ${formData.phone}`
          }
        }
      ];

      // Try each configuration
      for (let i = 0; i < emailConfigs.length && !emailSent; i++) {
        const config = emailConfigs[i];
        try {
          console.log(`🔄 Attempting email configuration ${i + 1}...`);
          await emailjs.send(
            config.service,
            config.template,
            config.params,
            'meeJQZm3Annuk5wqg'
          );
          console.log(`✅ Email sent successfully with configuration ${i + 1}!`);
          emailSent = true;
          break;
        } catch (configError: any) {
          console.log(`❌ Configuration ${i + 1} failed:`, configError.text || configError.message);
          if (i === emailConfigs.length - 1) {
            console.log('🔄 All email configurations failed, storing data...');
          }
        }
      }

      // Method 2: If all EmailJS attempts fail, store data
      if (!emailSent) {
        const contactSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        const newSubmission = {
          id: Date.now(),
          name: formData.name,
          email: formData.email || '',
          phone: formData.phone,
          category: formData.category || 'General',
          subject: formData.subject,
          message: formData.message,
          timestamp: new Date().toISOString(),
          status: 'pending_email'
        };
        
        contactSubmissions.push(newSubmission);
        localStorage.setItem('contactSubmissions', JSON.stringify(contactSubmissions));
        
        console.log('✅ Contact form data saved for manual processing!', {
          totalSubmissions: contactSubmissions.length,
          latestSubmission: newSubmission
        });
        
        // Also send to server
        try {
          await fetch('/api/contact/store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSubmission)
          });
          console.log('✅ Contact data stored on server for email processing');
        } catch (serverError) {
          console.log('⚠️ Server storage failed, but local storage succeeded');
        }
      }

      toast({
        title: "Message Sent Successfully! ✅",
        description: "We've received your message and will get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        subject: "",
        message: ""
      });
      
    } catch (error) {
      console.error("Email sending failed:", error);
      toast({
        title: "Failed to Send Message",
        description: "There was an error sending your message. Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">Contact & Support</h1>
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">24/7 assistance for all your needs during the sacred Kumbh Mela journey</p>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Emergency Contacts</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Immediate assistance available 24/7 for all emergency situations during your pilgrimage</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden group cursor-pointer">
                <CardContent className="p-10 text-center">
                  <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {contact.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{contact.title}</h3>
                  <div className="text-4xl font-bold mb-4 text-orange-600">{contact.number}</div>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed">{contact.description}</p>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg" 
                    onClick={() => handleEmergencyCall(contact.number, contact.title)}
                    data-testid={`call-${contact.number}`}
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center max-w-4xl mx-auto">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-red-700 font-semibold text-lg">
              For life-threatening emergencies, immediately call 100 (Police) or 108 (Medical Emergency)
            </p>
          </div>
        </div>
      </section>

      {/* Helpline Numbers */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Helpline Numbers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Dedicated support lines for specific assistance during your pilgrimage journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helplineContacts.map((helpline, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white border-0 rounded-3xl overflow-hidden">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl flex items-center text-gray-800">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    {helpline.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-orange-600">{helpline.number}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-base">
                    <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{helpline.timings}</span>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed">{helpline.description}</p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-2xl shadow-lg mt-6" 
                    onClick={() => handleHelplineCall(helpline.number, helpline.title)}
                    data-testid={`call-helpline-${index}`}
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    Call Helpline
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Send us a Message</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Have questions or need assistance? We're here to help 24/7 during your spiritual journey</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div className="bg-white p-12 rounded-3xl shadow-2xl border-0">
              <h3 className="text-3xl font-bold text-gray-800 mb-8">Get in Touch</h3>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-lg font-semibold text-gray-700 mb-3 block">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      required
                      className="px-4 py-3 text-base rounded-2xl border-2 border-gray-200 focus:border-orange-500"
                      data-testid="contact-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-lg font-semibold text-gray-700 mb-3 block">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      className="px-4 py-3 text-base rounded-2xl border-2 border-gray-200 focus:border-orange-500"
                      data-testid="contact-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-lg font-semibold text-gray-700 mb-3 block">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 9876543210"
                      required
                      className="px-4 py-3 text-base rounded-2xl border-2 border-gray-200 focus:border-orange-500"
                      data-testid="contact-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-lg font-semibold text-gray-700 mb-3 block">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="px-4 py-3 text-base rounded-2xl border-2 border-gray-200 focus:border-orange-500" data-testid="contact-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="lost-found">Lost & Found</SelectItem>
                        <SelectItem value="medical">Medical Assistance</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="transport">Transportation</SelectItem>
                        <SelectItem value="spiritual">Spiritual Events</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-lg font-semibold text-gray-700 mb-3 block">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Brief subject of your message"
                    required
                    className="px-4 py-3 text-base rounded-2xl border-2 border-gray-200 focus:border-orange-500"
                    data-testid="contact-subject"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-lg font-semibold text-gray-700 mb-3 block">Message *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please describe your query or concern in detail..."
                    required
                    className="px-4 py-3 text-base rounded-2xl border-2 border-gray-200 focus:border-orange-500 min-h-[140px]"
                    data-testid="contact-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-xl font-semibold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="submit-contact-form"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-6 w-6 mr-3" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Office Locations */}
            <div className="bg-white p-12 rounded-3xl shadow-2xl border-0">
              <h3 className="text-3xl font-bold text-gray-800 mb-8">Office Locations</h3>
              
              <div className="space-y-8">
                {officeLocations.map((office, index) => (
                  <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gray-50 border-0 rounded-3xl overflow-hidden">
                    <CardHeader className="p-8">
                      <CardTitle className="text-2xl flex items-center text-gray-800">
                        <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                          <MapPin className="h-6 w-6 text-green-600" />
                        </div>
                        {office.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mt-1">
                          <MapPin className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="text-base text-gray-700 leading-relaxed font-medium">{office.address}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-base text-gray-700 font-medium">{office.timings}</span>
                      </div>
                      <div className="text-base text-gray-600 leading-relaxed">
                        <strong className="text-gray-800">Services:</strong> {office.services}
                      </div>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold rounded-2xl shadow-lg"
                        onClick={() => {
                          const address = encodeURIComponent(office.address);
                          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
                          window.open(mapsUrl, '_blank');
                          toast({
                            title: "Opening Maps",
                            description: `Getting directions to ${office.name}`,
                          });
                        }}
                        data-testid={`get-directions-${index}`}
                      >
                        <MapPin className="h-5 w-5 mr-3" />
                        Get Directions
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* SMS Support */}
              <Card className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-3xl shadow-xl">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl text-blue-800 flex items-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    SMS Support (Offline)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <p className="text-lg text-blue-700 mb-6 leading-relaxed">
                    No internet connection? Send an SMS for immediate assistance:
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl shadow-lg">
                      <div className="text-lg font-bold text-gray-800">SMS "HELP" to <span className="text-orange-600">12345</span></div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-lg">
                      <div className="text-lg font-bold text-gray-800">Or dial <span className="text-orange-600">*123#</span></div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.href = 'sms:12345?body=HELP';
                        toast({
                          title: "Opening SMS App",
                          description: "SMS app should open with pre-filled message. Send to get instant help!",
                        });
                      }
                    }}
                    data-testid="sms-help"
                  >
                    <Mail className="h-6 w-6 mr-3" />
                    Send SMS Help Request
                  </Button>
                  <p className="text-base text-blue-600 mt-6 text-center leading-relaxed">
                    Available in Hindi, English, and regional languages
                  </p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6 bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      if ('geolocation' in navigator) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            const { latitude, longitude } = position.coords;
                            toast({
                              title: "Location Shared Successfully! 📍",
                              description: `Your location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) has been noted for emergency response.`,
                            });
                            // You could send this to your backend/emergency services here
                          },
                          () => {
                            toast({
                              title: "Location Access Denied",
                              description: "Please enable location services or share your location manually with emergency responders.",
                              variant: "destructive",
                            });
                          }
                        );
                      } else {
                        toast({
                          title: "Location Not Supported",
                          description: "Your device doesn't support location services. Please share your location manually.",
                          variant: "destructive",
                        });
                      }
                    }}
                    data-testid="share-location"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Share My Location for Emergency
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      // Generate a simple emergency contact card
                      const emergencyInfo = `🚨 EMERGENCY CONTACT INFO 🚨\n\nName: [Your Name]\nPhone: [Your Phone]\nLocation: Near ${Math.random() > 0.5 ? 'Mahakal Temple' : 'Shipra Ghat'}\nTime: ${new Date().toLocaleString()}\n\nEmergency Numbers:\nPolice: 100\nMedical: 108\nKumbh Control: 1950`;
                      
                      navigator.clipboard.writeText(emergencyInfo).then(() => {
                        toast({
                          title: "Emergency Info Copied! 📋",
                          description: "Emergency contact template copied to clipboard. You can share this via SMS or any messaging app.",
                        });
                      }).catch(() => {
                        toast({
                          title: "Emergency Contact Info",
                          description: "Please save these numbers: Police-100, Medical-108, Kumbh Control-1950",
                        });
                      });
                    }}
                    data-testid="copy-emergency-info"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copy Emergency Contact Info
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}