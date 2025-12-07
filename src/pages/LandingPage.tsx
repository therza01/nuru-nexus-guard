import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  TrendingUp,
  Network,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  ChevronRight,
  Zap,
  Globe,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: TrendingUp,
    title: "AI Risk Scoring",
    description: "Real-time AI-powered fraud risk assessment for every transaction and entity.",
  },
  {
    icon: Network,
    title: "Network Analysis",
    description: "Visualize hidden connections between fraudsters, devices, and accounts.",
  },
  {
    icon: AlertTriangle,
    title: "Smart Alerts",
    description: "Intelligent alerting with severity prioritization and case management.",
  },
  {
    icon: BarChart3,
    title: "County Analytics",
    description: "Geo-mapped fraud patterns across all 47 Kenyan counties.",
  },
];

const stats = [
  { value: "99.7%", label: "Detection Rate" },
  { value: "< 50ms", label: "Response Time" },
  { value: "47", label: "Counties Covered" },
  { value: "24/7", label: "Monitoring" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pattern-afro">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"
          />
        </div>

        {/* Navigation */}
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center glow-gold"
              >
                <Shield className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="font-display font-bold text-xl text-foreground">
                Nuru<span className="text-primary">Nexus</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="gold" className="group">
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                AI-Powered Fraud Detection
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              Protecting Kenya's{" "}
              <span className="text-gradient-gold">Financial</span>
              <br />
              Ecosystem
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Real-time fraud intelligence for banks, SACCOs, fintechs, and mobile money operators. 
              Detect, investigate, and prevent financial fraud before it happens.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/auth">
                <Button size="lg" variant="gold" className="text-lg px-8 group">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 border-border/50">
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6 rounded-2xl text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Built for <span className="text-secondary">Kenyan</span> Finance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Purpose-built for M-Pesa, bank transfers, SACCO transactions, and digital lending platforms.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-6 rounded-2xl group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center mb-4 group-hover:glow-teal transition-shadow">
                  <feature.icon className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                Trusted by Kenya's Leading Financial Institutions
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                CBK-compliant, FRC-ready. Our platform meets all regulatory requirements 
                while providing cutting-edge fraud detection capabilities.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Lock, text: "CBK Cybersecurity Compliant" },
                  { icon: CheckCircle, text: "FRC AML/CFT Ready" },
                  { icon: Globe, text: "Data Protection Act 2019 Compliant" },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="glass-card p-8 rounded-2xl">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Shield className="w-24 h-24 text-primary/50" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="glass-card p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 gradient-gold opacity-5" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl font-bold text-foreground mb-4">
                Ready to Protect Your Institution?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join Kenya's leading financial institutions in the fight against fraud.
              </p>
              <Link to="/auth">
                <Button size="lg" variant="gold" className="text-lg px-10 group">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">
              Nuru<span className="text-primary">Nexus</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NuruNexus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
