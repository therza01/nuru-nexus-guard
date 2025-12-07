import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, User, Clock, MessageSquare, Send, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

type Case = Tables<"cases"> & {
  alert?: Tables<"alerts"> | null;
  assigned_profile?: { full_name: string | null; email: string } | null;
};

type CaseNote = Tables<"case_notes"> & {
  author?: { full_name: string | null; email: string } | null;
};

interface CaseDetailProps {
  caseData: Case;
  notes: CaseNote[];
  onClose: () => void;
  onAddNote: (content: string) => void;
  onUpdateStatus: (status: string) => void;
}

const getStatusStyles = (status: string | null) => {
  const styles: Record<string, { bg: string; text: string }> = {
    open: { bg: "bg-blue-500/20", text: "text-blue-500" },
    investigating: { bg: "bg-warning/20", text: "text-warning" },
    escalated: { bg: "bg-destructive/20", text: "text-destructive" },
    resolved: { bg: "bg-emerald-500/20", text: "text-emerald-500" },
    closed: { bg: "bg-muted", text: "text-muted-foreground" },
  };
  return styles[status || "open"] || styles.open;
};

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function CaseDetail({ caseData, notes, onClose, onAddNote, onUpdateStatus }: CaseDetailProps) {
  const { user } = useAuth();
  const [newNote, setNewNote] = useState("");
  const statusStyles = getStatusStyles(caseData.status);

  const handleSubmitNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-full"
    >
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-mono text-muted-foreground">{caseData.case_number}</span>
              </div>
              <CardTitle className="text-lg">{caseData.title}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Badge className={`${statusStyles.bg} ${statusStyles.text} capitalize`}>
              {caseData.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {caseData.priority} priority
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Case Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>{caseData.assigned_profile?.full_name || "Unassigned"}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{formatDate(caseData.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Update Status</label>
            <Select value={caseData.status || "open"} onValueChange={onUpdateStatus}>
              <SelectTrigger className="bg-muted/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Notes Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Case Notes ({notes.length})</h4>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {note.author?.full_name || note.author?.email || "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(note.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{note.content}</p>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No notes yet. Add the first note below.
                  </p>
                )}
              </div>
            </ScrollArea>

            {/* Add Note */}
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="bg-muted/30 resize-none"
                rows={3}
              />
              <Button 
                className="w-full" 
                onClick={handleSubmitNote}
                disabled={!newNote.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
