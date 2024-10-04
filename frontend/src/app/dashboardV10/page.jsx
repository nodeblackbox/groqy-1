// 'use client';

// import React, {
//     useState,
//     useEffect,
//     useRef,
//     useCallback,
//     useMemo,
// } from 'react';
// import {
//     Triangle,
//     Download,
//     Upload,
//     Settings2,
//     Trash2,
//     Sun,
//     Moon,
//     Send,
//     Mic,
//     Bot,
//     CornerDownLeft,
//     Paperclip,
//     Plus,
//     Loader2,
//     ChevronRight,
//     ChevronLeft,
//     MessageSquare,
//     Workflow,
//     FileUp,
//     Wrench,
//     Code,
//     HelpCircle,
//     Eye,
//     EyeOff,
//     Star,
//     Save,
//     PenBox,
//     Phone,
//     Video,
//     Expand,
//     PlusCircle,
//     Zap,
//     X,
//     Copy,
//     RefreshCw,
// } from 'lucide-react';
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider"
// import { Switch } from "@/components/ui/switch"
// import { Badge } from "@/components/ui/badge"
// import { Label } from "@/components/ui/label"
// import { Progress } from "@/components/ui/progress"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import ReactMarkdown from 'react-markdown';
// import useQuantumNexusRAG from '@/components/use-quantum-nexus-rag';
// import { toast, Toaster } from 'react-hot-toast';

// // Utility function for classNames
// const cn = (...classes) => classes.filter(Boolean).join(' ');

// // Custom Toast Component
// const CustomToast = ({ message, type, onClose }) => {
//     useEffect(() => {
//         const timer = setTimeout(onClose, 3000);
//         return () => clearTimeout(timer);
//     }, [onClose]);

//     return (
//         <div
//             className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${type === 'error' ? 'bg-red-500' : 'bg-green-500'
//                 } text-white flex items-center justify-between z-50`}
//             role="alert"
//         >
//             <span>{message}</span>
//             <button onClick={onClose} className="ml-4 focus:outline-none" aria-label="Close notification">
//                 <X size={18} />
//             </button>
//         </div>
//     );
// };

// // Custom Hook for Toasts
// const useToast = () => {
//     const [toastData, setToastData] = useState(null);
//     const showToast = useCallback((message, type = 'success') => {
//         setToastData({ message, type });
//     }, []);
//     const hideToast = useCallback(() => setToastData(null), []);
//     return {
//         showToast,
//         Toast: toastData ? (
//             <CustomToast
//                 message={toastData.message}
//                 type={toastData.type}
//                 onClose={hideToast}
//             />
//         ) : null,
//     };
// };

// // Task Types
// const taskTypes = [
//     { value: 'text', label: 'Text Task', points: 5 },
//     { value: 'code', label: 'Code Task', points: 10 },
//     { value: 'design', label: 'Design Task', points: 15 },
//     { value: 'research', label: 'Research Task', points: 8 },
//     { value: 'planning', label: 'Planning Task', points: 12 },
// ];

// // Main Quantum Nexus Component
// const QuantumNexus = () => {
//     // Unified State Management

//     const extractConcepts = useCallback((text) => {
//         const words = text.toLowerCase().split(/\W+/);
//         const stopWords = new Set([
//             'the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'or', 'but',
//         ]);
//         return words.filter((word) => word.length > 3 && !stopWords.has(word));
//     }, []);

//     const updateConceptMap = useCallback((concept) => {
//         setState((prev) => {
//             const updatedMap = { ...prev.conceptMap };
//             if (updatedMap[concept])
//             {
//                 updatedMap[concept].count += 1;
//             } else
//             {
//                 updatedMap[concept] = { count: 1, related: [] };
//             }
//             return { ...prev, conceptMap: updatedMap };
//         });
//     }, []);

//     const trackIdeaEvolution = useCallback((idea) => {
//         setState((prev) => ({
//             ...prev,
//             ideaEvolution: [
//                 ...prev.ideaEvolution,
//                 { timestamp: Date.now(), idea },
//             ],
//         }));
//     }, []);

//     const [state, setState] = useState(() => {
//         if (typeof window !== 'undefined')
//         {
//             const saved = localStorage.getItem('quantumNexusState');
//             return saved ? JSON.parse(saved) : {
//                 chats: [],
//                 currentChatId: null,
//                 apiKey: '',
//                 settings: {
//                     api: 'ollama',
//                     model: 'deepseek-coder-v2',
//                     temperature: 0.7,
//                     maxTokens: 1024,
//                     topP: 1,
//                     topK: 0,
//                     stream: false,
//                     darkMode: false,
//                     useGroq: false,
//                 },
//                 systemPrompt: '',
//                 projectName: 'My Project',
//                 tasks: [],
//                 users: [],
//                 projectMethodology: 'agile',
//                 integrations: [],
//                 conceptMap: {},
//                 ideaEvolution: [],
//                 customPrompts: [],
//                 savedResponses: [],
//                 gptPrompt: '',
//             };
//         }
//         return {
//             chats: [],
//             currentChatId: null,
//             apiKey: '',
//             settings: {
//                 api: 'ollama',
//                 model: 'deepseek-coder-v2',
//                 temperature: 0.7,
//                 maxTokens: 1024,
//                 topP: 1,
//                 topK: 0,
//                 stream: false,
//                 darkMode: false,
//                 useGroq: false,
//             },
//             systemPrompt: '',
//             projectName: 'My Project',
//             tasks: [],
//             users: [],
//             projectMethodology: 'agile',
//             integrations: [],
//             conceptMap: {},
//             ideaEvolution: [],
//             customPrompts: [],
//             savedResponses: [],
//             gptPrompt: '',
//         };
//     });

//     const { showToast, Toast } = useToast();

//     // Other State Variables
//     const [isLoading, setIsLoading] = useState(false);
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [currentView, setCurrentView] = useState('chat');
//     const [isChatCollapsed, setIsChatCollapsed] = useState(false);
//     const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
//     const [showAdvanced, setShowAdvanced] = useState(false);
//     const [totalPoints, setTotalPoints] = useState(0);
//     const [projectRisks, setProjectRisks] = useState([]);
//     const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
//     const [inputMode, setInputMode] = useState('text');
//     const [textInput, setTextInput] = useState('');
//     const [codeInput, setCodeInput] = useState('');
//     const [speechSynthesisInstance, setSpeechSynthesisInstance] = useState(null);
//     const [recognition, setRecognition] = useState(null);
//     const [isAddPromptOpen, setIsAddPromptOpen] = useState(false);
//     const [selfPromptMode, setSelfPromptMode] = useState(false);
//     const [selfPromptFrequency, setSelfPromptFrequency] = useState(5);
//     const [selfPromptIdeas, setSelfPromptIdeas] = useState([]);
//     const [nexusInfo, setNexusInfo] = useState(null);

//     // Refs
//     const chatContainerRef = useRef(null);
//     const scrollAreaRef = useRef(null);

//     // Quantum Nexus RAG Hook
//     const {
//         processDocuments,
//         generateResponse,
//         getQuantumNexusInfo,
//     } = useQuantumNexusRAG(
//         state.apiKey,
//         state.settings.model,
//         state.settings.temperature,
//         state.settings.maxTokens
//     );

//     // Available Models
//     const [availableModels, setAvailableModels] = useState({
//         ollama: ['deepseek-coder-v2'],
//         groq: [
//             {
//                 label: 'llama-3.1-70b-versatile',
//                 value: 'llama-3.1-70b-versatile',
//             },
//         ],
//     });

//     // Effect: Initialize Client-side Features
//     useEffect(() => {
//         if (typeof window !== 'undefined')
//         {
//             // Initialize Speech Synthesis
//             setSpeechSynthesisInstance(window.speechSynthesis);

//             // Initialize Speech Recognition
//             const SpeechRecognition =
//                 window.SpeechRecognition || window.webkitSpeechRecognition;
//             if (SpeechRecognition)
//             {
//                 const recog = new SpeechRecognition();
//                 recog.continuous = false;
//                 recog.interimResults = false;
//                 recog.lang = 'en-US';
//                 setRecognition(recog);
//             }

//             // Fetch Ollama Models
//             fetchOllamaModels();
//         }
//     }, []);

