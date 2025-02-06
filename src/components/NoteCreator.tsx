import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Pencil, Image } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NoteCreatorProps {
  onCreateNote: (note: {
    title: string;
    content: string;
    isAudio?: boolean;
  }) => void;
}

export function NoteCreator({ onCreateNote }: NoteCreatorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Your browser does not support speech recognition.");
      return;
    }

    const recognitionInstance = new window.webkitSpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      if (result && result[0]) {
        setTranscript(result[0].transcript);
      }
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError("Error with speech recognition: " + event.error);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();

      setIsRecording(false);

      onCreateNote({
        title: transcript,
        content: "this is a new note",
        isAudio: true,
      });

      setTranscript("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (!transcript) return;

            onCreateNote({
              title: transcript,
              content: "this is a new note",
            });

            setTranscript("");
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Image className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Type your note..."
          className="flex-1"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          className={isRecording ? "animate-pulse" : ""}
        >
          <Mic className="h-4 w-4 mr-2" />
          {isRecording ? "Stop recording" : "Start recording"}
        </Button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
