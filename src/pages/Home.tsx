import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { NoteCard } from "../components/NoteCard";
import { NoteCreator } from "../components/NoteCreator";
import { NoteModal } from "../components/NoteModal";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, SortDesc, LogOut } from "lucide-react";
import { notesApi } from "@/utils/api";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Note } from "@/types/note";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch notes using React Query
  const { data: notes, isLoading } = useQuery<Note[]>(
    ["notes"],
    notesApi.getNotes
  );

  const createNoteMutation = useMutation(notesApi.createNote, {
    onSuccess: () => queryClient.invalidateQueries(["notes"]),
  });

  const deleteNoteMutation = useMutation(notesApi.deleteNote, {
    onSuccess: () => queryClient.invalidateQueries(["notes"]),
  });

  const updateNoteMutation = useMutation(notesApi.updateNote, {
    onSuccess: () => queryClient.invalidateQueries(["notes"]),
  });

  // Filter notes based on search query
  const filteredNotes = notes?.filter((note) => {
    if (searchQuery === "") return true;
    return (
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateNote = (noteData: {
    title: string;
    content: string;
    isAudio?: boolean;
  }) => {
    const newNote = {
      title: noteData.title,
      content: noteData.content,
      isNew: true,
      isAudio: noteData.isAudio || false,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      isFavorite: false,
    };

    createNoteMutation.mutate(newNote);
  };

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = (editedNote: Note) => {
    updateNoteMutation.mutate(editedNote);
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleFavoriteNote = (id: string) => {
    const note = notes?.find((note) => note._id === id);
    if (note) {
      updateNoteMutation.mutate({ ...note, isFavorite: !note.isFavorite });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {isLoading && <div>Loading...</div>}

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
                  // ignore using any type here

                  queryClient.setQueryData(
                    ["notes"],
                    (oldData: Note[] | undefined) =>
                      oldData?.sort(
                        (a: Note, b: Note) => a.createdAt - b.createdAt
                      )
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
            {filteredNotes?.map((note) => (
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