//     // Effect: Persist State to localStorage
//     useEffect(() => {
//         if (typeof window !== 'undefined')
//         {
//             localStorage.setItem('quantumNexusState', JSON.stringify(state));

//             // Toggle Dark Mode Class
//             if (state.settings.darkMode)
//             {
//                 document.documentElement.classList.add('dark');
//             } else
//             {
//                 document.documentElement.classList.remove('dark');
//             }
//         }
//     }, [state]);

//     // Effect: Auto-scroll Chat
//     useEffect(() => {
//         if (chatContainerRef.current)
//         {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//     }, [state.currentChatId, state.chats, currentView, state.messages]);

//     // Effect: Calculate Total Points and Assess Risks
//     useEffect(() => {
//         const points = Array.isArray(state.tasks)
//             ? state.tasks.reduce((total, task) => total + (task.points || 0), 0)
//             : 0;
//         setTotalPoints(points);
//         setProjectRisks(assessProjectRisks(state.tasks || [], state.users || []));
//     }, [state.tasks, state.users]);

//     // Fetch Ollama Models
//     const fetchOllamaModels = async () => {
//         try
//         {
//             const response = await fetch('/api/ollama-models');
//             const data = await response.json();
//             if (!response.ok)
//             {
//                 throw new Error(data.error || 'Failed to fetch models');
//             }
//             const formattedModels = data.models.map((model) => ({
//                 label: model,
//                 value: model,
//             }));
//             setAvailableModels((prev) => ({ ...prev, ollama: formattedModels }));
//         } catch (error)
//         {
//             console.error('Error fetching Ollama models:', error);
//             showToast('Failed to fetch Ollama models', 'error');
//         }
//     };

//     // Load Selected Chat
//     const loadSelectedChat = (chatId) => {
//         setState((prev) => ({
//             ...prev,
//             currentChatId: chatId,
//         }));
//     };

//     // Create New Chat
//     const createNewChat = async () => {
//         try
//         {
//             const newChat = {
//                 id: Date.now().toString(),
//                 name: `New Chat ${state.chats.length + 1}`,
//                 messages: [],
//                 updatedAt: Date.now(),
//             };
//             setState((prev) => ({
//                 ...prev,
//                 chats: [...prev.chats, newChat],
//                 currentChatId: newChat.id,
//             }));
//             showToast(`New chat "${newChat.name}" created!`);
//         } catch (error)
//         {
//             console.error('Error creating new chat:', error);
//             showToast('Failed to create a new chat.', 'error');
//         }
//     };

//     // Delete Chat
//     const deleteChat = async (chatId) => {
//         try
//         {
//             setState((prev) => ({
//                 ...prev,
//                 chats: prev.chats.filter((chat) => chat.id !== chatId),
//                 currentChatId: prev.currentChatId === chatId ? null : prev.currentChatId,
//             }));
//             showToast('Chat deleted successfully!');
//         } catch (error)
//         {
//             console.error('Error deleting chat:', error);
//             showToast('Failed to delete chat.', 'error');
//         }
//     };

//     // Clear Chat
//     const clearChat = async () => {
//         if (state.currentChatId)
//         {
//             setState((prev) => ({
//                 ...prev,
//                 chats: prev.chats.map((chat) =>
//                     chat.id === prev.currentChatId ? { ...chat, messages: [] } : chat
//                 ),
//             }));
//             showToast('Chat cleared successfully!');
//         }
//     };

//     // Export Chats
//     const exportChats = async () => {
//         try
//         {
//             const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
//                 JSON.stringify(state.chats, null, 2)
//             )}`;
//             const exportFileDefaultName = 'quantum_nexus_chats.json';
//             const linkElement = document.createElement('a');
//             linkElement.setAttribute('href', dataUri);
//             linkElement.setAttribute('download', exportFileDefaultName);
//             document.body.appendChild(linkElement);
//             linkElement.click();
//             document.body.removeChild(linkElement);
//             showToast('Chats exported successfully!');
//         } catch (error)
//         {
//             console.error('Error exporting chats:', error);
//             showToast('Failed to export chats.', 'error');
//         }
//     };

//     // Import Chats
//     const importChats = async (event) => {
//         const file = event.target.files && event.target.files[0];
//         if (file)
//         {
//             try
//             {
//                 const text = await file.text();
//                 const importedChats = JSON.parse(text);
//                 setState((prev) => ({
//                     ...prev,
//                     chats: [...prev.chats, ...importedChats],
//                 }));
//                 showToast('Chats imported successfully!');
//             } catch (error)
//             {
//                 console.error('Error importing chats:', error);
//                 showToast('Failed to import chats. Please check the file format.', 'error');
//             }
//         }
//     };

//     // Save API Key
//     const saveApiKey = (key) => {
//         setState((prev) => ({ ...prev, apiKey: key }));
//         showToast('API Key saved successfully!');
//     };

//     // Set System Prompt
//     const setSystemPrompt = (prompt) => {
//         setState((prev) => ({ ...prev, systemPrompt: prompt }));
//         showToast('System prompt set successfully!');
//     };

//     // Reset Settings
//     const resetSettings = () => {
//         setState((prev) => ({
//             ...prev,
//             settings: {
//                 api: 'ollama',
//                 model: 'deepseek-coder-v2',
//                 temperature: 0.7,
//                 maxTokens: 1024,
//                 topP: 1,
//                 topK: 0,
//                 stream: false,
//                 darkMode: false,
//                 useGroq: false,
//             },
//         }));
//         showToast('Settings reset to default values!');
//     };

//     // Download Chat Transcript
//     const downloadChatTranscript = () => {
//         if (!state.currentChatId) return;
//         const currentChat = state.chats.find((chat) => chat.id === state.currentChatId);
//         if (!currentChat) return;
//         try
//         {
//             const transcript = currentChat.messages
//                 .map((m) => `${m.type === 'user' ? 'User' : 'AI'}: ${m.content.map(c => c.content).join(' ')}`)
//                 .join('\n\n');
//             const blob = new Blob([transcript], { type: 'text/plain' });
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = `${currentChat.name}_transcript.txt`;
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//             URL.revokeObjectURL(url);
//             showToast('Chat transcript downloaded successfully!');
//         } catch (error)
//         {
//             console.error('Error downloading transcript:', error);
//             showToast('Failed to download transcript.', 'error');
//         }
//     };

//     // Toggle Dark Mode
//     const toggleDarkMode = () => {
//         setState((prev) => ({
//             ...prev,
//             settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
//         }));
//     };

//     // Voice Input Handling
//     const startVoiceInput = () => {
//         if (recognition)
//         {
//             recognition.onresult = (event) => {
//                 const transcript = event.results[0][0].transcript;
//                 setTextInput(transcript);
//                 showToast('Voice input received!', 'success');
//             };
//             recognition.onerror = (event) => {
//                 console.error('Speech recognition error:', event.error);
//                 showToast(`Speech recognition error: ${event.error}`, 'error');
//             };
//             recognition.start();
//             showToast('Listening...', 'info');
//         } else
//         {
//             showToast('Speech recognition not supported in this browser.', 'error');
//         }
//     };

//     // Text-to-Speech Handling
//     const speakMessage = (message) => {
//         if (speechSynthesisInstance)
//         {
//             if (isSpeaking)
//             {
//                 speechSynthesisInstance.cancel();
//                 setIsSpeaking(false);
//             } else
//             {
//                 const utterance = new SpeechSynthesisUtterance(message);
//                 utterance.onend = () => setIsSpeaking(false);
//                 speechSynthesisInstance.speak(utterance);
//                 setIsSpeaking(true);
//             }
//         } else
//         {
//             showToast('Text-to-speech not supported in this browser.', 'error');
//         }
//     };

//     // Append Content Type (e.g., Code Block)
//     const appendContentType = (type) => {
//         const prefix = type === 'code' ? '\n```\n' : '\n';
//         const suffix = type === 'code' ? '\n```\n' : '\n';

//         if (inputMode === 'text')
//         {
//             setTextInput((prev) => prev + prefix + suffix);
//         } else
//         {
//             setCodeInput((prev) => prev + prefix + suffix);
//         }
//     };

//     // Handle Form Submission
//     const handleSubmit = useCallback(async (e) => {
//         e.preventDefault();
//         const currentInput = inputMode === 'text' ? textInput : codeInput;
//         if (!currentInput.trim() || !state.currentChatId) return;

