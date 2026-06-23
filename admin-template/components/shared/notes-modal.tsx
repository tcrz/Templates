"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (notes: string) => void;
  loading?: boolean;
  title?: string;
  description?: string;
  submitButtonText?: string;
  submitButtonClassName?: string;
  placeholder?: string;
  label?: string;
}

export function NotesModal({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
  title = "Add Note",
  description = "Please provide a note.",
  submitButtonText = "Submit",
  submitButtonClassName,
  placeholder = "Enter your note...",
  label = "Note (Required)",
}: NotesModalProps) {
  const [notes, setNotes] = useState("");

  // Reset notes when modal closes
  useEffect(() => {
    if (!open) {
      setNotes("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!notes.trim()) return;
    onSubmit(notes);
  };

  const handleCancel = () => {
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="notes-input">{label}</Label>
            <Textarea
              id="notes-input"
              placeholder={placeholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!notes.trim() || loading}
            className={submitButtonClassName}
            loading={loading}
          >
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
