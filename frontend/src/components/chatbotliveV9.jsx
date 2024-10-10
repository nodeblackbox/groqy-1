"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Send,
  Expand,
  Settings,
  PlusCircle,
  Trash2,
  Star,
  MessageSquare,
  Upload,
  Brain,
  Sparkles,
  Zap,
  X,
  Copy,
  Save,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import useQuantumNexusRAG from "./useQuantumNexusRAG";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
        type === "error" ? "bg-red-500" : "bg-green-500"
      } text-white flex items-center justify-between`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 focus:outline-none">
        <X size={18} />
      </button>
    </div>
  );
};

const useToast = () => {
  const [toast, setToast] = useState(null);
  const showToast = useCallback(
    (message, type = "success") => setToast({ message, type }),
    []
  );
  const hideToast = useCallback(() => setToast(null), []);
  return {
    toast: showToast,
    Toast: toast ? (
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />
    ) : null,
  };
};

export default function IdeaGeneratorUI() {
  const [isClient, setIsClient] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Welcome to the Transcendent IdeaGenerator! How may I inspire you today?",
      starred: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState(
    "llama3-groq-70b-8192-tool-use-preview"
  );
  const [darkMode, setDarkMode] = useState(false);
  const [savedResponses, setSavedResponses] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [conceptMap, setConceptMap] = useState({});
  const [ideaEvolution, setIdeaEvolution] = useState([]);
  const [customPrompts, setCustomPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingResponse, setViewingResponse] = useState(null);
  const [isAddPromptOpen, setIsAddPromptOpen] = useState(false);
  const [selfPromptMode, setSelfPromptMode] = useState(false);
  const [selfPromptFrequency, setSelfPromptFrequency] = useState(5);
  const [selfPromptIdeas, setSelfPromptIdeas] = useState([]);
  const [nexusInfo, setNexusInfo] = useState(null);

  const { processDocuments, generateResponse, getQuantumNexusInfo } =
    useQuantumNexusRAG(apiKey, selectedModel, temperature, maxTokens);
  const scrollAreaRef = useRef(null);
  const { toast, Toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("messages");
      if (savedMessages) setMessages(JSON.parse(savedMessages));
      setSelectedModel(
        localStorage.getItem("selectedModel") ||
          "llama3-groq-70b-8192-tool-use-preview"
      );
      setDarkMode(localStorage.getItem("darkMode") === "true");
      setSavedResponses(
        JSON.parse(localStorage.getItem("savedResponses") || "[]")
      );
      setApiKey(localStorage.getItem("groqApiKey") || "");
      setTemperature(parseFloat(localStorage.getItem("temperature")) || 0.7);
      setMaxTokens(parseInt(localStorage.getItem("maxTokens")) || 1000);
      setConceptMap(JSON.parse(localStorage.getItem("conceptMap") || "{}"));
      setIdeaEvolution(
        JSON.parse(localStorage.getItem("ideaEvolution") || "[]")
      );
      setCustomPrompts(
        JSON.parse(localStorage.getItem("customPrompts") || "[]")
      );
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("messages", JSON.stringify(messages));
      localStorage.setItem("selectedModel", selectedModel);
      localStorage.setItem("darkMode", darkMode.toString());
      localStorage.setItem("savedResponses", JSON.stringify(savedResponses));
      localStorage.setItem("groqApiKey", apiKey);
      localStorage.setItem("temperature", temperature.toString());
      localStorage.setItem("maxTokens", maxTokens.toString());
      localStorage.setItem("conceptMap", JSON.stringify(conceptMap));
      localStorage.setItem("ideaEvolution", JSON.stringify(ideaEvolution));
      localStorage.setItem("customPrompts", JSON.stringify(customPrompts));
    }
  }, [
    isClient,
    messages,
    selectedModel,
    darkMode,
    savedResponses,
    apiKey,
    temperature,
    maxTokens,
    conceptMap,
    ideaEvolution,
    customPrompts,
  ]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const generateSelfPrompt = useCallback(async () => {
    const prompt =
      "Generate a creative and thought-provoking question or idea based on the recent conversation and concept map.";
    const selfPrompt = await generateResponse(prompt);
    setSelfPromptIdeas((prev) => [...prev, selfPrompt]);
    return selfPrompt;
  }, [generateResponse]);

  const handleDocumentUpload = async (event) => {
    const files = event.target.files;
    const documents = await Promise.all(
      Array.from(files).map(async (file) => ({
        name: file.name,
        content: await file.text(),
      }))
    );
    await processDocuments(documents);
    toast("Documents have been assimilated into the Quantum Nexus.");
  };

  const deleteMessage = useCallback(
    (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );
      if (isClient) {
        const updatedMessages = messages.filter(
          (message) => message.id !== messageId
        );
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
      }
      toast("Message deleted successfully.");
    },
    [messages, isClient, toast]
  );

  const starMessage = useCallback(
    (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId
            ? { ...message, starred: !message.starred }
            : message
        )
      );
      if (isClient) {
        const updatedMessages = messages.map((message) =>
          message.id === messageId
            ? { ...message, starred: !message.starred }
            : message
        );
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
      }
      toast((message) => (
        <div className="flex items-center">
          <Star
            className={`w-4 h-4 mr-2 ${
              message.starred ? "text-yellow-400" : ""
            }`}
          />
          <span>
            {message.starred ? "Message unstarred" : "Message starred"}
          </span>
        </div>
      ));
    },
    [messages, isClient, toast]
  );

  const extractConcepts = useCallback((text) => {
    const words = text.toLowerCase().split(/\W+/);
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "in",
      "on",
      "at",
      "for",
      "to",
      "of",
      "and",
      "or",
      "but",
    ]);
    return words.filter((word) => word.length > 3 && !stopWords.has(word));
  }, []);

  const updateConceptMap = useCallback((newConcept) => {
    setConceptMap((prevMap) => {
      const updatedMap = { ...prevMap };
      if (updatedMap[newConcept]) {
        updatedMap[newConcept].count++;
      } else {
        updatedMap[newConcept] = { count: 1, related: [] };
      }
      return updatedMap;
    });
  }, []);

  const trackIdeaEvolution = useCallback((newIdea) => {
    setIdeaEvolution((prev) => [
      ...prev,
      { timestamp: Date.now(), idea: newIdea },
    ]);
  }, []);

  const generateDynamicPrompt = useCallback(
    (basePrompt) => {
      const topConcepts = Object.entries(conceptMap)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([concept]) => concept);

      const recentIdeas = ideaEvolution.slice(-3).map((item) => item.idea);

      const enhancedPrompt = `${basePrompt}