//         const newMessage = {
//             id: Date.now(),
//             type: 'user',
//             content: [{ type: inputMode, content: currentInput }],
//         };
//         const updatedMessages = [
//             ...state.chats.find((chat) => chat.id === state.currentChatId).messages,
//             newMessage,
//         ];

//         setState((prev) => ({
//             ...prev,
//             chats: prev.chats.map((chat) =>
//                 chat.id === prev.currentChatId
//                     ? { ...chat, messages: updatedMessages, updatedAt: Date.now() }
//                     : chat
//             ),
//         }));

//         if (inputMode === 'text')
//         {
//             setTextInput('');
//         } else
//         {
//             setCodeInput('');
//         }
//         setIsLoading(true);

//         try
//         {
//             let responseContent = '';
//             if (state.settings.api === 'groq')
//             {
//                 if (!state.apiKey)
//                 {
//                     throw new Error('GROQ API key is not set');
//                 }
//                 const response = await fetch('/api/chat-groq', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${state.apiKey}`,
//                     },
//                     body: JSON.stringify({
//                         messages: updatedMessages,
//                         model: state.settings.model,
//                         temperature: state.settings.temperature,
//                         max_tokens: state.settings.maxTokens,
//                         top_p: state.settings.topP,
//                         stream: state.settings.stream,
//                     }),
//                 });

//                 if (!response.ok)
//                 {
//                     const errorData = await response.json();
//                     throw new Error(`GROQ API error: ${errorData.error || 'Unknown error'}`);
//                 }

//                 const data = await response.json();
//                 responseContent =
//                     data.choices[0].message.content || 'No response from GROQ API.';
//             } else if (state.settings.api === 'ollama')
//             {
//                 const response = await fetch('/api/chat-ollama', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         messages: updatedMessages,
//                         model: state.settings.model,
//                         system_prompt: state.systemPrompt,
//                         temperature: state.settings.temperature,
//                         max_tokens: state.settings.maxTokens,
//                         top_p: state.settings.topP,
//                         top_k: state.settings.topK,
//                         stream: state.settings.stream,
//                     }),
//                 });

//                 if (!response.ok)
//                 {
//                     const errorData = await response.json();
//                     throw new Error(errorData.error || 'Failed to fetch from Ollama API.');
//                 }

//                 const data = await response.json();
//                 responseContent =
//                     data.message.content || 'No response from Ollama API.';
//             } else
//             {
//                 throw new Error('Invalid API selected');
//             }

//             const assistantMessage = {
//                 id: Date.now(),
//                 type: 'bot',
//                 content: [{ type: 'text', content: responseContent }],
//             };

//             setState((prev) => ({
//                 ...prev,
//                 chats: prev.chats.map((chat) =>
//                     chat.id === prev.currentChatId
//                         ? {
//                             ...chat,
//                             messages: [...chat.messages, assistantMessage],
//                             updatedAt: Date.now(),
//                         }
//                         : chat
//                 ),
//             }));
//             // Additional Features: Concept Mapping, Idea Evolution, etc.
//             const concepts = extractConcepts(responseContent);
//             concepts.forEach(updateConceptMap);
//             trackIdeaEvolution(responseContent);

//             // Self-Prompting Logic
//             if (selfPromptMode && (state.chats.find(chat => chat.id === state.currentChatId)?.messages.length || 0) % selfPromptFrequency === 0)
//             {
//                 const selfPrompt = await generateSelfPrompt();
//                 const selfPromptMessage = {
//                     id: Date.now(),
//                     type: 'bot',
//                     content: [{ type: 'text', content: `Self-prompted idea: ${selfPrompt}` }],
//                     isSelfPrompt: true,
//                 };
//                 setState((prev) => ({
//                     ...prev,
//                     chats: prev.chats.map((chat) =>
//                         chat.id === prev.currentChatId
//                             ? {
//                                 ...chat,
//                                 messages: [...chat.messages, selfPromptMessage],
//                                 updatedAt: Date.now(),
//                             }
//                             : chat
//                     ),
//                 }));
//             }

//         } catch (error)
//         {
//             console.error('Error calling API:', error);
//             showToast(`Error communicating with the chatbot: ${error.message}`, 'error');
//         } finally
//         {
//             setIsLoading(false);
//         }
//     }, [
//         inputMode,
//         textInput,
//         codeInput,
//         state.currentChatId,
//         state.chats,
//         state.settings,
//         state.apiKey,
//         state.systemPrompt,
//         showToast,
//         extractConcepts,
//         updateConceptMap,
//         trackIdeaEvolution,
//         selfPromptMode,
//         selfPromptFrequency,
//         generateSelfPrompt,
//     ]);

//     // Extract Concepts from Text
//     const extractConcepts = useCallback((text) => {
//         const words = text.toLowerCase().split(/\W+/);
//         const stopWords = new Set([
//             'the',
//             'a',
//             'an',
//             'in',
//             'on',
//             'at',
//             'for',
//             'to',
//             'of',
//             'and',
//             'or',
//             'but',
//         ]);
//         return words.filter((word) => word.length > 3 && !stopWords.has(word));
//     }, []);

//     // Update Concept Map
//     const updateConceptMap = useCallback((concept) => {
//         setState((prev) => {
//             const updatedMap = { ...prev.conceptMap };
//             if (updatedMap[concept])
//             {
//                 updatedMap[concept].count += 1;
//             } else
//             {
//                 updatedMap[concept] = { count: 1, related: [] };
//             }
//             return { ...prev, conceptMap: updatedMap };
//         });
//     }, []);
//     // why does this not work with the other ones?

//     // Track Idea Evolution

//     const trackIdeaEvolution = useCallback((idea) => {
//         setState((prev) => ({
//             ...prev,
//             ideaEvolution: [
//                 ...prev.ideaEvolution,
//                 { timestamp: Date.now(), idea },
//             ],
//         }));
//     }, []);

//     // Assess Project Risks
//     const assessProjectRisks = (tasks, users) => {
//         const risks = [];
//         const skillGap = tasks.some((task) =>
//             task.requiredSkills.some(
//                 (skill) => !users.some((user) => user.skills.includes(skill))
//             )
//         );
//         if (skillGap)
//         {
//             risks.push({
//                 type: 'Skill Gap',
//                 description: 'Some required skills are not present in the team.',
//             });
//         }

//         const tightDeadlines = tasks.filter((task) => {
//             const daysUntilDue =
//                 (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
//             return daysUntilDue < 7 && task.estimatedEffort > 20;
//         });
//         if (tightDeadlines.length > 0)
//         {
//             risks.push({
//                 type: 'Tight Deadlines',
//                 description: `${tightDeadlines.length} tasks have tight deadlines.`,
//             });
//         }

//         return risks;
//     };

//     // Generate Self Prompt
//     const generateSelfPrompt = useCallback(async () => {
//         const prompt =
//             'Generate a creative and thought-provoking question or idea based on the recent conversation and concept map.';
//         try
//         {
//             const selfPrompt = await generateResponse(prompt);
//             setSelfPromptIdeas((prev) => [...prev, selfPrompt]);
//             return selfPrompt;
//         } catch (error)
//         {
//             console.error('Error generating self prompt:', error);
//             showToast('Failed to generate self prompt.', 'error');
//             return '';
//         }
//     }, [generateResponse, showToast]);

//     // Add Task
//     const addTask = () => {
//         const newTask = {
//             id: Date.now().toString(),
//             title: '',
//             description: '',
//             type: 'text',
//             points: 5,
//             dueDate: '',
//             requiredSkills: [],
//             fileUploadRequired: false,
//             assignedTo: '',
//             dependencies: [],
//             estimatedEffort: 0,
//             subTasks: [],
//         };
//         setState((prev) => ({
//             ...prev,
//             tasks: [...prev.tasks, newTask],
//         }));
//         setExpandedTaskIndex(state.tasks.length);
//     };

//     // Update Task
//     const updateTask = (index, updatedTask) => {
//         setState((prev) => {
//             const updatedTasks = [...prev.tasks];
//             updatedTasks[index] = updatedTask;
//             return { ...prev, tasks: updatedTasks };
//         });
//     };

//     // Remove Task
//     const removeTask = (index) => {
//         setState((prev) => ({
//             ...prev,
//             tasks: prev.tasks.filter((_, i) => i !== index),
//         }));
//         setExpandedTaskIndex(null);
//     };

