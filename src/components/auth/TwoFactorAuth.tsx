import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Smartphone, Mail, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TwoFactorAuthProps {
  method: "sms" | "email";
  phoneOrEmail: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => void;
  onCancel: () => void;
}

export function TwoFactorAuth({ method, phoneOrEmail, onVerify, onResend, onCancel }: TwoFactorAuthProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when complete
    if (newCode.every(c => c) && value) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (fullCode: string) => {
    setLoading(true);
    try {
      await onVerify(fullCode);
    } catch (err) {
      setError("Invalid verification code. Please try again.");
      setCode(["", "", "", "", "", ""]);
      document.getElementById("code-0")?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    onResend();
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  const maskedContact = method === "sms" 
    ? `+254 7XX XXX ${phoneOrEmail.slice(-3)}`
    : `${phoneOrEmail.slice(0, 3)}***@${phoneOrEmail.split("@")[1]}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="w-16 h-16 mx-auto rounded-2xl gradient-teal flex items-center justify-center"
        >
          <Shield className="w-8 h-8 text-secondary-foreground" />
        </motion.div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Two-Factor Authentication
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to
        </p>
        <div className="flex items-center justify-center gap-2 text-foreground">
          {method === "sms" ? (
            <Smartphone className="w-4 h-4 text-secondary" />
          ) : (
            <Mail className="w-4 h-4 text-secondary" />
          )}
          <span className="font-mono">{maskedContact}</span>
        </div>
      </div>

      {/* Code Input */}
      <div className="flex justify-center gap-2">
        {code.map((digit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Input
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={cn(
                "w-12 h-14 text-center text-xl font-mono bg-card/50 border-border/50",
                "focus:border-secondary focus:ring-secondary",
                error && "border-destructive"
              )}
              disabled={loading}
            />
          </motion.div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive text-center"
        >
          {error}
        </motion.p>
      )}

      {/* Resend */}
      <div className="text-center">
        <Button
          variant="link"
          onClick={handleResend}
          disabled={resent}
          className="text-secondary"
        >
          {resent ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Code sent!
            </span>
          ) : (
            "Resend code"
          )}
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          variant="gold"
          onClick={() => handleVerify(code.join(""))}
          disabled={loading || code.some(c => !c)}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </div>

      {/* Security Note */}
      <p className="text-xs text-center text-muted-foreground">
        This code expires in 10 minutes. Never share your verification codes with anyone.
      </p>
    </motion.div>
  );
}
