import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUser, loginUser } from "@/lib/firebase";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  emergencyContact: z.string().min(10, "Emergency contact must be at least 10 digits"),
  age: z.number().min(1).max(120).optional(),
  bloodGroup: z.string().optional(),
  guardianContact: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      emergencyContact: "",
      age: undefined,
      bloodGroup: "",
      guardianContact: "",
    },
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const userCredential = await loginUser(data.email, data.password);
      
      // Check if user is admin (for demo purposes, admin@smartkumbh.com)
      if (data.email === "admin@smartkumbh.com") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome back to SmartKumbh!",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await createUser(data.email, data.password, {
        name: data.name,
        phone: data.phone,
        emergencyContact: data.emergencyContact,
        role: "user",
        isVerified: false,
        isBlocked: false,
        savedRoutes: [],
        language: "en",
      });

      setLocation("/dashboard");
      
      toast({
        title: "Registration Successful",
        description: "Welcome to SmartKumbh! Your account has been created.",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl text-primary mb-4">🕉️</div>
          <CardTitle className="text-2xl">Welcome to SmartKumbh</CardTitle>
          <p className="text-muted-foreground">Sign in to access your personalized dashboard</p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="login-tab">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    {...loginForm.register("email")}
                    data-testid="login-email-input"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    {...loginForm.register("password")}
                    data-testid="login-password-input"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-secondary"
                  disabled={isLoading}
                  data-testid="login-submit-button"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <div>Demo User: user@demo.com / demo123</div>
                  <a href="/admin/login" className="text-orange-600 hover:underline">
                    Admin Login (Separate Portal)
                  </a>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    placeholder="Enter your full name"
                    {...registerForm.register("name")}
                    data-testid="register-name-input"
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    {...registerForm.register("email")}
                    data-testid="register-email-input"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Phone Number *</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="Your phone number"
                      {...registerForm.register("phone")}
                    />
                    {registerForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-age">Age</Label>
                    <Input
                      id="register-age"
                      type="number"
                      placeholder="Your age"
                      {...registerForm.register("age", { valueAsNumber: true })}
                    />
                    {registerForm.formState.errors.age && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.age.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-emergency">Emergency Contact *</Label>
                    <Input
                      id="register-emergency"
                      type="tel"
                      placeholder="Emergency contact number"
                      {...registerForm.register("emergencyContact")}
                    />
                    {registerForm.formState.errors.emergencyContact && (
                      <p className="text-sm text-destructive">{registerForm.formState.errors.emergencyContact.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-blood" className="text-amber-700 font-semibold">Select Blood Group</Label>
                    <select
                      id="register-blood"
                      className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-amber-50"
                      {...registerForm.register("bloodGroup")}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-guardian">Guardian/Family Contact</Label>
                  <Input
                    id="register-guardian"
                    type="tel"
                    placeholder="Guardian or family contact (optional)"
                    {...registerForm.register("guardianContact")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    {...registerForm.register("password")}
                    data-testid="register-password-input"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="text-xs text-gray-600 bg-orange-50 p-3 rounded-lg">
                  <p className="font-semibold mb-1">🆔 QR Code Generation:</p>
                  <p>After registration, you'll receive a unique QR code containing your contact information for emergency identification during the Kumbh Mela.</p>
                </div>

                <div className="text-sm text-blue-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-semibold mb-1">⚠️ Important Note:</p>
                  <p>Please <strong>reload this website</strong> once you click the "Create SmartKumbh Account" button to ensure proper registration completion.</p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create SmartKumbh Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