//     // Move Task
//     const moveTask = (fromIndex, toIndex) => {
//         setState((prev) => {
//             const updatedTasks = [...prev.tasks];
//             const [movedTask] = updatedTasks.splice(fromIndex, 1);
//             updatedTasks.splice(toIndex, 0, movedTask);
//             return { ...prev, tasks: updatedTasks };
//         });
//     };

//     // Toggle Task Expansion
//     const toggleTaskExpand = (index) => {
//         setExpandedTaskIndex(expandedTaskIndex === index ? null : index);
//     };

//     // Save Project
//     const saveProject = () => {
//         const projectData = {
//             name: state.projectName,
//             tasks: state.tasks,
//             users: state.users,
//         };
//         const projectJson = JSON.stringify(projectData, null, 2);
//         const blob = new Blob([projectJson], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.download = `${state.projectName}.json`;
//         link.href = url;
//         link.click();
//         showToast('Project saved successfully!');
//     };

//     // Load Project
//     const loadProject = async (event) => {
//         const file = event.target.files[0];
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             try
//             {
//                 const projectData = JSON.parse(e.target.result);
//                 setState((prev) => ({
//                     ...prev,
//                     projectName: projectData.name,
//                     tasks: projectData.tasks,
//                     users: projectData.users,
//                 }));
//                 showToast('Project loaded successfully!');
//             } catch (error)
//             {
//                 console.error('Error parsing project file:', error);
//                 showToast('Failed to load project. Invalid file format.', 'error');
//             }
//         };
//         reader.readAsText(file);
//     };

//     // Handle Methodology Change
//     const handleMethodologyChange = (methodology) => {
//         setState((prev) => ({
//             ...prev,
//             projectMethodology: methodology,
//         }));
//         showToast(`Project methodology changed to ${methodology}.`, 'info');
//     };

//     // Add Integration
//     const addIntegration = (integration) => {
//         setState((prev) => ({
//             ...prev,
//             integrations: [...prev.integrations, integration],
//         }));
//         showToast(`${integration} integration added successfully!`, 'success');
//     };

//     // Generate Tasks via GPT Prompt
//     const generateTasks = async () => {
//         if (!state.apiKey)
//         {
//             showToast('Please enter your API key.', 'error');
//             return;
//         }
//         setIsLoading(true);
//         try
//         {
//             const response = await fetch('/api/generate-tasks', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${state.apiKey}`,
//                 },
//                 body: JSON.stringify({
//                     prompt: state.gptPrompt,
//                     model: state.settings.model,
//                     temperature: state.settings.temperature,
//                     max_tokens: state.settings.maxTokens,
//                 }),
//             });
//             if (!response.ok)
//             {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to generate tasks.');
//             }
//             const data = await response.json();
//             const generatedTasks = JSON.parse(data.tasks);
//             setState((prev) => ({
//                 ...prev,
//                 tasks: [...prev.tasks, ...generatedTasks],
//             }));
//             showToast('Tasks generated successfully!', 'success');
//         } catch (error)
//         {
//             console.error('Error generating tasks:', error);
//             showToast('An error occurred while generating tasks.', 'error');
//         } finally
//         {
//             setIsLoading(false);
//         }
//     };

//     // Save API Key Change
//     const handleApiKeyChange = (e) => {
//         setState((prev) => ({ ...prev, apiKey: e.target.value }));
//     };

//     // Save API Key to Storage
//     const handleApiKeySave = () => {
//         if (typeof window !== 'undefined')
//         {
//             localStorage.setItem('quantumNexusApiKey', state.apiKey);
//             showToast('API key has been securely saved.', 'success');
//         }
//     };

//     // Handle Copy to Clipboard
//     const copyToClipboard = useCallback((text) => {
//         navigator.clipboard.writeText(text).then(
//             () => {
//                 showToast('Content copied to clipboard', 'success');
//             },
//             (err) => {
//                 showToast(`Could not copy content: ${err}`, 'error');
//             }
//         );
//     }, [showToast]);

//     // Delete Message
//     const deleteMessage = useCallback((messageId) => {
//         setState((prev) => ({
//             ...prev,
//             chats: prev.chats.map((chat) =>
//                 chat.id === prev.currentChatId
//                     ? {
//                         ...chat,
//                         messages: chat.messages.filter((msg) => msg.id !== messageId),
//                     }
//                     : chat
//             ),
//         }));
//         showToast('Message deleted successfully.', 'success');
//     }, [showToast, state.currentChatId]);

//     // Star/Unstar Message
//     const starMessage = useCallback((messageId) => {
//         setState((prev) => ({
//             ...prev,
//             chats: prev.chats.map((chat) =>
//                 chat.id === prev.currentChatId
//                     ? {
//                         ...chat,
//                         messages: chat.messages.map((msg) =>
//                             msg.id === messageId
//                                 ? { ...msg, starred: !msg.starred }
//                                 : msg
//                         ),
//                     }
//                     : chat
//             ),
//         }));
//         showToast('Message updated.', 'info');
//     }, [showToast, state.currentChatId]);

//     // Save Response
//     const saveResponse = useCallback((response, name) => {
//         const newResponse = {
//             name,
//             response: Array.isArray(response) ? response : [{ type: 'text', content: response }],
//         };
//         setState((prev) => ({
//             ...prev,
//             savedResponses: [...prev.savedResponses, newResponse],
//         }));
//         showToast(`Response "${name}" has been saved.`, 'success');
//     }, [showToast]);

//     // Delete Saved Response
//     const deleteSavedResponse = useCallback((index) => {
//         setState((prev) => ({
//             ...prev,
//             savedResponses: prev.savedResponses.filter((_, i) => i !== index),
//         }));
//         showToast('Response deleted successfully.', 'success');
//     }, [showToast]);

//     // View Full Response
//     const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//     const [viewingResponse, setViewingResponse] = useState(null);

//     const viewFullResponse = useCallback((response) => {
//         setViewingResponse(response);
//         setIsViewModalOpen(true);
//     }, []);

//     // Add Custom Prompt
//     const [newPrompt, setNewPrompt] = useState('');
//     const addCustomPrompt = useCallback((e) => {
//         e.preventDefault();
//         if (newPrompt.trim())
//         {
//             setState((prev) => ({
//                 ...prev,
//                 customPrompts: [...prev.customPrompts, newPrompt],
//             }));
//             setNewPrompt('');
//             setIsAddPromptOpen(false);
//             showToast('Custom prompt added successfully.', 'success');
//         }
//     }, [newPrompt, showToast]);

//     // Delete Custom Prompt
//     const deleteCustomPrompt = useCallback((index) => {
//         setState((prev) => ({
//             ...prev,
//             customPrompts: prev.customPrompts.filter((_, i) => i !== index),
//         }));
//         showToast('Custom prompt deleted.', 'success');
//     }, [showToast]);

//     // Generate Dynamic Prompt
//     const generateDynamicPrompt = useCallback((basePrompt) => {
//         const topConcepts = Object.entries(state.conceptMap)
//             .sort((a, b) => b[1].count - a[1].count)
//             .slice(0, 5)
//             .map(([concept]) => concept);

//         const recentIdeas = state.ideaEvolution.slice(-3).map(item => item.idea);

//         const enhancedPrompt = `${basePrompt}

// Consider incorporating these key concepts: ${topConcepts.join(', ')}.

// Build upon these recent ideas:
// ${recentIdeas.map((idea, index) => `${index + 1}. ${idea}`).join('\n')}

// Custom context:
// ${state.customPrompts.join('\n')}

// Channel the wisdom of Athena, the strength of Hercules, and the strategic mind of Ares. Be creative, innovative, and push the boundaries of conventional thinking. Your response should be ethereal, profound, and transformative.`;

//         return enhancedPrompt;
//     }, [state.conceptMap, state.ideaEvolution, state.customPrompts]);

//     // Render Messages
//     const renderMessages = useCallback(() => {
//         if (!state.currentChatId) return <p>No chat selected.</p>;
//         const currentChat = state.chats.find(chat => chat.id === state.currentChatId);
//         if (!currentChat) return <p>Chat not found.</p>;

