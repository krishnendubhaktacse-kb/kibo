import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    const vapiInstance = new Vapi("3e885600-d47a-4d60-ab78-089b102a04ec");
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
        setIsConnected(true);
        setIsConnected(false);
        setTranscript([]);
    });

    vapiInstance.on("call-end", () => {
        setIsConnected(false);
        setIsConnecting(false);
        setIsSpeaking(false);
    });

    vapiInstance.on("speech-start", () => {
        setIsSpeaking(true);
    });

    vapiInstance.on("speech-end", () => {
        setIsSpeaking(false);
    });

    vapiInstance.on("error", (error) => {
        console.log(error, "VAPI_ERROR");
        setIsConnecting(false);
    });

    vapiInstance.on("message", (message) => {
  if (message.type === "transcript" && message.transcriptType === "final") {
    setTranscript((prev) => [
      ...prev,
      {
        role: message.role === "user" ? "user" : "assistant",
        text: message.transcript,
      }
    ]);
  }
});

return () => {
    vapiInstance?.stop();
}
  }, []);

  const startCall = () => {
    setIsConnecting(true);

    if (vapi) {
        vapi.start("d94433e2-de50-46c7-87f2-c1168e77f94c");
    }
  }

  const endCall = () => {
    if (vapi) {
        vapi.stop();
    }
  };

  return {
    isSpeaking,
    isConnecting,
    isConnected,
    transcript,
    startCall,
    endCall,
  }
};