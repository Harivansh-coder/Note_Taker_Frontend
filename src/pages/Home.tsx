import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { NoteCard } from "../components/NoteCard";
import { NoteCreator } from "../components/NoteCreator";
import { NoteModal } from "../components/NoteModal";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import type { Note } from "../types/note";
import { Search, SortDesc, LogOut } from "lucide-react";
import { notesApi } from "@/utils/api";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    if (searchQuery === "") return true;
    return (
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const fetchNotes = async () => {
    const data = await notesApi.getNotes();
    setNotes(data);
  };

  // Fetch notes on initial render
  useEffect(() => {
    fetchNotes();
  }, [searchQuery]);

  const handleCreateNote = (noteData: {
    title: string;
    content: string;
    isAudio?: boolean;
  }) => {
    const newNote: Note = {
      title: noteData.title,
      content: noteData.content,
      isAudio: noteData.isAudio || false,
      isNew: true,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      isFavorite: false,
    };

    notesApi.createNote(newNote).then((data) => {
      setNotes((prev) => [data, ...prev]);
    });

    window.location.reload();
  };

  const handleDeleteNote = (id: string) => {
    notesApi.deleteNote(id);
    setNotes((prev) => prev.filter((note) => note._id !== id));
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = (editedNote: Note) => {
    notesApi.updateNote(editedNote._id!, editedNote).then(() => {
      setNotes((prev) =>
        prev.map((note) => (note._id === editedNote._id ? editedNote : note))
      );
    });

    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleFavoriteNote = (id: string) => {
    notesApi
      .updateNote(id, {
        isFavorite: !notes.find((note) => note._id === id)?.isFavorite,
      })
      .then(() => {
        setNotes((prev) =>
          prev.map((note) =>
            note._id === id ? { ...note, isFavorite: !note.isFavorite } : note
          )
        );
      });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="ghost" size="icon">
              <SortDesc
                className="h-4 w-4"
                onClick={() => {
                  setNotes((prev) =>
                    [...prev].sort((a, b) => a.createdAt - b.createdAt)
                  );
                }}
              />
            </Button>

            {/* log out button */}
            <Button
              size="icon"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDeleteNote}
                onEdit={handleEditNote}
                onFavorite={handleFavoriteNote}
                onClick={(note) => {
                  setSelectedNote(note);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
        <NoteCreator onCreateNote={handleCreateNote} />
      </div>
      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onSave={handleSaveNote}
      />
    </div>
  );
}