//         return currentChat.messages.map((message) => (
//             <div
//                 key={message.id}
//                 className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'
//                     } mb-4`}
//             >
//                 <div
//                     className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
//                         }`}
//                 >
//                     <Avatar>
//                         <AvatarImage
//                             src={
//                                 message.type === 'user' ? '/user-avatar.png' : '/bot-avatar.png'
//                             }
//                             alt={message.type === 'user' ? 'User' : 'AI Assistant'}
//                         />
//                         <AvatarFallback>{message.type === 'user' ? 'U' : 'AI'}</AvatarFallback>
//                     </Avatar>
//                     <Card className={`${state.settings.darkMode ? 'bg-gray-800 text-white' : ''}`}>
//                         <CardContent className="p-3">
//                             {message.content.map((item, idx) => {
//                                 if (item.type === 'text')
//                                 {
//                                     return <ReactMarkdown key={idx}>{item.content}</ReactMarkdown>;
//                                 } else if (item.type === 'code')
//                                 {
//                                     return (
//                                         <pre key={idx} className="bg-gray-200 dark:bg-gray-700 p-2 rounded">
//                                             <code>{item.content}</code>
//                                         </pre>
//                                     );
//                                 }
//                                 return null;
//                             })}
//                         </CardContent>
//                         <CardFooter className="flex justify-between">
//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => copyToClipboard(
//                                     message.content.map(c => c.content).join(' ')
//                                 )}
//                             >
//                                 <Copy className="w-4 h-4 mr-2" />
//                                 Copy
//                             </Button>
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                     <Button variant="ghost" size="sm">
//                                         <Star
//                                             className={`w-4 h-4 mr-2 ${message.starred ? 'fill-yellow-400' : 'stroke-current'
//                                                 }`}
//                                         />
//                                         {message.starred ? 'Unstar' : 'Star'}
//                                     </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent>
//                                     <DropdownMenuItem onSelect={() => starMessage(message.id)}>
//                                         {message.starred ? 'Unstar' : 'Star'} Message
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem onSelect={() => deleteMessage(message.id)}>
//                                         Delete Message
//                                     </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                         </CardFooter>
//                     </Card>
//                 </div>
//             </div>
//         ));
//     }, [
//         state.currentChatId,
//         state.chats,
//         state.settings.darkMode,
//         copyToClipboard,
//         deleteMessage,
//         starMessage,
//     ]);

//     // Render Current View
//     const renderCurrentView = () => {
//         switch (currentView)
//         {
//             case 'chat':
//                 return (
//                     <div className={`transition-all duration-300 ${isChatCollapsed ? 'h-16' : 'h-full'}`}>
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-2xl font-bold text-primary">Chat</h2>
//                             <Button onClick={() => setIsChatCollapsed(!isChatCollapsed)} variant="ghost" size="sm">
//                                 {isChatCollapsed ? <ChevronRight /> : <ChevronLeft />}
//                             </Button>
//                         </div>
//                         {!isChatCollapsed && (
//                             <div className="space-y-4">
//                                 {renderMessages()}
//                             </div>
//                         )}
//                     </div>
//                 );
//             case 'workflow':
//                 return <WorkflowBuilder tasks={state.tasks} setState={setState} />;
//             case 'fileUpload':
//                 return <FileUploader processDocuments={processDocuments} />;
//             case 'tooling':
//                 return (
//                     <ToolingConfiguration
//                         state={state}
//                         setState={setState}
//                         saveApiKey={saveApiKey}
//                         setSystemPrompt={setSystemPrompt}
//                         resetSettings={resetSettings}
//                     />
//                 );
//             case 'tasks':
//                 return (
//                     <div>
//                         <h2 className="text-2xl font-bold mb-4 text-blue-400">Tasks</h2>
//                         {state.tasks.map((task, index) => (
//                             <TaskCard
//                                 key={task.id}
//                                 task={task}
//                                 index={index}
//                                 updateTask={updateTask}
//                                 removeTask={removeTask}
//                                 isExpanded={expandedTaskIndex === index}
//                                 toggleExpand={toggleTaskExpand}
//                                 moveTask={moveTask}
//                                 users={state.users}
//                                 allTasks={state.tasks}
//                             />
//                         ))}
//                         <Button
//                             onClick={addTask}
//                             className="w-full bg-blue-600 text-white px-6 py-3 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 shadow-lg"
//                         >
//                             <Plus size={24} className="mr-2" />
//                             Add New Task
//                         </Button>
//                     </div>
//                 );
//             case 'settings':
//                 return (
//                     <SettingsPanel
//                         state={state}
//                         setState={setState}
//                         availableModels={availableModels}
//                         resetSettings={resetSettings}
//                         saveApiKey={saveApiKey}
//                         setSystemPrompt={setSystemPrompt}
//                     />
//                 );
//             case 'projectManagement':
//                 return (
//                     <ProjectManagement
//                         state={state}
//                         setState={setState}
//                         handleMethodologyChange={handleMethodologyChange}
//                         addIntegration={addIntegration}
//                         generateTasks={generateTasks}
//                         saveProject={saveProject}
//                         loadProject={loadProject}
//                         totalPoints={totalPoints}
//                         projectRisks={projectRisks}
//                     />
//                 );
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div
//             className={`flex h-screen w-full bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900 dark:to-indigo-950 transition-colors duration-300`}
//         >
//             {/* Sidebar */}
//             <aside
//                 className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'
//                     }`}
//             >
//                 <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//                     {isSidebarExpanded ? (
//                         <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                             Quantum Nexus
//                         </h1>
//                     ) : (
//                         <Button variant="ghost" size="icon" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
//                             <ChevronRight className="h-6 w-6" />
//                         </Button>
//                     )}
//                 </div>
//                 <ScrollArea className="flex-1 p-4">
//                     <nav className="space-y-2">
//                         <Button
//                             variant={currentView === 'chat' ? 'secondary' : 'ghost'}
//                             size="sm"
//                             onClick={() => setCurrentView('chat')}
//                             className="w-full justify-start mb-2"
//                         >
//                             <MessageSquare className="mr-2 h-4 w-4" />
//                             {isSidebarExpanded ? 'Chat' : ''}
//                         </Button>
//                         <Button
//                             variant={currentView === 'workflow' ? 'secondary' : 'ghost'}
//                             size="sm"
//                             onClick={() => setCurrentView('workflow')}
//                             className="w-full justify-start mb-2"
//                         >
//                             <Workflow className="mr-2 h-4 w-4" />
//                             {isSidebarExpanded ? 'Workflow' : ''}
//                         </Button>
//                         <Button
//                             variant={currentView === 'fileUpload' ? 'secondary' : 'ghost'}
//                             size="sm"
//                             onClick={() => setCurrentView('fileUpload')}
//                             className="w-full justify-start mb-2"
//                         >
//                             <FileUp className="mr-2 h-4 w-4" />
//                             {isSidebarExpanded ? 'File Upload' : ''}
//                         </Button>
//                         <Button
//                             variant={currentView === 'tooling' ? 'secondary' : 'ghost'}
//                             size="sm"
//                             onClick={() => setCurrentView('tooling')}
//                             className="w-full justify-start mb-2"
//                         >
//                             <Wrench className="mr-2 h-4 w-4" />
//                             {isSidebarExpanded ? 'Tooling' : ''}
//                         </Button>
//                         <Button
//                             variant={currentView === 'tasks' ? 'secondary' : 'ghost'}
//                             size="sm"
//                             onClick={() => setCurrentView('tasks')}
//                             className="w-full justify-start mb-2"
//                         >
//                             <Code className="mr-2 h-4 w-4" />
//                             {isSidebarExpanded ? 'Tasks' : ''}
//                         </Button>
//                         <Button
//                             variant={currentView === 'projectManagement' ? 'secondary' : 'ghost'}
//                             size="sm"
//                             onClick={() => setCurrentView('projectManagement')}
//                             className="w-full justify-start mb-2"
//                         >
//                             <GearIcon className="mr-2 h-4 w-4" />
//                             {isSidebarExpanded ? 'Project Management' : ''}
//                         </Button>
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={toggleDarkMode}
//                             className="w-full justify-start"
//                         >
//                             {state.settings.darkMode ? (
//                                 <Sun className="mr-2 h-4 w-4" />
//                             ) : (
//                                 <Moon className="mr-2 h-4 w-4" />
//                             )}
//                             {isSidebarExpanded
//                                 ? state.settings.darkMode
//                                     ? 'Light Mode'
//                                     : 'Dark Mode'
//                                 : ''}
//                         </Button>
//                     </nav>
//                 </ScrollArea>
//                 <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => setCurrentView('settings')}
//                         className={`w-full justify-start mb-2 ${currentView === 'settings' ? 'bg-primary/10' : ''
//                             }`}
//                     >
//                         <Settings2 className="mr-2 h-4 w-4" />
//                         {isSidebarExpanded ? 'Settings' : ''}
//                     </Button>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={toggleDarkMode}
//                         className="w-full justify-start"
//                     >
//                         {state.settings.darkMode ? (
//                             <Sun className="mr-2 h-4 w-4" />
//                         ) : (
//                             <Moon className="mr-2 h-4 w-4" />
//                         )}
//                         {isSidebarExpanded
//                             ? state.settings.darkMode
//                                 ? 'Light Mode'
//                                 : 'Dark Mode'
//                             : ''}
//                     </Button>
//                 </div>
//             </aside>

