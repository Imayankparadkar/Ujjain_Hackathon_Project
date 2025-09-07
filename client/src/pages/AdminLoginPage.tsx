import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;
type OTPForm = z.infer<typeof otpSchema>;

// Demo admin credentials
const ADMIN_CREDENTIALS = {
  email: "admin@smartkumbh.com",
  password: "admin123"
};

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginForm = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const generateOTP = () => {
    // Generate a random 6-digit OTP that changes each login
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    return otp;
  };

  const onLogin = async (data: AdminLoginForm) => {
    setIsLoading(true);
    try {
      // Verify admin credentials
      if (data.email === ADMIN_CREDENTIALS.email && data.password === ADMIN_CREDENTIALS.password) {
        // Generate and show OTP
        const otp = generateOTP();
        setShowOTP(true);
        
        toast({
          title: "OTP Generated",
          description: `Your OTP is: ${otp}`,
          duration: 10000,
        });
      } else {
        throw new Error("Invalid admin credentials");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid admin credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOTPVerify = async (data: OTPForm) => {
    setIsLoading(true);
    try {
      if (data.otp === generatedOTP) {
        // Store admin session
        localStorage.setItem('adminSession', JSON.stringify({
          email: ADMIN_CREDENTIALS.email,
          role: 'admin',
          loginTime: Date.now(),
          sessionId: Math.random().toString(36).substring(7)
        }));

        setLocation("/admin");
        
        toast({
          title: "Admin Login Successful",
          description: "Welcome to SmartKumbh Admin Panel!",
        });
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error: any) {
      toast({
        title: "OTP Verification Failed",
        description: error.message || "Please check your OTP and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetLogin = () => {
    setShowOTP(false);
    setGeneratedOTP("");
    loginForm.reset();
    otpForm.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="text-4xl mb-4">🔐</div>
          <CardTitle className="text-2xl text-orange-600">Admin Portal</CardTitle>
          <p className="text-muted-foreground">SmartKumbh Administrative Access</p>
          <Badge variant="secondary" className="mx-auto mt-2">🔒 Secure 2FA Login</Badge>
        </CardHeader>

        <CardContent>
          {!showOTP ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter admin email"
                  className="border-orange-200 focus:border-orange-400"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin password"
                  className="border-orange-200 focus:border-orange-400"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Continue to 2FA"}
              </Button>

              <div className="text-center text-sm text-muted-foreground bg-orange-50 p-3 rounded">
                <strong>Demo Credentials:</strong><br />
                Email: admin@smartkumbh.com<br />
                Password: admin123
              </div>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(onOTPVerify)} className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-green-600 text-2xl mb-2">✅</div>
                <h3 className="font-semibold">2FA Verification Required</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit OTP shown in the notification
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="border-green-200 focus:border-green-400 text-center text-lg tracking-widest"
                  maxLength={6}
                  {...otpForm.register("otp")}
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-sm text-destructive">{otpForm.formState.errors.otp.message}</p>
                )}
              </div>

              {generatedOTP && (
                <div className="bg-green-50 border border-green-200 p-3 rounded text-center">
                  <p className="text-sm text-green-700">Demo OTP: <strong className="text-lg">{generatedOTP}</strong></p>
                  <p className="text-xs text-green-600 mt-1">This OTP changes every login session</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetLogin}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <a 
              href="/"
              className="text-sm text-orange-600 hover:underline"
            >
              ← Back to Public Site
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}