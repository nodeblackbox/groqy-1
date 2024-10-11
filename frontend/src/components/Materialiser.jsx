"use client";
import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Send,
  ZapIcon,
  AtomIcon,
  BrainCircuitIcon,
  Link,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Pitchdeck_STATES = [
  "Superposition",
  "Entanglement",
  "Coherence",
  "Decoherence",
];

const steps = [
  { id: "idea", title: "Pitchdeck Idea Inception" },
  { id: "design", title: "Multiversal Design Synthesis" },
  { id: "extract", title: "Pitchdeck Information Extraction" },
  { id: "components", title: "Entangled Component Definition" },
  { id: "create", title: "Pitchdeck File Materialization" },
];

const NeomorphicContainer = ({ children, className = "" }) => (
  <div
    className={`bg-gray-900 rounded-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ${className}`}
  >
    {children}
  </div>
);

const AppDesigner = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [ngrokUrl, setNgrokUrl] = useState("");
  const [appIdea, setAppIdea] = useState("");
  const [appDesign, setAppDesign] = useState("");
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [components, setComponents] = useState([]);
  const [createdFiles, setCreatedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [rawResponse, setRawResponse] = useState("");
  const [PitchdeckState, setPitchdeckState] = useState(Pitchdeck_STATES[0]);

  useEffect(() => {
    // Retrieve the API key and ngrok URL from local storage when the component mounts
    const storedApiKey = localStorage.getItem("groqApiKey");
    const storedNgrokUrl = localStorage.getItem("ngrokUrl");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    if (storedNgrokUrl) {
      setNgrokUrl(storedNgrokUrl);
    }

    const interval = setInterval(() => {
      setPitchdeckState(
        Pitchdeck_STATES[Math.floor(Math.random() * Pitchdeck_STATES.length)]
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApiKeyChange = (e) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("groqApiKey", newApiKey);
  };

  const handleNgrokUrlChange = (e) => {
    const newNgrokUrl = e.target.value;
    setNgrokUrl(newNgrokUrl);
    localStorage.setItem("ngrokUrl", newNgrokUrl);
  };

  const processStep = async () => {
    setIsProcessing(true);
    setError(null);
    setRawResponse("");

    try {
      switch (steps[currentStep].id) {
        case "idea":
          await generateDesign();
          break;
        case "design":
          setCurrentStep((prev) => prev + 1);
          break;
        case "extract":
          await extractInformation();
          break;
        case "components":
          await defineComponentsAndPages();
          break;
        case "create":
          await createFiles();
          break;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateDesign = async () => {
    const prompt = `
            In the Pitchdeck realm of possibilities, materialize a detailed design specification based on this app idea:
            ${appIdea}

            Synthesize a coherent vision encompassing:
            1. Multidimensional app structure
            2. Pitchdeck features that transcend classical limitations
            3. User interface that bridges realities
            4. Styling and branding elements that resonate across dimensions

            Manifest this design specification in a structured, comprehensible format for our universe.
        `;

    const response = await callGroqAPI(prompt);
    setAppDesign(response);
    setCurrentStep((prev) => prev + 1);
  };

  const extractInformation = async () => {
    const prompt = `
            Pitchdeck-entangle with the following application design and extract categorized information into:
            1. Styling guide that adapts across realities
            2. Branding elements that maintain coherence in superposition
            3. Main features that exhibit Pitchdeck properties
            4. User interface layout that exists in multiple states simultaneously

            Application design:
            ${appDesign}

            Collapse this Pitchdeck information into a classical JSON format with these exact keys: 
            stylingGuide, brandingElements, mainFeatures, userInterfaceLayout.
        `;

    const response = await callGroqAPI(prompt);
    const validJsonResponse = await extractJsonFromResponse(response);

    try {
      const parsedResponse = JSON.parse(validJsonResponse);
      if (
        !parsedResponse.stylingGuide ||
        !parsedResponse.brandingElements ||
        !parsedResponse.mainFeatures ||
        !parsedResponse.userInterfaceLayout
      ) {
        throw new Error(
          "Pitchdeck decoherence detected in extracted information"
        );
      }
      setExtractedInfo(parsedResponse);
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      throw new Error(
        `Failed to observe extracted information: ${err.message}`
      );
    }
  };

  const defineComponentsAndPages = async () => {
    const prompt = `
            Based on the Pitchdeck-entangled information, define a superposition of React components and pages for a Next.js application that exists across multiple realities:

            ${JSON.stringify(extractedInfo, null, 2)}

            Collapse this superposition into a classical JSON array format, where each item is an object with 'name', 'type' (either 'component' or 'page'), and 'description' properties. Ensure these entities maintain Pitchdeck coherence in their classical representations.
        `;

    const response = await callGroqAPI(prompt);
    const validJsonResponse = await extractJsonFromResponse(response);

    try {
      const parsedResponse = JSON.parse(validJsonResponse);
      if (
        !Array.isArray(parsedResponse) ||
        !parsedResponse.every(
          (item) => item.name && item.type && item.description
        )
      ) {
        throw new Error(
          "Pitchdeck entanglement lost in component and page definition"
        );
      }
      setComponents(parsedResponse);
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      throw new Error(
        `Failed to materialize component and page list: ${err.message}`
      );
    }
  };

  const createFiles = async () => {
    const createdFilesArray = [];
    for (const item of components) {
      const prompt = `
                Manifest a React ${item.type} for Next.js named '${item.name}' based on this Pitchdeck description:
                ${item.description}

                Incorporate these multidimensional styling guidelines:
                ${extractedInfo.stylingGuide}

                Integrate these reality-transcending branding elements:
                ${extractedInfo.brandingElements}

                Ensure the ${item.type} maintains Pitchdeck coherence within this layout:
                ${extractedInfo.userInterfaceLayout}

                Provide only the ${item.type} code, formatted for direct input into a command-line interface.
            `;

      const code = await callGroqAPI(prompt);
      const fileName = `${item.name}${item.type === "page" ? "" : ".js"}`;
      const filePath =
        item.type === "page"
          ? `pages/${fileName}`
          : `src/components/${fileName}`;
      createdFilesArray.push({ name: fileName, path: filePath, code });

      // Create file using CLI command
      await executeCommand(
        `mkdir -p $(dirname "${filePath}") && echo '${code.replace(
          /'/g,
          "'\\''"
        )}' > "${filePath}"`
      );
    }

    // Create _app.js
    const appJsPrompt = `
            Materialize a _app.js file for a Next.js application that weaves together global styles and necessary Pitchdeck providers.
            Incorporate these multidimensional styling guidelines:
            ${extractedInfo.stylingGuide}

            Provide the _app.js code formatted for direct input into a command-line interface.
        `;

    const appJsCode = await callGroqAPI(appJsPrompt);
    createdFilesArray.push({
      name: "_app.js",
      path: "pages/_app.js",
      code: appJsCode,
    });
    await executeCommand(
      `echo '${appJsCode.replace(/'/g, "'\\''")}' > "pages/_app.js"`
    );

    setCreatedFiles(createdFilesArray);
  };

  const callGroqAPI = async (prompt) => {
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
          model: "llama-3.1-70b-versatile",
          temperature: 0.7,
          max_tokens: 5048,
          top_p: 1,
          stream: false,
          stop: null,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Pitchdeck fluctuation detected in Groq API communication"
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    setRawResponse(content);

    return content;
  };

  const extractJsonFromResponse = async (response) => {
    try {
      // First, try to match JSON within ```json blocks
      let jsonMatch = response.match(/```json\s*([\s\S]*?)```/);

      if (jsonMatch && jsonMatch[1]) {
        let jsonContent = jsonMatch[1].trim();
        // Validate and parse JSON
        JSON.parse(jsonContent);
        return jsonContent;
      }

      // If not found, try to find any JSON-like structure
      jsonMatch = response.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (jsonMatch) {
        let jsonContent = jsonMatch[0].trim();
        // Validate and parse JSON
        JSON.parse(jsonContent);
        return jsonContent;
      }

      throw new Error("No valid JSON content found in the response");
    } catch (error) {
      console.error("Failed to extract or parse JSON:", error);
      console.log("Raw response:", response);

      // Provide more detailed error message
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON syntax: ${error.message}`);
      } else if (error.message.includes("No valid JSON content found")) {
        throw new Error("No valid JSON structure detected in the response");
      } else {
        throw new Error(
          `Failed to extract JSON from response: ${error.message}`
        );
      }
    }
  };

  const executeCommand = async (command) => {
    try {
      const response = await fetch(`${ngrokUrl}/api/execute-command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error("Command execution failed in this reality");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      return data.output;
    } catch (error) {
      console.error("Pitchdeck disturbance in command execution:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-cyan-300 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-cyan-400 flex items-center justify-center">
        <ZapIcon size={32} className="mr-2" />
        Pitchdeck App Synthesizer
      </h1>

      <NeomorphicContainer className="p-6 mb-8">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <input
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter Groq API Key"
              className="w-full p-2 bg-gray-800 text-cyan-300 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="ml-4 flex items-center">
              <AtomIcon size={24} className="mr-2 text-purple-400" />
              <span className="text-purple-400">{PitchdeckState}</span>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={ngrokUrl}
              onChange={handleNgrokUrlChange}
              placeholder="Enter ngrok URL"
              className="w-full p-2 bg-gray-800 text-cyan-300 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <Link size={24} className="ml-2 text-cyan-400" />
          </div>
        </div>
      </NeomorphicContainer>

      <NeomorphicContainer className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-cyan-400 flex items-center">
          <BrainCircuitIcon size={24} className="mr-2" />
          {steps[currentStep].title}
        </h2>

        {steps[currentStep].id === "idea" && (
          <textarea
            value={appIdea}
            onChange={(e) => setAppIdea(e.target.value)}
            placeholder="Describe your Pitchdeck application idea here..."
            className="w-full h-40 p-2 bg-gray-800 text-cyan-300 border border-gray-700 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        )}

        {steps[currentStep].id === "design" && (
          <pre className="bg-gray-800 p-4 rounded overflow-x-auto mb-4 text-cyan-300">
            <code>{appDesign}</code>
          </pre>
        )}

        {steps[currentStep].id === "extract" && extractedInfo && (
          <pre className="bg-gray-800 p-4 rounded overflow-x-auto mb-4 text-cyan-300">
            <code>{JSON.stringify(extractedInfo, null, 2)}</code>
          </pre>
        )}

        {steps[currentStep].id === "components" && components.length > 0 && (
          <ul className="list-disc list-inside mb-4 text-cyan-300">
            {components.map((item, index) => (
              <li key={index}>
                {item.name} ({item.type}): {item.description}
              </li>
            ))}
          </ul>
        )}

        {steps[currentStep].id === "create" && createdFiles.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-cyan-400">
              Manifested Pitchdeck Files:
            </h3>
            {createdFiles.map((file, index) => (
              <details key={index} className="mb-4">
                <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300">
                  {file.path}
                </summary>
                <pre className="mt-2 p-4 bg-gray-800 rounded overflow-x-auto text-sm text-cyan-300">
                  <code>{file.code}</code>
                </pre>
              </details>
            ))}
          </div>
        )}

        <button
          onClick={processStep}
          disabled={
            isProcessing ||
            !apiKey ||
            (steps[currentStep].id === "idea" && !appIdea)
          }
          className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 disabled:opacity-50 transition-colors duration-200 shadow-lg shadow-cyan-500/50"
        >
          {isProcessing ? (
            <Loader2 className="animate-spin mr-2" />
          ) : currentStep === steps.length - 1 ? (
            <Send className="mr-2" />
          ) : (
            <ArrowRight className="mr-2" />
          )}
          {currentStep === steps.length - 1
            ? "Materialize Files"
            : "Collapse Next State"}
        </button>

        {error && (
          <Alert
            variant="destructive"
            className="mt-4 bg-red-900 border border-red-700 text-red-300"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Pitchdeck Anomaly Detected</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {rawResponse && (
          <div className="mt-4 bg-gray-800 p-4 rounded overflow-x-auto text-sm text-cyan-300">
            <h3 className="text-lg font-semibold mb-2 text-cyan-400">
              Pitchdeck Realm Response:
            </h3>
            <pre>{rawResponse}</pre>
          </div>
        )}
      </NeomorphicContainer>

      <NeomorphicContainer className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-2 text-cyan-400">
          Pitchdeck Execution Log
        </h3>
        <div className="bg-gray-800 p-4 rounded h-40 overflow-y-auto text-sm text-cyan-300">
          {createdFiles.map((file, index) => (
            <p key={index}>{`Materialized: ${file.path}`}</p>
          ))}
        </div>
      </NeomorphicContainer>

      <NeomorphicContainer className="p-6">
        <h3 className="text-lg font-semibold mb-2 text-cyan-400">
          Pitchdeck State Observer
        </h3>
        <div className="flex justify-between items-center">
          {Pitchdeck_STATES.map((state, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                PitchdeckState === state ? "bg-purple-600" : "bg-gray-800"
              }`}
            >
              {state}
            </div>
          ))}
        </div>
      </NeomorphicContainer>
    </div>
  );
};

const generatePitchdeckId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const PitchdeckEntangle = (obj1, obj2) => {
  return { ...obj1, ...obj2, entangled: true };
};

const PitchdeckObserve = (obj) => {
  if (obj.entangled) {
    delete obj.entangled;
    return { ...obj, observed: true };
  }
  return obj;
};

const PitchdeckEnhancedAppDesigner = () => {
  const baseDesigner = AppDesigner();
  const PitchdeckId = generatePitchdeckId();

  const enhancedProcessStep = async () => {
    const result = await baseDesigner.processStep();
    return PitchdeckObserve(PitchdeckEntangle(result, { PitchdeckId }));
  };

  return {
    ...baseDesigner,
    processStep: enhancedProcessStep,
    PitchdeckId,
  };
};

export default PitchdeckEnhancedAppDesigner;