//             {/* Main Content */}
//             <main className="flex-1 flex flex-col overflow-hidden">
//                 {/* Header */}
//                 <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
//                     <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                         Quantum Nexus
//                     </h1>
//                     <div className="flex items-center space-x-2">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setShowAdvanced(true)}
//                             className="flex items-center"
//                         >
//                             <Settings2 className="h-4 w-4 mr-2" />
//                             Advanced Settings
//                         </Button>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={clearChat}
//                             className="flex items-center"
//                         >
//                             <Trash2 className="h-4 w-4 mr-2" />
//                             Clear Chat
//                         </Button>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={downloadChatTranscript}
//                             className="flex items-center"
//                         >
//                             <Download className="h-4 w-4 mr-2" />
//                             Download Transcript
//                         </Button>
//                     </div>
//                 </header>

//                 {/* Chat and Sidebar */}
//                 <div className="flex-1 overflow-hidden flex">
//                     {/* Main Chat Area */}
//                     <div className="flex-1 flex flex-col">
//                         <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
//                             {renderCurrentView()}
//                         </ScrollArea>

//                         {/* Input Area */}
//                         <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
//                             <form onSubmit={handleSubmit} className="space-y-4">
//                                 <div className="flex space-x-2">
//                                     <Button
//                                         type="button"
//                                         variant={inputMode === 'text' ? 'secondary' : 'outline'}
//                                         onClick={() => setInputMode('text')}
//                                     >
//                                         Text
//                                     </Button>
//                                     <Button
//                                         type="button"
//                                         variant={inputMode === 'code' ? 'secondary' : 'outline'}
//                                         onClick={() => setInputMode('code')}
//                                     >
//                                         Code
//                                     </Button>
//                                 </div>
//                                 {inputMode === 'text' ? (
//                                     <Textarea
//                                         value={textInput}
//                                         onChange={(e) => setTextInput(e.target.value)}
//                                         placeholder="Type your message..."
//                                         rows={3}
//                                         className="w-full p-2 border rounded"
//                                     />
//                                 ) : (
//                                     <Textarea
//                                         value={codeInput}
//                                         onChange={(e) => setCodeInput(e.target.value)}
//                                         placeholder="Enter your code..."
//                                         rows={5}
//                                         className="w-full p-2 border rounded font-mono"
//                                     />
//                                 )}
//                                 <div className="flex justify-between items-center">
//                                     <div className="flex space-x-2">
//                                         <Button
//                                             type="button"
//                                             variant="outline"
//                                             onClick={() => appendContentType('code')}
//                                             className="flex items-center"
//                                         >
//                                             <Code className="h-4 w-4 mr-2" />
//                                             Code Block
//                                         </Button>
//                                         <Button
//                                             type="button"
//                                             variant="outline"
//                                             onClick={startVoiceInput}
//                                             className="flex items-center"
//                                         >
//                                             <Mic className="h-4 w-4 mr-2" />
//                                             Voice Input
//                                         </Button>
//                                         <label htmlFor="file-upload">
//                                             <Button as="span" variant="outline" className="flex items-center">
//                                                 <Paperclip className="h-4 w-4 mr-2" />
//                                                 Attach
//                                             </Button>
//                                         </label>
//                                         <input
//                                             type="file"
//                                             id="file-upload"
//                                             className="hidden"
//                                             onChange={(e) => {
//                                                 // Handle file upload logic here
//                                                 console.log(e.target.files);
//                                             }}
//                                         />
//                                     </div>
//                                     <Button type="submit" disabled={isLoading} className="flex items-center">
//                                         {isLoading ? (
//                                             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                         ) : (
//                                             <Send className="h-4 w-4 mr-2" />
//                                         )}
//                                         {isLoading ? 'Sending...' : 'Send'}
//                                     </Button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>

//                     {/* Project Management Sidebar */}
//                     <aside className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
//                         <h2 className="text-2xl font-bold mb-4 text-primary">Project Management</h2>
//                         <div className="space-y-4">
//                             {/* Project Name */}
//                             <div>
//                                 <Label htmlFor="project-name">Project Name</Label>
//                                 <Input
//                                     id="project-name"
//                                     value={state.projectName}
//                                     onChange={(e) =>
//                                         setState((prev) => ({ ...prev, projectName: e.target.value }))
//                                     }
//                                     placeholder="Enter project name"
//                                 />
//                             </div>

//                             {/* Methodology */}
//                             <div>
//                                 <Label>Methodology</Label>
//                                 <Select
//                                     value={state.projectMethodology}
//                                     onValueChange={handleMethodologyChange}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select methodology" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="agile">Agile</SelectItem>
//                                         <SelectItem value="waterfall">Waterfall</SelectItem>
//                                         <SelectItem value="kanban">Kanban</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             {/* Integrations */}
//                             <div>
//                                 <Label>Integrations</Label>
//                                 <Select onValueChange={addIntegration}>
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Add integration" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="github">GitHub</SelectItem>
//                                         <SelectItem value="jira">Jira</SelectItem>
//                                         <SelectItem value="slack">Slack</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             {/* GPT Prompt for Task Generation */}
//                             <div>
//                                 <Label htmlFor="gpt-prompt">GPT Prompt for Task Generation</Label>
//                                 <Textarea
//                                     id="gpt-prompt"
//                                     value={state.gptPrompt}
//                                     onChange={(e) =>
//                                         setState((prev) => ({ ...prev, gptPrompt: e.target.value }))
//                                     }
//                                     placeholder="Describe your project to generate tasks..."
//                                     rows={3}
//                                 />
//                                 <Button onClick={generateTasks} className="mt-2" disabled={isLoading}>
//                                     {isLoading ? 'Generating...' : 'Generate Tasks'}
//                                 </Button>
//                             </div>

//                             {/* Save and Load Project */}
//                             <div className="flex space-x-2">
//                                 <Button onClick={saveProject} variant="outline">
//                                     Save Project
//                                 </Button>
//                                 <label htmlFor="load-project">
//                                     <Button as="span" variant="outline">
//                                         Load Project
//                                     </Button>
//                                 </label>
//                                 <input
//                                     id="load-project"
//                                     type="file"
//                                     accept=".json"
//                                     onChange={loadProject}
//                                     className="hidden"
//                                 />
//                             </div>

//                             {/* Project Stats */}
//                             <div>
//                                 <h3 className="text-lg font-semibold mb-2">Project Stats</h3>
//                                 <p>Total Tasks: {state.tasks.length}</p>
//                                 <p>Total Points: {totalPoints}</p>
//                             </div>

//                             {/* Project Risks */}
//                             <div>
//                                 <h3 className="text-lg font-semibold mb-2">Project Risks</h3>
//                                 {projectRisks.map((risk, index) => (
//                                     <Badge key={index} variant="destructive" className="mr-2 mb-2">
//                                         {risk.type}
//                                     </Badge>
//                                 ))}
//                             </div>
//                         </div>
//                     </aside>
//                 </div>

