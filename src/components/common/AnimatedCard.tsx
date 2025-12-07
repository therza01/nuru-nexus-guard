import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverScale?: boolean;
  hoverGlow?: "gold" | "teal" | "danger" | "none";
  onClick?: () => void;
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  hoverScale = true,
  hoverGlow = "none",
  onClick,
}: AnimatedCardProps) {
  const glowClasses = {
    gold: "hover:glow-gold",
    teal: "hover:glow-teal",
    danger: "hover:glow-danger",
    none: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay, duration: 0.4 }
      }}
      whileHover={
        hoverScale
          ? {
              y: -5,
              scale: 1.02,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        "glass-card rounded-xl transition-shadow duration-300",
        glowClasses[hoverGlow],
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Animated list item component
interface AnimatedListItemProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function AnimatedListItem({ children, index, className }: AnimatedListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { delay: index * 0.05, duration: 0.3 },
      }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ x: 5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated number counter
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  className,
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

// Pulsing indicator for live data
interface PulseIndicatorProps {
  color?: "success" | "warning" | "destructive" | "primary";
  size?: "sm" | "md" | "lg";
}

export function PulseIndicator({ color = "success", size = "md" }: PulseIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colorClasses = {
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    primary: "bg-primary",
  };

  return (
    <span className="relative flex items-center justify-center">
      <motion.span
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "absolute rounded-full",
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      <span
        className={cn(
          "relative rounded-full",
          sizeClasses[size],
          colorClasses[color]
        )}
      />
    </span>
  );
}
