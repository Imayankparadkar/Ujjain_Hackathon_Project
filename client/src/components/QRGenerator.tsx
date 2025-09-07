import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateQRCode, UserProfile } from "@/lib/qrcode";
import { Download, QrCode, Share2 } from "lucide-react";

interface QRGeneratorProps {
  userProfile: UserProfile;
}

export default function QRGenerator({ userProfile }: QRGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQR = async () => {
    setIsGenerating(true);
    try {
      const qrUrl = await generateQRCode(userProfile);
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    }
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `SmartKumbh-QR-${userProfile.qrId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (navigator.share && qrCodeUrl) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `SmartKumbh-QR-${userProfile.qrId}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'My SmartKumbh QR Code',
          text: `My SmartKumbh ID: ${userProfile.qrId}`,
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copy to clipboard
        handleDownload();
      }
    } else {
      handleDownload();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <QrCode className="h-12 w-12 text-orange-600 mx-auto mb-2" />
        <CardTitle className="text-orange-600">Your SmartKumbh QR ID</CardTitle>
        <p className="text-sm text-gray-600">Unique ID: {userProfile.qrId}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!qrCodeUrl ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Generate your unique QR code for easy identification during the Kumbh Mela.
            </p>
            <Button 
              onClick={handleGenerateQR} 
              disabled={isGenerating}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isGenerating ? "Generating..." : "Generate My QR Code"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <img 
                src={qrCodeUrl} 
                alt="SmartKumbh QR Code" 
                className="mx-auto border-2 border-gray-200 rounded-lg p-2 bg-white"
              />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="font-semibold text-blue-800 mb-1">QR Code Contains:</p>
              <ul className="text-blue-700 space-y-1">
                <li>• Your name and contact information</li>
                <li>• Emergency contact details</li>
                <li>• Medical information (if provided)</li>
                <li>• Unique SmartKumbh ID</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleDownload}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                onClick={handleShare}
                variant="outline"
                className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              Keep this QR code accessible during your pilgrimage for quick identification in case of emergency.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}