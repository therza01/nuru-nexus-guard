import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Key,
  Shield,
  Bell,
  Users,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Check,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  department: string | null;
  mfa_enabled: boolean;
  role: "analyst" | "supervisor" | "admin";
}

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

interface UserRole {
  id: string;
  user_id: string;
  role: "analyst" | "supervisor" | "admin";
  created_at: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [newApiKeyName, setNewApiKeyName] = useState("");
  const [showNewKey, setShowNewKey] = useState<string | null>(null);
  const [isCreateKeyDialogOpen, setIsCreateKeyDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchApiKeys();
      checkAdminRole();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data && !error) {
      setProfile(data);
      setFullName(data.full_name || "");
      setPhone(data.phone || "");
      setDepartment(data.department || "");
    }
  };

  const fetchApiKeys = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data && !error) {
      setApiKeys(data);
    }
  };

  const checkAdminRole = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", user.id);

    if (data && !error) {
      setUserRoles(data);
      setIsAdmin(data.some((r) => r.role === "admin"));
      if (data.some((r) => r.role === "admin")) {
        fetchAllProfiles();
      }
    }
  };

  const fetchAllProfiles = async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (data && !error) {
      setAllProfiles(data);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone,
        department,
      })
      .eq("id", user.id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
      fetchProfile();
    }
    setLoading(false);
  };

  const handleCreateApiKey = async () => {
    if (!user || !newApiKeyName) return;
    setLoading(true);

    // Generate a random API key
    const key = `nnx_${crypto.randomUUID().replace(/-/g, "")}`;
    const keyPrefix = key.slice(0, 12) + "...";
    const keyHash = btoa(key); // Simple hash for demo

    const { error } = await supabase.from("api_keys").insert({
      user_id: user.id,
      name: newApiKeyName,
      key_prefix: keyPrefix,
      key_hash: keyHash,
    });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setShowNewKey(key);
      setNewApiKeyName("");
      fetchApiKeys();
      toast({ title: "API Key Created", description: "Your new API key has been generated." });
    }
    setLoading(false);
  };

  const handleDeleteApiKey = async (id: string) => {
    const { error } = await supabase.from("api_keys").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "API Key Deleted", description: "The API key has been removed." });
      fetchApiKeys();
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole as "analyst" | "supervisor" | "admin" })
      .eq("user_id", userId);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Role Updated", description: "User role has been updated." });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "API key copied to clipboard." });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "supervisor": return "default";
      default: return "secondary";
    }
  };

  return (
    <MainLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Profile Information</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="gradient-gold text-primary-foreground text-xl font-bold">
                        {fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">Change Avatar</Button>
                      <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-muted/50 opacity-60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254 7XX XXX XXX"
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g., Fraud Analysis"
                        className="bg-muted/50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="gold" onClick={handleUpdateProfile} disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys">
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="glass-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">API Keys</CardTitle>
                    <CardDescription>Manage your API keys for external integrations</CardDescription>
                  </div>
                  <Dialog open={isCreateKeyDialogOpen} onOpenChange={setIsCreateKeyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="gold" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create API Key</DialogTitle>
                        <DialogDescription>
                          Generate a new API key for external integrations.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="keyName">Key Name</Label>
                          <Input
                            id="keyName"
                            value={newApiKeyName}
                            onChange={(e) => setNewApiKeyName(e.target.value)}
                            placeholder="e.g., Production API"
                          />
                        </div>
                        {showNewKey && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="p-4 rounded-lg bg-warning/10 border border-warning/30"
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                              <p className="text-sm text-warning font-medium">
                                Copy this key now. You won't be able to see it again!
                              </p>
                            </div>
                            <div className="flex items-center gap-2 bg-background/50 p-2 rounded">
                              <code className="text-xs text-foreground flex-1 font-mono break-all">
                                {showNewKey}
                              </code>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => copyToClipboard(showNewKey)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCreateKeyDialogOpen(false);
                            setShowNewKey(null);
                          }}
                        >
                          {showNewKey ? "Done" : "Cancel"}
                        </Button>
                        {!showNewKey && (
                          <Button variant="gold" onClick={handleCreateApiKey} disabled={loading || !newApiKeyName}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Generate Key
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {apiKeys.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No API keys created yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {apiKeys.map((key, index) => (
                        <motion.div
                          key={key.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Key className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{key.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <code className="font-mono">{key.key_prefix}</code>
                                <span>•</span>
                                <span>Created {new Date(key.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={key.is_active ? "default" : "secondary"}>
                              {key.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteApiKey(key.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Security Settings</CardTitle>
                  <CardDescription>Configure your account security options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Multi-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <Switch checked={profile?.mfa_enabled || false} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Login Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when your account is accessed from a new device
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Users Tab (Admin Only) */}
          {isAdmin && (
            <TabsContent value="users">
              <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground">User Management</CardTitle>
                    <CardDescription>Manage user roles and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {allProfiles.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No users found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {allProfiles.map((profile, index) => (
                          <motion.div
                            key={profile.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30"
                          >
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={profile.avatar_url || undefined} />
                                <AvatarFallback className="gradient-teal text-secondary-foreground">
                                  {profile.full_name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">
                                  {profile.full_name || "Unnamed User"}
                                </p>
                                <p className="text-sm text-muted-foreground">{profile.email}</p>
                              </div>
                            </div>
                            <Select
                              defaultValue={profile.role}
                              onValueChange={(value) => handleUpdateUserRole(profile.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="analyst">Analyst</SelectItem>
                                <SelectItem value="supervisor">Supervisor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          )}
        </Tabs>
      </motion.div>
    </MainLayout>
  );
}
