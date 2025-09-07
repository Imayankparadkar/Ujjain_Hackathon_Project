import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseQRData, UserProfile } from "@/lib/qrcode";
import { QrCode, X, User, Phone, AlertTriangle } from "lucide-react";

interface QRScannerProps {
  onScanResult: (profile: UserProfile) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanResult, onClose }: QRScannerProps) {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [scannedProfile, setScannedProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    qrScanner.render(
      (decodedText) => {
        const profile = parseQRData(decodedText);
        if (profile) {
          setScannedProfile(profile);
          onScanResult(profile);
          qrScanner.clear();
        } else {
          setError("Invalid QR code format. Please scan a valid SmartKumbh QR code.");
        }
      },
      (error) => {
        console.log("QR scan error:", error);
      }
    );

    setScanner(qrScanner);

    return () => {
      if (qrScanner) {
        qrScanner.clear().catch(console.error);
      }
    };
  }, [onScanResult]);

  const handleClose = () => {
    if (scanner) {
      scanner.clear().catch(console.error);
    }
    onClose();
  };

  if (scannedProfile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <QrCode className="h-12 w-12 text-green-600 mx-auto mb-2" />
          <CardTitle className="text-green-600">QR Code Scanned Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-semibold">{scannedProfile.name}</div>
                <div className="text-sm text-gray-600">ID: {scannedProfile.qrId}</div>
              </div>
            </div>
            
            {scannedProfile.phone && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-gray-600">{scannedProfile.phone}</div>
                </div>
              </div>
            )}
            
            {scannedProfile.emergencyContact && (
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium">Emergency Contact</div>
                  <div className="text-sm text-gray-600">{scannedProfile.emergencyContact}</div>
                </div>
              </div>
            )}

            {scannedProfile.age && (
              <div className="text-sm text-gray-600">
                <strong>Age:</strong> {scannedProfile.age}
              </div>
            )}
            
            {scannedProfile.bloodGroup && (
              <div className="text-sm text-gray-600">
                <strong>Blood Group:</strong> {scannedProfile.bloodGroup}
              </div>
            )}
          </div>
          
          <Button onClick={handleClose} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center">
          <CardTitle>Scan QR Code</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        <div id="qr-reader" className="mb-4"></div>
        <p className="text-sm text-gray-600 text-center">
          Position the QR code within the frame to scan
        </p>
      </CardContent>
    </Card>
  );
}