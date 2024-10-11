"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic } from "lucide-react";

export default function VoiceCommandUI() {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setSpokenText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const VoiceBar = ({ x }) => {
    return (
      <div
        className={`bg-gradient-to-b from-purple-900 to-pink-600 h-[calc(8px*${x})] w-[3px] mx-[2px] rounded-full border-[1px] border-black`}
      ></div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-[250px] h-[250px] bg-[#151c27] p-2 rounded-lg">
      <div className="w-full space-y-2 border border-black rounded-lg p-2 bg-gradient-to-b from-purple-900/90 to-gray-900/90">
        <div className="bg-gray-800 rounded-lg p-2 shadow-sm border border-black relative">
          <div className="w-full h-12 flex items-center justify-center">
            <VoiceBar x={1.5} />
            <VoiceBar x={3} />
            <VoiceBar x={8} />
            <VoiceBar x={4.5} />
            <VoiceBar x={3} />
            <VoiceBar x={6} />
            <VoiceBar x={3} />
            <VoiceBar x={1.5} />
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="bg-gray-800 rounded-full py-1 px-3 flex-grow border border-black">
            <input
              type="text"
              value={spokenText}
              onChange={(e) => setSpokenText(e.target.value)}
              placeholder="Speak or type..."
              className="w-full bg-transparent text-white text-xs focus:outline-none rounded-full"
              aria-label="Speech to text input"
            />
          </div>
          <button
            className={`rounded-full p-1 focus:outline-none transition-colors duration-300 bg-gray-800 border border-black`}
            onClick={toggleListening}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            <Mic
              className={`w-4 h-4 ${
                isListening ? "text-purple-500" : "text-red-600"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
