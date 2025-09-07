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
    const qrData = {
      id: userProfile.qrId,
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      emergency: userProfile.emergencyContact,
      age: userProfile.age,
      bloodGroup: userProfile.bloodGroup,
      medical: userProfile.medicalConditions,
      guardian: userProfile.guardianContact,
      address: userProfile.homeAddress,
      generated: new Date().toISOString(),
      platform: 'SmartKumbh'
    };

    const qrString = JSON.stringify(qrData);
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
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