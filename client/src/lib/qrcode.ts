import QRCode from 'qrcode';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  qrId: string;
  emergencyContact?: string;
  age?: number;
  bloodGroup?: string;
  medicalConditions?: string[];
  guardianContact?: string;
  homeAddress?: string;
}

export const generateQRCode = async (userProfile: UserProfile): Promise<string> => {
  try {
    // Create URL that points to the user's profile page
    const baseUrl = window.location.origin;
    const qrUrl = `${baseUrl}/qr/${userProfile.qrId}`;

    const qrCodeDataURL = await QRCode.toDataURL(qrUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#FF6B35', // SmartKumbh orange color
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const parseQRData = (qrString: string): UserProfile | null => {
  try {
    const data = JSON.parse(qrString);
    if (data.platform === 'SmartKumbh' && data.id) {
      return {
        uid: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        qrId: data.id,
        emergencyContact: data.emergency,
        age: data.age,
        bloodGroup: data.bloodGroup,
        medicalConditions: data.medical,
        guardianContact: data.guardian,
        homeAddress: data.address
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing QR data:', error);
    return null;
  }
};

export const generateUniqueQRId = (): string => {
  const prefix = 'KMB';
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${year}-${randomPart}-${timestamp}`;
};