import type { Note } from "@/types/note";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Pencil, Star, Trash } from "lucide-react";
import { formatDate, formatDuration } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onFavorite: (id: string) => void;
  onClick: (note: Note) => void;
}

export function NoteCard({
  note,
  onDelete,
  onEdit,
  onFavorite,
  onClick,
}: NoteCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="relative">
      <CardContent
        className="pt-6 cursor-pointer"
        onClick={() => onClick(note)}
      >
        {note.isNew && (
          <Badge className="absolute top-2 right-2 bg-purple-500">NEW</Badge>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {note.isAudio && (
              <span className="text-sm text-muted-foreground">
                {formatDuration(note.audioDuration || 0)}
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              {formatDate(note.createdAt)}
            </span>
          </div>
          <h3 className="font-semibold">{note.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {note.content}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant={isCopied ? "default" : "ghost"}
            size="icon"
            onClick={() => copyToClipboard(note.content)}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(note)}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            // add a confirmation dialog before deleting the note

            onClick={() => {
              if (confirm("Are you sure you want to delete this note?")) {
                onDelete(note._id!);
              }
            }}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onFavorite(note._id!)}
          className={note.isFavorite ? "text-yellow-500" : ""}
        >
          <Star
            className="h-4 w-4"
            color={note.isFavorite ? "yellow" : "currentColor"}
          />
          <span className="sr-only">Favorite</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
