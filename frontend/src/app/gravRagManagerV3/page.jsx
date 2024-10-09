"use client";
import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  Search,
  Settings,
  Code,
  Database,
  Brain,
  Play,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Define action types for the reducer
const ACTION_TYPES = {
  SET_PROJECT_STRUCTURE: "SET_PROJECT_STRUCTURE",
  SET_SELECTED_FILE: "SET_SELECTED_FILE",
  SET_FILE_CONTENT: "SET_FILE_CONTENT",
  SET_ANALYSIS: "SET_ANALYSIS",
  SET_LLM_INSIGHTS: "SET_LLM_INSIGHTS",
  SET_COLLECTIONS: "SET_COLLECTIONS",
  SET_SELECTED_COLLECTION: "SET_SELECTED_COLLECTION",
  SET_QUERY_INPUT: "SET_QUERY_INPUT",
  SET_QUERY_RESULT: "SET_QUERY_RESULT",
  SET_IS_PROCESSING: "SET_IS_PROCESSING",
  SET_SETTINGS: "SET_SETTINGS",
};

// Initial state
const initialState = {
  projectStructure: {},
  selectedFile: null,
  fileContent: "",
  analysis: null,
  llmInsights: "",
  collections: [],
  selectedCollection: "",
  queryInput: "",
  queryResult: "",
  isProcessing: false,
  settings: {
    model: "llama-3.1-70b-versatile",
    maxTokens: 1000,
    temperature: 0.7,
    useCache: true,
  },
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_PROJECT_STRUCTURE:
      return { ...state, projectStructure: action.payload };
    case ACTION_TYPES.SET_SELECTED_FILE:
      return { ...state, selectedFile: action.payload };
    case ACTION_TYPES.SET_FILE_CONTENT:
      return { ...state, fileContent: action.payload };
    case ACTION_TYPES.SET_ANALYSIS:
      return { ...state, analysis: action.payload };
    case ACTION_TYPES.SET_LLM_INSIGHTS:
      return { ...state, llmInsights: action.payload };
    case ACTION_TYPES.SET_COLLECTIONS:
      return { ...state, collections: action.payload };
    case ACTION_TYPES.SET_SELECTED_COLLECTION:
      return { ...state, selectedCollection: action.payload };
    case ACTION_TYPES.SET_QUERY_INPUT:
      return { ...state, queryInput: action.payload };
    case ACTION_TYPES.SET_QUERY_RESULT:
      return { ...state, queryResult: action.payload };
    case ACTION_TYPES.SET_IS_PROCESSING:
      return { ...state, isProcessing: action.payload };
    case ACTION_TYPES.SET_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

export default function EnhancedComprehensiveUI() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchProjectStructure();
    fetchCollections();
  }, []);

  const fetchProjectStructure = async () => {
    try {
      const response = await fetch("/api/get-file-structure");
      const data = await response.json();
      dispatch({
        type: ACTION_TYPES.SET_PROJECT_STRUCTURE,
        payload: data.structure,
      });
    } catch (error) {
      console.error("Error fetching project structure:", error);
      toast({
        title: "Error",
        description: "Failed to fetch project structure",
        variant: "destructive",
      });
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch("/api/qdrant/collections");
      const data = await response.json();
      dispatch({
        type: ACTION_TYPES.SET_COLLECTIONS,
        payload: data.collections,
      });
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast({
        title: "Error",
        description: "Failed to fetch Qdrant collections",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (filePath) => {
    dispatch({ type: ACTION_TYPES.SET_SELECTED_FILE, payload: filePath });
    try {
      const response = await fetch("/api/get-file-contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: [filePath] }),
      });
      const data = await response.json();
      dispatch({
        type: ACTION_TYPES.SET_FILE_CONTENT,
        payload: data.fileContents[filePath],
      });
    } catch (error) {
      console.error("Error fetching file content:", error);
      toast({
        title: "Error",
        description: "Failed to fetch file content",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!state.selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to analyze",
        variant: "destructive",
      });
      return;
    }
    dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: true });
    try {
      const response = await fetch("/api/comprehensive-file-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: state.selectedFile }),
      });
      const data = await response.json();
      dispatch({ type: ACTION_TYPES.SET_ANALYSIS, payload: data });
    } catch (error) {
      console.error("Error analyzing file:", error);
      toast({
        title: "Error",
        description: "Failed to analyze file",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: false });
    }
  };

  const handleGetLLMInsights = async () => {
    if (!state.analysis) {
      toast({
        title: "Error",
        description: "Please analyze a file first",
        variant: "destructive",
      });
      return;
    }
    dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: true });
    try {
      const response = await fetch("/api/analyze-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Provide insights on the analyzed file",
          selectedItems: ["components", "functions", "imports"],
          knowledgeBase: JSON.stringify(state.analysis),
          promptType: "comprehensive",
          model: state.settings.model,
          maxTokens: state.settings.maxTokens,
          temperature: state.settings.temperature,
          useCache: state.settings.useCache,
        }),
      });
      const data = await response.json();
      dispatch({ type: ACTION_TYPES.SET_LLM_INSIGHTS, payload: data.markdown });
    } catch (error) {
      console.error("Error getting LLM insights:", error);
      toast({
        title: "Error",
        description: "Failed to get LLM insights",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: false });
    }
  };

  const handleCreateCollection = async (collectionName, vectorSize) => {
    try {
      const response = await fetch("/api/qdrant/create-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: collectionName, vectorSize }),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: `Collection "${collectionName}" created successfully`,
        });
        fetchCollections();
      } else {
        throw new Error("Failed to create collection");
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCollection = async (collectionName) => {
    try {
      const response = await fetch(
        `/api/qdrant/delete-collection/${collectionName}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast({
          title: "Success",
          description: `Collection "${collectionName}" deleted successfully`,
        });
        fetchCollections();
        if (state.selectedCollection === collectionName) {
          dispatch({ type: ACTION_TYPES.SET_SELECTED_COLLECTION, payload: "" });
        }
      } else {
        throw new Error("Failed to delete collection");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "destructive",
      });
    }
  };

  const handleQuery = async () => {
    if (!state.selectedCollection || !state.queryInput) {
      toast({
        title: "Error",
        description: "Please select a collection and enter a query",
        variant: "destructive",
      });
      return;
    }
    dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: true });
    try {
      const response = await fetch("/api/qdrant/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: state.selectedCollection,
          query: state.queryInput,
        }),
      });
      const data = await response.json();
      dispatch({
        type: ACTION_TYPES.SET_QUERY_RESULT,
        payload: JSON.stringify(data, null, 2),
      });
    } catch (error) {
      console.error("Error querying collection:", error);
      toast({
        title: "Error",
        description: "Failed to query collection",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: ACTION_TYPES.SET_IS_PROCESSING, payload: false });
    }
  };

  const handleSaveFile = async () => {
    if (!state.selectedFile || !state.fileContent) {
      toast({
        title: "Error",
        description: "No file selected or no content to save",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch("/api/save-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: state.selectedFile,
          content: state.fileContent,
        }),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "File saved successfully",
        });
      } else {
        throw new Error("Failed to save file");
      }
    } catch (error) {
      console.error("Error saving file:", error);
      toast({
        title: "Error",
        description: "Failed to save file",
        variant: "destructive",
      });
    }
  };

  const renderFileTree = useCallback((structure, path = "") => {
    return Object.entries(structure).map(([key, value]) => {
      const fullPath = path ? `${path}/${key}` : key;
      const isFolder = typeof value === "object";
      return (
        <FileTreeItem
          key={fullPath}
          name={key}
          path={fullPath}
          isFolder={isFolder}
          onSelect={handleFileSelect}
        >
          {isFolder && renderFileTree(value, fullPath)}
        </FileTreeItem>
      );
    });
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar: File Explorer */}
      <div className="w-1/4 border-r p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Project Structure</h2>
          <Button variant="ghost" size="icon" onClick={fetchProjectStructure}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {renderFileTree(state.projectStructure)}
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-auto">
        <Tabs defaultValue="file-content">
          <TabsList className="mb-4">
            <TabsTrigger value="file-content">File Content</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="insights">LLM Insights</TabsTrigger>
            <TabsTrigger value="qdrant">Qdrant Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="file-content">
            <Card>
              <CardHeader>
                <CardTitle>
                  {state.selectedFile || "No file selected"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={state.fileContent}
                  onChange={(e) =>
                    dispatch({
                      type: ACTION_TYPES.SET_FILE_CONTENT,
                      payload: e.target.value,
                    })
                  }
                  className="font-mono h-[60vh]"
                />
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveFile}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Comprehensive insights about the selected file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={handleAnalyze} disabled={state.isProcessing}>
                    {state.isProcessing ? "Analyzing..." : "Analyze File"}
                  </Button>
                  {state.analysis && (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="file-info">
                        <AccordionTrigger>File Information</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <p>
                              <strong>File:</strong> {state.analysis.filePath}
                            </p>
                            <p>
                              <strong>Size:</strong> {state.analysis.fileSize}{" "}
                              bytes
                            </p>
                            <p>
                              <strong>Last Modified:</strong>{" "}
                              {new Date(
                                state.analysis.lastModified
                              ).toLocaleString()}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="code-structure">
                        <AccordionTrigger>Code Structure</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <p>
                              <strong>Functions:</strong>{" "}
                              {state.analysis.functions?.length || 0}
                            </p>
                            <p>
                              <strong>Classes:</strong>{" "}
                              {state.analysis.classes?.length || 0}
                            </p>
                            <p>
                              <strong>Imports:</strong>{" "}
                              {state.analysis.imports?.length || 0}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="complexity">
                        <AccordionTrigger>Complexity Metrics</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <p>
                              <strong>Cyclomatic Complexity:</strong>{" "}
                              {state.analysis.cyclomaticComplexity}
                            </p>
                            <p>
                              <strong>Maintainability Index:</strong>{" "}
                              {state.analysis.maintainabilityIndex}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="dependencies">
                        <AccordionTrigger>Dependencies</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-4">
                            {state.analysis.dependencies?.map((dep, index) => (
                              <li key={index}>{dep}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="raw-data">
                        <AccordionTrigger>Raw Analysis Data</AccordionTrigger>
                        <AccordionContent>
                          <pre className="bg-muted p-2 rounded-md overflow-auto max-h-[300px]">
                            <code>
                              {JSON.stringify(state.analysis, null, 2)}
                            </code>
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  onClick={() => {
                    /* Implement export functionality */
                  }}
                  disabled={!state.analysis}
                >
                  Export Analysis
                </Button>
                <Button
                  onClick={handleGetLLMInsights}
                  disabled={!state.analysis || state.isProcessing}
                >
                  Get LLM Insights
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>LLM Insights</CardTitle>
                <CardDescription>
                  AI-generated insights about your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={handleGetLLMInsights}
                    disabled={state.isProcessing || !state.analysis}
                  >
                    {state.isProcessing
                      ? "Generating Insights..."
                      : "Get LLM Insights"}
                  </Button>
                  {state.llmInsights && (
                    <div className="mt-4 prose max-w-none">
                      <div
                        dangerouslySetInnerHTML={{ __html: state.llmInsights }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    /* Implement save insights functionality */
                  }}
                  disabled={!state.llmInsights}
                >
                  Save Insights
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="qdrant">
            <Card>
              <CardHeader>
                <CardTitle>Qdrant Vector DB Management</CardTitle>
                <CardDescription>
                  Manage collections and perform queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Collections</h3>
                    <div className="flex space-x-2 mb-4">
                      <Select
                        value={state.selectedCollection}
                        onValueChange={(value) =>
                          dispatch({
                            type: ACTION_TYPES.SET_SELECTED_COLLECTION,
                            payload: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a collection" />
                        </SelectTrigger>
                        <SelectContent>
                          {state.collections.map((collection) => (
                            <SelectItem key={collection} value={collection}>
                              {collection}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Collection
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Collection</DialogTitle>
                            <DialogDescription>
                              Enter the details for the new Qdrant collection.
                            </DialogDescription>
                          </DialogHeader>
                          <CreateCollectionForm
                            onSubmit={handleCreateCollection}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleDeleteCollection(state.selectedCollection)
                        }
                        disabled={!state.selectedCollection}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Collection
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Query Collection
                    </h3>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Enter your query"
                        value={state.queryInput}
                        onChange={(e) =>
                          dispatch({
                            type: ACTION_TYPES.SET_QUERY_INPUT,
                            payload: e.target.value,
                          })
                        }
                      />
                      <Button
                        onClick={handleQuery}
                        disabled={state.isProcessing}
                      >
                        {state.isProcessing ? "Querying..." : "Query"}
                      </Button>
                    </div>
                    {state.queryResult && (
                      <div className="mt-4">
                        <h4 className="text-md font-semibold mb-2">
                          Query Results
                        </h4>
                        <pre className="bg-muted p-2 rounded-md overflow-auto max-h-[300px]">
                          <code>{state.queryResult}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Configure application settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="model">LLM Model</Label>
                    <Select
                      value={state.settings.model}
                      onValueChange={(value) =>
                        dispatch({
                          type: ACTION_TYPES.SET_SETTINGS,
                          payload: { model: value },
                        })
                      }
                    >
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select LLM model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="llama-3.1-70b-versatile">
                          LLaMA 3.1 70B Versatile
                        </SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="claude-2">Claude 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={state.settings.maxTokens}
                      onChange={(e) =>
                        dispatch({
                          type: ACTION_TYPES.SET_SETTINGS,
                          payload: { maxTokens: parseInt(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperature</Label>
                    <Slider
                      id="temperature"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[state.settings.temperature]}
                      onValueChange={(value) =>
                        dispatch({
                          type: ACTION_TYPES.SET_SETTINGS,
                          payload: { temperature: value[0] },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="useCache"
                      checked={state.settings.useCache}
                      onCheckedChange={(checked) =>
                        dispatch({
                          type: ACTION_TYPES.SET_SETTINGS,
                          payload: { useCache: checked },
                        })
                      }
                    />
                    <Label htmlFor="useCache">Use Cache</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    /* Implement save settings functionality */
                  }}
                >
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function FileTreeItem({ name, path, isFolder, onSelect, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isFolder ? (isOpen ? ChevronDown : ChevronRight) : File;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onSelect(path);
    }
  };

  return (
    <div>
      <div
        className="flex items-center py-1 px-2 hover:bg-accent rounded-md cursor-pointer"
        onClick={handleClick}
      >
        <Icon className="h-4 w-4 mr-2" />
        <span>{name}</span>
      </div>
      {isOpen && isFolder && <div className="pl-4">{children}</div>}
    </div>
  );
}

function CreateCollectionForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [vectorSize, setVectorSize] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, parseInt(vectorSize, 10));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Collection Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="vectorSize">Vector Size</Label>
          <Input
            id="vectorSize"
            type="number"
            value={vectorSize}
            onChange={(e) => setVectorSize(e.target.value)}
            required
          />
        </div>
      </div>
      <DialogFooter className="mt-4">
        <Button type="submit">Create Collection</Button>
      </DialogFooter>
    </form>
  );
}
