import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeGenerator({ value, size = 200, className = "" }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#FF6B35', // Primary orange color
          light: '#FFFFFF'
        }
      }, (error: any) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [value, size]);

  return (
    <div className={`flex items-center justify-center ${className}`} data-testid="qr-code-container">
      <canvas ref={canvasRef} className="rounded-lg" />
    </div>
  );
}
