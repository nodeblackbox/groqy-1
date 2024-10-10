"use client";
import React, { useState, useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { toast } from "react-hot-toast";

export default function VoiceCommandUI() {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Speech Recognition Setup
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
    } else {
      toast.error("Speech recognition not supported in this browser.");
    }

    // Speech Synthesis Setup
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      loadVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    } else {
      toast.error("Text-to-speech not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  //function to forward the intractions to the LLM:
  const forwardToLLM = (interaction) => {
    let content = interaction.content;
    console.log("Content: ", interaction.content);
    //implement the functionality to send the content to the LLM
  };

  const loadVoices = () => {
    const availableVoices = synthRef.current.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0 && !selectedVoice) {
      setSelectedVoice(availableVoices[0].name);
    }
  };

  const handleSpeechResult = (event) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
        addInteraction("speech", finalTranscript);
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    // Update spokenText state
    setSpokenText(finalTranscript || interimTranscript);
  };

  const addInteraction = (type, content) => {
    const newInteraction = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type,
      content,
    };
    setInteractions((prev) => [...prev, newInteraction]);
    //forward to the LLM function:
    forwardToLLM(newInteraction);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(e.target.value);
  };

  const speak = (text) => {
    if (synthRef.current && selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
      synthRef.current.speak(utterance);
    }
  };
  const VoiceBar = ({ x }) => {
    return (
      <div
        className={`bg-gradient-to-b from-purple-900 to-pink-600 h-[calc(13.5px*${x})] w-[16px] mx-4 rounded-full border-[2px] border-black`}
      >
        {" "}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-4 border-2 border-black rounded-2xl p-4 shadow-lg bg-gradient-to-b from-purple-900/90 to-gray-900/90">
        <div className="bg-gray-800 rounded-2xl p-4 shadow-lg border-2 border-black relative">
          <div className="w-full h-24 flex w-[100%] items-center justify-center">
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
        <div className="flex items-center space-x-2">
          <div className="bg-gray-800 rounded-full py-3 px-6 flex-grow border-2 border-black">
            <input
              type="text"
              value={spokenText}
              onChange={(e) => setSpokenText(e.target.value)}
              placeholder="Speak or type here..."
              className="w-full bg-transparent text-white font-bold focus:outline-none rounded-full text-sm"
              aria-label="Speech to text input"
            />
          </div>
          <button
            className={`rounded-full p-3 focus:outline-none transition-colors duration-300 bg-gray-800 border-2 border-black`}
            onClick={toggleListening}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            <Mic
              className={`w-6 h-6 ${
                isListening ? "text-purple-500" : "text-red-600"
              }`}
            />
          </button>
        </div>

        {voices.length > 0 && (
          <div className="mt-4">
            <label htmlFor="voiceSelect" className="block text-white">
              Select Voice:
            </label>
            <select
              id="voiceSelect"
              value={selectedVoice || ""}
              onChange={handleVoiceChange}
              className="mt-1 block w-full bg-gray-800 text-white rounded-md border-gray-600 focus:border-pink-500"
            >
              {voices.map((voice, index) => (
                <option key={index} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
