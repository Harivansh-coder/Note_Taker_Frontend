import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Note } from "@/types/note";
import { useEffect, useState } from "react";
import { Maximize2, Star } from "lucide-react";

interface NoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
}

export function NoteModal({ note, isOpen, onClose, onSave }: NoteModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editedNote, setEditedNote] = useState<Note | null>(note);

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const handleSave = () => {
    if (editedNote) {
      onSave(editedNote);
      onClose();
    }
  };

  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="note-modal-description"
        className={isFullscreen ? "w-screen h-screen max-w-none m-0" : ""}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              <Input
                value={editedNote?.title || ""}
                onChange={(e) =>
                  setEditedNote((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
                placeholder="Title"
                className="text-xl font-bold"
              />
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4">
          <Textarea
            value={editedNote?.content || ""}
            onChange={(e) =>
              setEditedNote((prev) =>
                prev ? { ...prev, content: e.target.value } : null
              )
            }
            placeholder="content"
            className="min-h-[200px]"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