//                 {/* Advanced Settings Drawer */}
//                 <Drawer open={showAdvanced} onOpenChange={setShowAdvanced}>
//                     <DrawerContent>
//                         <DrawerHeader>
//                             <DrawerTitle>Advanced Settings</DrawerTitle>
//                             <DrawerDescription>Configure your chat and project experience</DrawerDescription>
//                         </DrawerHeader>
//                         <div className="p-4 space-y-4">
//                             {/* API Selection */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="api-select">API</Label>
//                                 <Select
//                                     value={state.settings.api}
//                                     onValueChange={(value) =>
//                                         setState((prev) => ({
//                                             ...prev,
//                                             settings: { ...prev.settings, api: value },
//                                         }))
//                                     }
//                                 >
//                                     <SelectTrigger id="api-select">
//                                         <SelectValue placeholder="Select API" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="ollama">Ollama</SelectItem>
//                                         <SelectItem value="groq">GROQ</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             {/* Model Selection */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="model-select">Model</Label>
//                                 <Select
//                                     value={state.settings.model}
//                                     onValueChange={(value) =>
//                                         setState((prev) => ({
//                                             ...prev,
//                                             settings: { ...prev.settings, model: value },
//                                         }))
//                                     }
//                                 >
//                                     <SelectTrigger id="model-select">
//                                         <SelectValue placeholder="Select Model" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {availableModels[state.settings.api].map((model) => (
//                                             <SelectItem key={model.value} value={model.value}>
//                                                 {model.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             {/* Temperature Slider */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="temperature">
//                                     Temperature: {state.settings.temperature}
//                                 </Label>
//                                 <Slider
//                                     id="temperature"
//                                     min={0}
//                                     max={1}
//                                     step={0.1}
//                                     value={[state.settings.temperature]}
//                                     onValueChange={(value) =>
//                                         setState((prev) => ({
//                                             ...prev,
//                                             settings: { ...prev.settings, temperature: value[0] },
//                                         }))
//                                     }
//                                 />
//                             </div>

//                             {/* Max Tokens Slider */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="max-tokens">
//                                     Max Tokens: {state.settings.maxTokens}
//                                 </Label>
//                                 <Slider
//                                     id="max-tokens"
//                                     min={1}
//                                     max={4096}
//                                     step={1}
//                                     value={[state.settings.maxTokens]}
//                                     onValueChange={(value) =>
//                                         setState((prev) => ({
//                                             ...prev,
//                                             settings: { ...prev.settings, maxTokens: value[0] },
//                                         }))
//                                     }
//                                 />
//                             </div>

//                             {/* Stream Responses Switch */}
//                             <div className="flex items-center space-x-2">
//                                 <Switch
//                                     id="stream"
//                                     checked={state.settings.stream}
//                                     onCheckedChange={(checked) =>
//                                         setState((prev) => ({
//                                             ...prev,
//                                             settings: { ...prev.settings, stream: checked },
//                                         }))
//                                     }
//                                 />
//                                 <Label htmlFor="stream">Stream Responses</Label>
//                             </div>

//                             {/* System Prompt Textarea */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="system-prompt">System Prompt</Label>
//                                 <Textarea
//                                     id="system-prompt"
//                                     value={state.systemPrompt}
//                                     onChange={(e) => setSystemPrompt(e.target.value)}
//                                     placeholder="Enter system prompt..."
//                                     rows={3}
//                                 />
//                             </div>

//                             {/* GROQ API Key Input */}
//                             {state.settings.api === 'groq' && (
//                                 <div className="space-y-2">
//                                     <Label htmlFor="api-key">GROQ API Key</Label>
//                                     <Input
//                                         id="api-key"
//                                         type="password"
//                                         value={state.apiKey}
//                                         onChange={(e) => saveApiKey(e.target.value)}
//                                         placeholder="Enter your GROQ API key"
//                                     />
//                                 </div>
//                             )}

//                             {/* Reset Settings Button */}
//                             <Button onClick={resetSettings} variant="outline">
//                                 Reset to Defaults
//                             </Button>
//                         </div>
//                     </DrawerContent>
//                 </Drawer>

//                 {/* Modal for Viewing Full Responses */}
//                 {isViewModalOpen && viewingResponse && (
//                     <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
//                         <DialogContent>
//                             <DialogHeader>
//                                 <DialogTitle>{viewingResponse.name}</DialogTitle>
//                                 <DialogDescription>
//                                     View the full content of this saved response.
//                                 </DialogDescription>
//                             </DialogHeader>
//                             <div className="mt-4">
//                                 {Array.isArray(viewingResponse.response) ? (
//                                     viewingResponse.response.map((item, idx) => (
//                                         <div key={idx} className="mb-2">
//                                             <h5 className="font-semibold">{item.type.toUpperCase()}</h5>
//                                             <p>{item.content}</p>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p>{viewingResponse.response}</p>
//                                 )}
//                             </div>
//                         </DialogContent>
//                     </Dialog>
//                 )}

//                 {/* Toaster for Notifications */}
//                 <Toaster />
//             </main>
//         </div>
//     );
// };

// const TaskCard = ({
//     task,
//     index,
//     updateTask,
//     removeTask,
//     isExpanded,
//     toggleExpand,
//     moveTask,
//     users,
//     allTasks,
// }) => {
//     const [localTask, setLocalTask] = useState(task);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setLocalTask((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSave = () => {
//         updateTask(index, localTask);
//         toggleExpand(index);
//     };

//     const handleMoveUp = () => {
//         if (index > 0) moveTask(index, index - 1);
//     };

//     const handleMoveDown = () => {
//         if (index < allTasks.length - 1) moveTask(index, index + 1);
//     };

//     return (
//         <Card className="mb-4 overflow-hidden">
//             <CardContent className="p-4">
//                 <div className="flex justify-between items-center">
//                     <h3 className="text-lg font-semibold">
//                         {task.title || 'New Task'}
//                     </h3>
//                     <div className="flex space-x-2">
//                         <Button variant="ghost" size="sm" onClick={() => toggleExpand(index)}>
//                             {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
//                         </Button>
//                         <Button variant="ghost" size="sm" onClick={handleMoveUp}>
//                             <ChevronLeft size={16} />
//                         </Button>
//                         <Button variant="ghost" size="sm" onClick={handleMoveDown}>
//                             <ChevronRight size={16} />
//                         </Button>
//                     </div>
//                 </div>
//                 {isExpanded && (
//                     <div className="mt-4 space-y-4">
//                         <div>
//                             <Label htmlFor={`title-${task.id}`}>Title</Label>
//                             <Input
//                                 id={`title-${task.id}`}
//                                 name="title"
//                                 value={localTask.title}
//                                 onChange={handleChange}
//                                 placeholder="Task title"
//                             />
//                         </div>
//                         <div>
//                             <Label htmlFor={`description-${task.id}`}>Description</Label>
//                             <Textarea
//                                 id={`description-${task.id}`}
//                                 name="description"
//                                 value={localTask.description}
//                                 onChange={handleChange}
//                                 placeholder="Task description"
//                                 rows={3}
//                             />
//                         </div>
//                         <div className="flex space-x-4">
//                             <div className="flex-1">
//                                 <Label htmlFor={`type-${task.id}`}>Type</Label>
//                                 <Select
//                                     value={localTask.type}
//                                     onValueChange={(value) =>
//                                         setLocalTask((prev) => ({ ...prev, type: value }))
//                                     }
//                                 >
//                                     <SelectTrigger id={`type-${task.id}`}>
//                                         <SelectValue placeholder="Select type" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {taskTypes.map((type) => (
//                                             <SelectItem key={type.value} value={type.value}>
//                                                 {type.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div className="flex-1">
//                                 <Label htmlFor={`points-${task.id}`}>Points</Label>
//                                 <Input
//                                     id={`points-${task.id}`}
//                                     name="points"
//                                     type="number"
//                                     value={localTask.points}
//                                     onChange={handleChange}
//                                     min={0}
//                                 />
//                             </div>
//                         </div>
//                         <div>
//                             <Label htmlFor={`dueDate-${task.id}`}>Due Date</Label>
//                             <Input
//                                 id={`dueDate-${task.id}`}
//                                 name="dueDate"
//                                 type="date"
//                                 value={localTask.dueDate}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         <div>
//                             <Label htmlFor={`assignedTo-${task.id}`}>Assigned To</Label>
//                             <Select
//                                 value={localTask.assignedTo}
//                                 onValueChange={(value) =>
//                                     setLocalTask((prev) => ({ ...prev, assignedTo: value }))
//                                 }
//                             >
//                                 <SelectTrigger id={`assignedTo-${task.id}`}>
//                                     <SelectValue placeholder="Assign to..." />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {users.map((user) => (
//                                         <SelectItem key={user.id} value={user.id}>
//                                             {user.name}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div>
//                             <Label htmlFor={`requiredSkills-${task.id}`}>Required Skills</Label>
//                             <Input
//                                 id={`requiredSkills-${task.id}`}
//                                 name="requiredSkills"
//                                 value={localTask.requiredSkills.join(', ')}
//                                 onChange={(e) => setLocalTask(prev => ({
//                                     ...prev,
//                                     requiredSkills: e.target.value.split(',').map(skill => skill.trim())
//                                 }))}
//                                 placeholder="Enter skills separated by commas"
//                             />
//                         </div>
//                         <div>
//                             <Label htmlFor={`estimatedEffort-${task.id}`}>Estimated Effort (hours)</Label>
//                             <Input
//                                 id={`estimatedEffort-${task.id}`}
//                                 name="estimatedEffort"
//                                 type="number"
//                                 value={localTask.estimatedEffort}
//                                 onChange={handleChange}
//                                 min={0}
//                             />
//                         </div>
//                         <div className="flex items-center space-x-2">
//                             <Checkbox
//                                 id={`fileUploadRequired-${task.id}`}
//                                 checked={localTask.fileUploadRequired}
//                                 onCheckedChange={(checked) =>
//                                     setLocalTask((prev) => ({ ...prev, fileUploadRequired: checked }))
//                                 }
//                             />
//                             <Label htmlFor={`fileUploadRequired-${task.id}`}>File Upload Required</Label>
//                         </div>
//                         <div className="flex justify-end space-x-2">
//                             <Button variant="outline" onClick={() => removeTask(index)}>
//                                 Delete
//                             </Button>
//                             <Button onClick={handleSave}>Save</Button>
//                         </div>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     );
// };

