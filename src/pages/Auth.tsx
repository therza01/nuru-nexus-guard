import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name is too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthMode = "login" | "signup";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (mode === "login") {
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message === "Invalid login credentials" 
              ? "Invalid email or password. Please try again."
              : error.message,
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Successfully logged in to Nuru Nexus.",
          });
          navigate("/");
        }
      } else {
        const result = signupSchema.safeParse({ email, password, confirmPassword, fullName });
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              variant: "destructive",
              title: "Account Exists",
              description: "This email is already registered. Please login instead.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Signup Failed",
              description: error.message,
            });
          }
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to Nuru Nexus. You are now logged in.",
          });
          navigate("/");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pattern-afro flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-indigo opacity-80" />
        <div className="absolute inset-0 pattern-grid opacity-20" />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center glow-gold">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold text-foreground">
                  Nuru<span className="text-primary">Nexus</span>
                </h1>
                <p className="text-muted-foreground">Fraud Intelligence Platform</p>
              </div>
            </div>

            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Protecting Kenya's Financial Ecosystem
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Real-time fraud detection and intelligence for banks, SACCOs, fintechs, and mobile money operators across Kenya.
            </p>

            <div className="space-y-4">
              {[
                "AI-powered threat detection",
                "Real-time M-Pesa transaction monitoring",
                "Cross-institution fraud network analysis",
                "CBK & FRC compliance reporting",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center glow-gold">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Nuru<span className="text-primary">Nexus</span>
            </h1>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-muted-foreground">
                {mode === "login" 
                  ? "Sign in to access the fraud intelligence dashboard"
                  : "Join the fight against financial fraud in Kenya"
                }
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-muted rounded-lg p-1 mb-6">
              {(["login", "signup"] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setErrors({});
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-card text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 bg-muted/50 border-border/50"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-muted/50 border-border/50"
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-muted/50 border-border/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 bg-muted/50 border-border/50"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {mode === "login" && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  mode === "login" ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>

            {/* MFA Notice */}
            <div className="mt-6 p-4 rounded-xl bg-secondary/10 border border-secondary/30">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-sm font-medium text-foreground">MFA Supported</p>
                  <p className="text-xs text-muted-foreground">
                    Enable multi-factor authentication after login for enhanced security.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By continuing, you agree to Nuru Nexus's{" "}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
