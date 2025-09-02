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
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  emergencyContact: z.string().optional(),
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
                  Demo Admin: admin@smartkumbh.com / password: admin123
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

                <div className="space-y-2">
                  <Label htmlFor="register-phone">Phone Number</Label>
                  <Input
                    id="register-phone"
                    placeholder="Enter your phone number"
                    {...registerForm.register("phone")}
                    data-testid="register-phone-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-emergency">Emergency Contact</Label>
                  <Input
                    id="register-emergency"
                    placeholder="Emergency contact number"
                    {...registerForm.register("emergencyContact")}
                    data-testid="register-emergency-input"
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

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-secondary"
                  disabled={isLoading}
                  data-testid="register-submit-button"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