// // SettingsPanel Component
// const SettingsPanel = ({
//     state,
//     setState,
//     availableModels,
//     resetSettings,
//     saveApiKey,
//     setSystemPrompt,
// }) => {
//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Settings</h2>
//             <div className="space-y-4">
//                 <div>
//                     <Label htmlFor="api-select">API</Label>
//                     <Select
//                         value={state.settings.api}
//                         onValueChange={(value) =>
//                             setState((prev) => ({
//                                 ...prev,
//                                 settings: { ...prev.settings, api: value },
//                             }))
//                         }
//                     >
//                         <SelectTrigger id="api-select">
//                             <SelectValue placeholder="Select API" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="ollama">Ollama</SelectItem>
//                             <SelectItem value="groq">GROQ</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>
//                 <div>
//                     <Label htmlFor="model-select">Model</Label>
//                     <Select
//                         value={state.settings.model}
//                         onValueChange={(value) =>
//                             setState((prev) => ({
//                                 ...prev,
//                                 settings: { ...prev.settings, model: value },
//                             }))
//                         }
//                     >
//                         <SelectTrigger id="model-select">
//                             <SelectValue placeholder="Select Model" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {availableModels[state.settings.api].map((model) => (
//                                 <SelectItem key={model.value} value={model.value}>
//                                     {model.label}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>
//                 <div>
//                     <Label htmlFor="temperature">Temperature: {state.settings.temperature}</Label>
//                     <Slider
//                         id="temperature"
//                         min={0}
//                         max={1}
//                         step={0.1}
//                         value={[state.settings.temperature]}
//                         onValueChange={(value) =>
//                             setState((prev) => ({
//                                 ...prev,
//                                 settings: { ...prev.settings, temperature: value[0] },
//                             }))
//                         }
//                     />
//                 </div>
//                 <div>
//                     <Label htmlFor="max-tokens">Max Tokens: {state.settings.maxTokens}</Label>
//                     <Slider
//                         id="max-tokens"
//                         min={1}
//                         max={4096}
//                         step={1}
//                         value={[state.settings.maxTokens]}
//                         onValueChange={(value) =>
//                             setState((prev) => ({
//                                 ...prev,
//                                 settings: { ...prev.settings, maxTokens: value[0] },
//                             }))
//                         }
//                     />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                     <Switch
//                         id="stream"
//                         checked={state.settings.stream}
//                         onCheckedChange={(checked) =>
//                             setState((prev) => ({
//                                 ...prev,
//                                 settings: { ...prev.settings, stream: checked },
//                             }))
//                         }
//                     />
//                     <Label htmlFor="stream">Stream Responses</Label>
//                 </div>
//                 <div>
//                     <Label htmlFor="system-prompt">System Prompt</Label>
//                     <Textarea
//                         id="system-prompt"
//                         value={state.systemPrompt}
//                         onChange={(e) => setSystemPrompt(e.target.value)}
//                         placeholder="Enter system prompt..."
//                         rows={3}
//                     />
//                 </div>
//                 {state.settings.api === 'groq' && (
//                     <div>
//                         <Label htmlFor="api-key">GROQ API Key</Label>
//                         <Input
//                             id="api-key"
//                             type="password"
//                             value={state.apiKey}
//                             onChange={(e) => saveApiKey(e.target.value)}
//                             placeholder="Enter your GROQ API key"
//                         />
//                     </div>
//                 )}
//                 <Button onClick={resetSettings} variant="outline">
//                     Reset to Defaults
//                 </Button>
//             </div>
//         </div>
//     );
// };

// // ProjectManagement Component
// const ProjectManagement = ({
//     state,
//     setState,
//     handleMethodologyChange,
//     addIntegration,
//     generateTasks,
//     saveProject,
//     loadProject,
//     totalPoints,
//     projectRisks,
// }) => {
//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Project Management</h2>
//             <div className="space-y-4">
//                 <div>
//                     <Label htmlFor="project-name">Project Name</Label>
//                     <Input
//                         id="project-name"
//                         value={state.projectName}
//                         onChange={(e) =>
//                             setState((prev) => ({ ...prev, projectName: e.target.value }))
//                         }
//                         placeholder="Enter project name"
//                     />
//                 </div>
//                 <div>
//                     <Label>Methodology</Label>
//                     <Select
//                         value={state.projectMethodology}
//                         onValueChange={handleMethodologyChange}
//                     >
//                         <SelectTrigger>
//                             <SelectValue placeholder="Select methodology" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="agile">Agile</SelectItem>
//                             <SelectItem value="waterfall">Waterfall</SelectItem>
//                             <SelectItem value="kanban">Kanban</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>
//                 <div>
//                     <Label>Integrations</Label>
//                     <Select onValueChange={addIntegration}>
//                         <SelectTrigger>
//                             <SelectValue placeholder="Add integration" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="github">GitHub</SelectItem>
//                             <SelectItem value="jira">Jira</SelectItem>
//                             <SelectItem value="slack">Slack</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>
//                 <div>
//                     <Label htmlFor="gpt-prompt">GPT Prompt for Task Generation</Label>
//                     <Textarea
//                         id="gpt-prompt"
//                         value={state.gptPrompt}
//                         onChange={(e) =>
//                             setState((prev) => ({ ...prev, gptPrompt: e.target.value }))
//                         }
//                         placeholder="Describe your project to generate tasks..."
//                         rows={3}
//                     />
//                     <Button onClick={generateTasks} className="mt-2">
//                         Generate Tasks
//                     </Button>
//                 </div>
//                 <div className="flex space-x-2">
//                     <Button onClick={saveProject} variant="outline">
//                         Save Project
//                     </Button>
//                     <label htmlFor="load-project">
//                         <Button as="span" variant="outline">
//                             Load Project
//                         </Button>
//                     </label>
//                     <input
//                         id="load-project"
//                         type="file"
//                         accept=".json"
//                         onChange={loadProject}
//                         className="hidden"
//                     />
//                 </div>
//                 <div>
//                     <h3 className="text-lg font-semibold mb-2">Project Stats</h3>
//                     <p>Total Tasks: {state.tasks.length}</p>
//                     <p>Total Points: {totalPoints}</p>
//                 </div>
//                 <div>
//                     <h3 className="text-lg font-semibold mb-2">Project Risks</h3>
//                     {projectRisks.map((risk, index) => (
//                         <Badge key={index} variant="destructive" className="mr-2 mb-2">
//                             {risk.type}
//                         </Badge>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default QuantumNexus;