Consider incorporating these key concepts: ${topConcepts.join(", ")}.

Build upon these recent ideas:
${recentIdeas.map((idea, index) => `${index + 1}. ${idea}`).join("\n")}

Custom context:
${customPrompts.join("\n")}

Be creative, innovative, and push the boundaries of conventional thinking.`;

      return enhancedPrompt;
    },
    [conceptMap, ideaEvolution, customPrompts]
  );

  const generateStepPrompt = useCallback((step, message) => {
    switch (step.name) {
      case "Analyzing request":
        return `Analyze the following request and provide key points, potential challenges, and opportunities: "${message}"`;
      case "Generating initial response":
        return `Generate an innovative and comprehensive initial response to: "${message}"`;
      case "Enhancing with components":
        return `Suggest cutting-edge UI components, code snippets, or technological solutions relevant to: "${message}"`;
      case "Creating step-by-step guide":
        return `Create a detailed step-by-step guide to implement the solution for: "${message}". Include best practices and potential pitfalls.`;
      case "Exploring creative variations":
        return `Explore 3 creative and unconventional variations or applications of the idea: "${message}"`;
      case "Integrating with concept map":
        return `Integrate the new idea "${message}" with existing concepts in our concept map. Suggest new connections and potential innovations.`;
      case "Finalizing response":
        return `Summarize and finalize the comprehensive response to: "${message}". Highlight key innovations and next steps.`;
      default:
        return message;
    }
  }, []);

  const fetchGroqResponse = useCallback(
    async (prompt) => {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            model: selectedModel,
            temperature,
            max_tokens: maxTokens,
            top_p: 0.9,
            stream: false,
            stop: null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    },
    [apiKey, selectedModel, temperature, maxTokens]
  );

  const executeStep = useCallback(
    async (step, message) => {
      const prompt = generateStepPrompt(step, message);
      const enhancedPrompt = generateDynamicPrompt(prompt);
      const response = await fetchGroqResponse(enhancedPrompt);
      return { step: step.name, content: response };
    },
    [generateStepPrompt, generateDynamicPrompt, fetchGroqResponse]
  );

  // Move combineResponses above handleSendMessage to fix the error
  const combineResponses = useCallback((responses) => {
    return [
      {
        type: "text",
        content:
          responses.find((r) => r.step === "Analyzing request")?.content || "",
      },
      {
        type: "text",
        content:
          responses.find((r) => r.step === "Generating initial response")
            ?.content || "",
      },
      {
        type: "component",
        content:
          responses.find((r) => r.step === "Enhancing with components")
            ?.content || "",
      },
      {
        type: "accordion",
        content:
          responses
            .find((r) => r.step === "Creating step-by-step guide")
            ?.content.split("\n")
            .filter((step) => step.trim())
            .map((step, index) => ({
              title: `Step ${index + 1}`,
              content: step,
            })) || [],
      },
      {
        type: "table",
        content: {
          headers: ["Aspect", "Details"],
          rows:
            responses
              .find((r) => r.step === "Analyzing request")
              ?.content.split("\n")
              .filter((point) => point.trim())
              .map((point) => point.split(":").map((p) => p.trim())) || [],
        },
      },
      {
        type: "text",
        content:
          responses.find((r) => r.step === "Exploring creative variations")
            ?.content || "",
      },
      {
        type: "text",
        content:
          responses.find((r) => r.step === "Integrating with concept map")
            ?.content || "",
      },
      {
        type: "text",
        content:
          responses.find((r) => r.step === "Finalizing response")?.content ||
          "",
      },
    ];
  }, []);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      const newMessage = e.target.message.value;
      if (newMessage.trim()) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), type: "user", content: newMessage },
        ]);
        e.target.reset();
        setIsLoading(true);
        setProgress(0);

        try {
          const steps = [
            { name: "Analyzing request", weight: 10 },
            { name: "Retrieving relevant information", weight: 15 },
            { name: "Generating initial response", weight: 20 },
            { name: "Enhancing with components", weight: 15 },
            { name: "Creating step-by-step guide", weight: 15 },
            { name: "Exploring creative variations", weight: 10 },
            { name: "Integrating with concept map", weight: 10 },
            { name: "Finalizing response", weight: 5 },
          ];

          let cumulativeProgress = 0;
          const responses = [];

          for (const step of steps) {
            let stepResponse;

            if (step.name === "Retrieving relevant information") {
              // Implement findSimilarDocuments or use a placeholder
              stepResponse = {
                step: step.name,
                content:
                  "Relevant information retrieved from the Quantum Nexus.",
              };
            } else if (step.name === "Generating initial response") {
              const ragResponse = await generateResponse(newMessage);
              stepResponse = { step: step.name, content: ragResponse };
            } else {
              stepResponse = await executeStep(step, newMessage);
            }

            responses.push(stepResponse);
            cumulativeProgress += step.weight;
            setProgress(cumulativeProgress);

            if (step.name === "Analyzing request") {
              const concepts = extractConcepts(stepResponse.content);
              concepts.forEach(updateConceptMap);
            }
            if (step.name === "Generating initial response") {
              trackIdeaEvolution(stepResponse.content);
            }
          }

          const finalResponse = combineResponses(responses);
          setMessages((prev) => [
            ...prev,
            { id: Date.now(), type: "bot", content: finalResponse },
          ]);

          // Update Quantum Nexus metrics
          const nexusInfo = await getQuantumNexusInfo();
          setNexusInfo(nexusInfo);

          // Self-prompting logic
          if (selfPromptMode && messages.length % selfPromptFrequency === 0) {
            const selfPrompt = await generateSelfPrompt();
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                type: "bot",
                content: `Self-prompted idea: ${selfPrompt}`,
                isSelfPrompt: true,
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to get response:", error);
          toast("Failed to generate response. Please try again.", "error");
        } finally {
          setIsLoading(false);
          setProgress(0);
        }
      }
    },
    [
      executeStep,
      extractConcepts,
      updateConceptMap,
      trackIdeaEvolution,
      combineResponses,
      generateResponse,
      getQuantumNexusInfo,
      selfPromptMode,
      selfPromptFrequency,
      generateSelfPrompt,
      messages,
      toast,
    ]
  );

  const addCustomPrompt = useCallback(
    (e) => {
      e.preventDefault();
      if (newPrompt.trim()) {
        setCustomPrompts((prev) => [...prev, newPrompt]);
        setNewPrompt("");
        setIsAddPromptOpen(false);
        toast("Custom prompt added successfully.");
      }
    },
    [newPrompt, toast]
  );

  const deleteCustomPrompt = useCallback(
    (index) => {
      setCustomPrompts((prev) => prev.filter((_, i) => i !== index));
      toast("Custom prompt deleted.");
    },
    [toast]
  );

  const renderCustomPrompts = useMemo(() => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Custom Prompts</h3>
        <form onSubmit={addCustomPrompt} className="flex space-x-2 mb-4">
          <Input
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            placeholder="Enter a new custom prompt..."
            className="flex-grow"
          />
          <Button type="submit">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add
          </Button>
        </form>
        <ScrollArea className="h-[200px]">
          {customPrompts.map((prompt, index) => (
            <Card key={index} className="mb-2">
              <CardContent className="py-2 flex justify-between items-center">
                <p className="text-sm">{prompt}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCustomPrompt(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>
    );
  }, [customPrompts, newPrompt, addCustomPrompt, deleteCustomPrompt]);

  const renderIdeaEvolution = useMemo(() => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Idea Evolution</h3>
        <ul className="list-disc pl-5">
          {ideaEvolution.slice(-5).map((item, index) => (
            <li key={index} className="text-sm mb-1">
              {new Date(item.timestamp).toLocaleTimeString()}: {item.idea}
            </li>
          ))}
        </ul>
      </div>
    );
  }, [ideaEvolution]);

  const handleApiKeyChange = useCallback((e) => {
    setApiKey(e.target.value);
  }, []);

  const handleApiKeySave = useCallback(() => {
    localStorage.setItem("groqApiKey", apiKey);
    toast("API key has been securely saved.");
  }, [apiKey, toast]);

  const copyToClipboard = useCallback(
    (text) => {
      navigator.clipboard.writeText(text).then(
        () => {
          toast("Content copied to clipboard");
        },
        (err) => {
          toast("Could not copy content: " + err, "error");
        }
      );
    },
    [toast]
  );

  const viewFullResponse = useCallback((response) => {
    setViewingResponse(response);
    setIsViewModalOpen(true);
  }, []);

  const deleteSavedResponse = useCallback(
    (index) => {
      setSavedResponses((prev) => {
        const newResponses = [...prev];
        newResponses.splice(index, 1);
        if (isClient) {
          localStorage.setItem("savedResponses", JSON.stringify(newResponses));
        }
        return newResponses;
      });
      toast("Response deleted successfully.");
    },
    [isClient, toast]
  );

  const renderSavedResponses = useMemo(() => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Saved Responses</h3>
        {savedResponses.map((response, index) => (
          <Card key={index} className="mb-2">
            <CardContent className="p-2">
              <h4 className="font-semibold">{response.name}</h4>
              <p className="text-sm truncate">
                {Array.isArray(response.response)
                  ? response.response[0].content
                  : typeof response.response === "string"
                  ? response.response
                  : JSON.stringify(response.response)}
              </p>
              <div className="mt-2 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewFullResponse(response)}
                >
                  View Full
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteSavedResponse(index)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }, [savedResponses, viewFullResponse, deleteSavedResponse]);

  const saveResponse = useCallback(
    (response, name) => {
      const newResponse = {
        name,
        response: Array.isArray(response)
          ? response
          : [{ type: "text", content: response }],
      };
      setSavedResponses((prev) => {
        const newResponses = [...prev, newResponse];
        if (isClient) {
          localStorage.setItem("savedResponses", JSON.stringify(newResponses));
        }
        return newResponses;
      });
      toast(`Response "${name}" has been saved for future inspiration.`);
    },
    [isClient, toast]
  );

  const renderMessage = useCallback(
    (message) => {
      return (
        <div
          key={message.id}
          className={`flex ${
            message.type === "user" ? "justify-end" : "justify-start"
          } mb-4`}
        >
          <div
            className={`flex items-start space-x-2 max-w-[80%] ${
              message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <Avatar>
              <AvatarImage
                src={
                  message.type === "user"
                    ? "/user-avatar.png"
                    : "/bot-avatar.png"
                }
              />
              <AvatarFallback>
                {message.type === "user" ? "U" : "B"}
              </AvatarFallback>
            </Avatar>
            <Card
              className={`${
                darkMode ? "bg-gray-800 border-gray-700" : ""
              } w-full`}
            >
              <CardContent className="p-3">
                {Array.isArray(message.content) ? (
                  <Tabs defaultValue="text" className="w-full">
                    <TabsList>
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger value="component">Component</TabsTrigger>
                      <TabsTrigger value="steps">Steps</TabsTrigger>
                      <TabsTrigger value="table">Table</TabsTrigger>
                      <TabsTrigger value="variations">Variations</TabsTrigger>
                      <TabsTrigger value="concept-integration">
                        Concept Integration
                      </TabsTrigger>
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text">
                      <p className="text-sm">
                        {message.content[0]?.content || ""}
                      </p>
                    </TabsContent>
                    <TabsContent value="component">
                      <pre
                        className={`text-sm ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        } p-2 rounded`}
                      >
                        {message.content[2]?.content || ""}
                      </pre>
                    </TabsContent>
                    <TabsContent value="steps">
                      <Accordion type="single" collapsible>
                        {message.content[3]?.content.map((step, index) => (
                          <AccordionItem value={`step-${index}`} key={index}>
                            <AccordionTrigger>{step.title}</AccordionTrigger>
                            <AccordionContent>{step.content}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>
                    <TabsContent value="table">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {message.content[4]?.content.headers.map(
                              (header, index) => (
                                <TableHead key={index}>{header}</TableHead>
                              )
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {message.content[4]?.content.rows.map(
                            (row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <TableCell key={cellIndex}>{cell}</TableCell>
                                ))}
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    <TabsContent value="variations">
                      <p className="text-sm">
                        {message.content[5]?.content || ""}
                      </p>
                    </TabsContent>
                    <TabsContent value="concept-integration">
                      <p className="text-sm">
                        {message.content[6]?.content || ""}
                      </p>
                    </TabsContent>
                    <TabsContent value="summary">
                      <p className="text-sm">
                        {message.content[7]?.content || ""}
                      </p>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() =>
                        copyToClipboard(JSON.stringify(message.content))
                      }
                    >
                      Copy as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        copyToClipboard(
                          Array.isArray(message.content)
                            ? message.content[0]?.content || ""
                            : message.content
                        )
                      }
                    >
                      Copy Text
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Response</DialogTitle>
                      <DialogDescription>
                        Choose a name for this response to save it for later
                        use.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          defaultValue="Response"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      onClick={() => {
                        const name = document.getElementById("name").value;
                        saveResponse(message.content, name);
                      }}
                    >
                      Save Response
                    </Button>
                  </DialogContent>
                </Dialog>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMessage(message.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete message</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => starMessage(message.id)}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            message.starred ? "fill-yellow-400" : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {message.starred ? "Unstar message" : "Star message"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          </div>
        </div>
      );
    },
    [darkMode, copyToClipboard, saveResponse, deleteMessage, starMessage]
  );

  const renderSelfPromptSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="selfPromptMode"
          checked={selfPromptMode}
          onCheckedChange={setSelfPromptMode}
        />
        <Label htmlFor="selfPromptMode">Enable Self-Prompting</Label>
      </div>
      <div>
        <Label htmlFor="selfPromptFrequency">Self-Prompt Frequency</Label>
        <Slider
          id="selfPromptFrequency"
          min={1}
          max={10}
          step={1}
          value={[selfPromptFrequency]}
          onValueChange={([value]) => setSelfPromptFrequency(value)}
        />
        <span>Every {selfPromptFrequency} messages</span>
      </div>
    </div>
  );

  const renderQuantumNexusMetrics = () => (
    <Card>
      <CardContent className="space-y-2">
        <h3 className="text-lg font-semibold">Quantum Nexus Metrics</h3>
        {nexusInfo && (
          <>
            <p>Documents: {nexusInfo.documentCount}</p>
            <p>
              Dimensional Stability: {nexusInfo.dimensionalStability.toFixed(2)}
              %
            </p>
            <p>Quantum Coherence: {nexusInfo.quantumCoherence.toFixed(2)}%</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderConceptMapContent = useMemo(() => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Concept Map</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(conceptMap).map(([concept, data]) => (
            <div
              key={concept}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
            >
              {concept} ({data.count})
            </div>
          ))}
        </div>
      </div>
    );
  }, [conceptMap]);

  const renderSidebar = () => (
    <Tabs defaultValue="conceptMap" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="conceptMap">
          <Brain className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="ideaEvolution">
          <Sparkles className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="savedResponses">
          <MessageSquare className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="customPrompts">
          <Zap className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="rag">
          <Upload className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="w-4 h-4" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="conceptMap">{renderConceptMapContent}</TabsContent>
      <TabsContent value="ideaEvolution">{renderIdeaEvolution}</TabsContent>
      <TabsContent value="savedResponses">{renderSavedResponses}</TabsContent>
      <TabsContent value="customPrompts">{renderCustomPrompts}</TabsContent>
      <TabsContent value="rag">
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Quantum Nexus RAG</h3>
            <Input
              type="file"
              multiple
              onChange={handleDocumentUpload}
              accept=".txt,.pdf,.doc,.docx"
            />
            {renderQuantumNexusMetrics()}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            {renderSelfPromptSettings()}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  return (
    <div
      className={`flex flex-col h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Transcendent IdeaGenerator</h1>
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">Groq API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                  />
                  <Button onClick={handleApiKeySave} className="mt-2">
                    Save API Key
                  </Button>
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Select
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llama3-groq-70b-8192-tool-use-preview">
                        Llama 3 (70B)
                      </SelectItem>
                      <SelectItem value="mixtral-8x7b-32768">
                        Mixtral 8x7B
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="temperature">
                    Temperature: {temperature}
                  </Label>
                  <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[temperature]}
                    onValueChange={([value]) => setTemperature(value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxTokens">Max Tokens: {maxTokens}</Label>
                  <Slider
                    id="maxTokens"
                    min={100}
                    max={4096}
                    step={100}
                    value={[maxTokens]}
                    onValueChange={([value]) => setMaxTokens(value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="darkMode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                  <Label htmlFor="darkMode">Dark Mode</Label>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <Expand className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isExpanded ? "Collapse" : "Expand"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Dialog open={isAddPromptOpen} onOpenChange={setIsAddPromptOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Custom Prompt
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Prompt</DialogTitle>
                <DialogDescription>
                  Enter a new custom prompt to enhance idea generation.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={addCustomPrompt} className="space-y-4">
                <Input
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Enter your custom prompt..."
                />
                <Button type="submit">Add Prompt</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {isClient ? (
        <>
          <main className="flex-1 overflow-hidden">
            <div className="flex h-full">
              <ScrollArea
                className={`flex-1 p-4 ${isExpanded ? "w-2/3" : "w-full"}`}
                ref={scrollAreaRef}
              >
                {messages.map(renderMessage)}
              </ScrollArea>
              {isExpanded && (
                <div className="w-1/3 p-4 border-l overflow-y-auto">
                  {renderSidebar()}
                </div>
              )}
            </div>
          </main>
          <footer className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                name="message"
                placeholder="Type your message here..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isLoading ? "Generating..." : "Send"}
              </Button>
            </form>
            {isLoading && <Progress value={progress} className="mt-2" />}
          </footer>
          {Toast}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      )}

      {Toast}
      {isViewModalOpen && viewingResponse && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewingResponse.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              {Array.isArray(viewingResponse.response) ? (
                viewingResponse.response.map((item, index) => (
                  <div key={index} className="mb-2">
                    <h5 className="font-semibold">{item.type}</h5>
                    <p>{item.content}</p>
                  </div>
                ))
              ) : (
                <p>{viewingResponse.response}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
