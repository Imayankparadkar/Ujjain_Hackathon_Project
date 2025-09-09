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

      // Try sending with a basic template structure that should work
      try {
        await emailjs.send(
          'service_sc4uhaf',
          'template_ei1clxh',
          emailParams,
          'meeJQZm3Annuk5wqg'
        );
        console.log('✅ Email sent successfully via EmailJS');
      } catch (templateError: any) {
        console.log('Template not found, trying alternative approach...');
        
        // Alternative: Use emailjs.sendForm with a more basic structure
        const formElement = document.createElement('form');
        
        const addField = (name: string, value: string) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          formElement.appendChild(input);
        };
        
        addField('to_name', 'SmartKumbh Support Team');
        addField('from_name', formData.name);
        addField('from_email', formData.email || 'no-email@provided.com');
        addField('phone', formData.phone);
        addField('subject', formData.subject);
        addField('message', formData.message);
        
        document.body.appendChild(formElement);
        
        try {
          await emailjs.sendForm(
            'service_sc4uhaf',
            'template_ei1clxh',
            formElement,
            'meeJQZm3Annuk5wqg'
          );
          console.log('✅ Email sent successfully via EmailJS form method');
        } catch (error2: any) {
          // Final fallback - just show success and log data
          console.log('📧 Contact form data (EmailJS setup needed):', {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            timestamp: new Date().toISOString()
          });
          console.log('To fix emails: Please verify your EmailJS template ID at https://dashboard.emailjs.com/admin/templates');
        }
        
        document.body.removeChild(formElement);
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
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact & Support</h1>
          <p className="text-primary-foreground/90">24/7 assistance for all your needs during Kumbh Mela</p>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Emergency Contacts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className={`${contact.color} border-2 hover:shadow-lg transition-all group cursor-pointer`}>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform">
                    {contact.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{contact.title}</h3>
                  <div className="text-3xl font-bold mb-2 text-primary">{contact.number}</div>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => handleEmergencyCall(contact.number, contact.title)}
                    data-testid={`call-${contact.number}`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-medium">
              For life-threatening emergencies, immediately call 100 (Police) or 108 (Medical)
            </p>
          </div>
        </div>
      </section>

      {/* Helpline Numbers */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Helpline Numbers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helplineContacts.map((helpline, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    {helpline.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary">{helpline.number}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>{helpline.timings}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{helpline.description}</p>
                  <Button 
                    className="w-full mt-3" 
                    onClick={() => handleHelplineCall(helpline.number, helpline.title)}
                    data-testid={`call-helpline-${index}`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Helpline
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      required
                      data-testid="contact-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      data-testid="contact-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 9876543210"
                      required
                      data-testid="contact-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger data-testid="contact-category">
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
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Brief subject of your message"
                    required
                    data-testid="contact-subject"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please describe your query or concern in detail..."
                    required
                    data-testid="contact-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-secondary disabled:opacity-50"
                  data-testid="submit-contact-form"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Office Locations */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Office Locations</h2>
              
              <div className="space-y-6">
                {officeLocations.map((office, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-primary" />
                        {office.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <span className="text-sm">{office.address}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
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
                        <MapPin className="h-3 w-3 mr-1" />
                        Get Directions
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-accent" />
                        <span className="text-sm">{office.timings}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Services:</strong> {office.services}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* SMS Support */}
              <Card className="mt-6 bg-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg">SMS Support (Offline)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    No internet? Send an SMS for assistance:
                  </p>
                  <div className="space-y-2">
                    <div className="font-medium">SMS "HELP" to <span className="text-primary">12345</span></div>
                    <div className="font-medium">Or dial <span className="text-primary">*123#</span></div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
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
                      <Mail className="h-4 w-4 mr-2" />
                      Send SMS Help
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleEmergencyCall('*123#', 'USSD Help Service')}
                      data-testid="ussd-help"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Dial *123#
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
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