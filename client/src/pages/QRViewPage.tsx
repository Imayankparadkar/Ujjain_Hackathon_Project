import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { 
  User, 
  Phone, 
  Mail, 
  Shield, 
  Clock,
  QrCode,
  Share2
} from "lucide-react";

interface QRUserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  generated: string;
  platform: string;
}

export default function QRViewPage() {
  const [match, params] = useRoute("/qr/:qrId");
  const [userProfile, setUserProfile] = useState<QRUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (match && params?.qrId) {
      fetchUserProfile(params.qrId);
    }
  }, [match, params?.qrId]);

  const fetchUserProfile = async (qrId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/qr/${qrId}`);
      
      if (!response.ok) {
        throw new Error('User profile not found');
      }
      
      const data = await response.json();
      setUserProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEmergencyCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleShare = async () => {
    if (navigator.share && userProfile) {
      try {
        await navigator.share({
          title: `${userProfile.name} - SmartKumbh Profile`,
          text: `Contact: ${userProfile.phone} | Emergency: ${userProfile.emergencyContact}`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copy URL
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <QrCode className="h-12 w-12 text-orange-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Loading Profile...</h3>
              <p className="text-gray-600">Retrieving pilgrim information</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error || !userProfile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
          <Card className="w-full max-w-md mx-4 border-red-200">
            <CardContent className="p-8 text-center">
              <QrCode className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Profile Not Found</h3>
              <p className="text-red-600 mb-4">{error || 'Invalid QR code or expired link'}</p>
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          
          {/* Header Card */}
          <Card className="mb-6 border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-yellow-600 p-8 text-white text-center">
              <QrCode className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">SmartKumbh Pilgrim Profile</h1>
              <p className="opacity-90">Verified Digital Identity</p>
            </div>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-orange-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2" data-testid="pilgrim-name">{userProfile.name}</h2>
                <Badge variant="secondary" className="bg-green-100 text-green-700 font-semibold">
                  Verified Pilgrim
                </Badge>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 justify-center mb-6">
                <Button
                  onClick={() => handleEmergencyCall(userProfile.emergencyContact)}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  data-testid="emergency-call-button"
                >
                  <Shield className="h-4 w-4" />
                  Emergency Call
                </Button>
                <Button
                  onClick={() => handleEmergencyCall(userProfile.phone)}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                  data-testid="contact-call-button"
                >
                  <Phone className="h-4 w-4" />
                  Contact
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  data-testid="share-profile-button"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-6 border-0 shadow-xl rounded-3xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                Contact Information
              </h3>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between" data-testid="phone-info">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Phone</span>
                </div>
                <span className="text-blue-600 font-semibold">{userProfile.phone}</span>
              </div>
              <div className="flex items-center justify-between" data-testid="email-info">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email</span>
                </div>
                <span className="text-gray-700">{userProfile.email}</span>
              </div>
              <div className="flex items-center justify-between" data-testid="emergency-info">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-700">Emergency Contact</span>
                </div>
                <span className="text-red-600 font-semibold">{userProfile.emergencyContact}</span>
              </div>
            </CardContent>
          </Card>


          {/* QR Code Info */}
          <Card className="border-0 shadow-xl rounded-3xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Generated on {formatDate(userProfile.generated)}</span>
                </div>
                <p className="text-xs">
                  Powered by <span className="font-semibold text-orange-600">{userProfile.platform}</span> • Digital India Initiative
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Note */}
          <div className="mt-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <Shield className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <h4 className="font-semibold text-red-800 mb-2">Emergency Use Only</h4>
              <p className="text-sm text-red-600">
                This information is for emergency assistance during Kumbh Mela. 
                Contact emergency services at <strong>108</strong> for medical emergencies.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  );
}