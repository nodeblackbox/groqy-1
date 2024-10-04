'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
    Search,
    Mic,
    Settings,
    ChevronRight,
    ChevronDown,
    BarChart2,
    Send,
    Home,
    Folder,
    CheckSquare,
    User,
    HelpCircle,
    Zap,
    Bell,
    ArrowDown,
} from 'lucide-react';


import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

// BentoBox Component
const BentoBox = ({ children, className = '' }) => (
    <div className={`bg-gray-800 rounded-xl p-4 shadow-lg ${className}`}>
        {children}
    </div>
);

// Audio Visualization Component
const AudioVisualization = () => {
    const canvasRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (isRecording)
            {
                for (let i = 0; i < 5; i++)
                {
                    const height = Math.random() * 50 + 10;
                    ctx.fillStyle = `rgb(${255 - i * 40}, 100, 255)`;
                    ctx.fillRect(i * 20, canvas.height - height, 10, height);
                }
            } else
            {
                ctx.fillStyle = 'rgb(100, 100, 100)';
                ctx.fillRect(0, canvas.height - 10, canvas.width, 2);
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isRecording]);

    return (
        <div className="relative">
            <canvas ref={canvasRef} width={100} height={60} className="w-full" />
            <button
                className={`absolute right-0 bottom-0 rounded-full p-3 transition-all duration-300 ease-in-out transform hover:scale-110 ${isRecording ? 'bg-red-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}
                onClick={() => setIsRecording(!isRecording)}
            >
                <Mic size={24} className="text-white" />
            </button>
        </div>
    );
};

// // Voice Section Component
// const VoiceSection = () => (
//     <BentoBox className="bg-gray-750 flex items-center justify-between">
//         <div className="flex-1">
//             <div className="flex space-x-2 mb-3">
//                 {['User', 'AI', 'System'].map((voice, index) => (
//                     <button
//                         key={index}
//                         className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold py-1.5 px-4 rounded-full hover:bg-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105"
//                     >
//                         {voice}
//                     </button>
//                 ))}
//             </div>
//             <AudioVisualization />
//         </div>
//     </BentoBox>
// );


const VoiceSection2 = () => (
    <BentoBox className="bg-gray-750 flex flex-col p-4">
        <div className="flex-grow mb-4">
            <div className="h-40 w-full bg-gray-800 rounded-lg overflow-hidden">
                <div className="flex justify-around items-end h-full p-2">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%` }}></div>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
                {['User', 'AI', 'System'].map((voice, index) => (
                    <button key={index} className="bg-gray-700 text-xs font-bold py-2 px-4 rounded-full hover:bg-gray-600 transition-colors duration-200">
                        {voice}
                    </button>
                ))}
            </div>
            <button className="bg-purple-600 text-white rounded-full p-3 hover:bg-purple-700 transition-colors duration-200">
                <Mic size={24} />
            </button>
        </div>
    </BentoBox>
)


const VoiceSection = () => {
    const [selectedVoice, setSelectedVoice] = useState('User');
    const [voices, setVoices] = useState(['User', 'AI', 'System']);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        if ('speechSynthesis' in window)
        {
            const getVoices = () => {
                const availableVoices = speechSynthesis.getVoices();
                setVoices(availableVoices.map(voice => voice.name));
            };

            speechSynthesis.onvoiceschanged = getVoices;
            getVoices();
        }
    }, []);

    const handleMicClick = () => {
        setIsRecording(!isRecording);
        // Here you would typically start/stop actual voice recording
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="mb-6 w-full">
                <div className="flex justify-center items-end h-20 space-x-1">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse"
                            style={{
                                height: `${20 + Math.random() * 60}%`,
                                animationDelay: `${i * 0.1}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105">
                        Voice Selection
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border border-purple-500">
                        {voices.map((voice, index) => (
                            <DropdownMenuItem
                                key={index}
                                onSelect={() => setSelectedVoice(voice)}
                                className="text-white hover:bg-purple-600 focus:bg-purple-600"
                            >
                                {voice}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <button
                    onClick={handleMicClick}
                    className={`bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full p-3 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-110 ${isRecording ? 'animate-pulse' : ''}`}
                >
                    <Mic size={24} className={isRecording ? 'animate-spin' : ''} />
                </button>
            </div>
            <div className="mt-2 text-center text-sm text-purple-300">
                Selected Voice: {selectedVoice}
            </div>
        </div>
    );
};
// Sidebar Component
const Sidebar = () => {
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);

    return (
        <div
            className="col-span-1 flex flex-col h-full"

        >
            <BentoBox className="flex-grow space-y-4 overflow-y-auto">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4 text-center">
                    GROQY
                </h1>

                <VoiceSection />

                <nav className="space-y-1">
                    {[{ icon: Home, label: 'Dashboard' }, { icon: Folder, label: 'Projects', hasSubmenu: true }, { icon: CheckSquare, label: 'Tasks' }, { icon: BarChart2, label: 'Analytics' }, { icon: Settings, label: 'Settings' }].map(({ icon: Icon, label, hasSubmenu }, index) => (
                        <div key={index}>
                            <button
                                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                onClick={() => hasSubmenu && setIsProjectsOpen(!isProjectsOpen)}
                            >
                                <span className="flex items-center">
                                    <Icon size={16} className="mr-2" />
                                    {label}
                                </span>
                                {hasSubmenu ? (
                                    <ChevronDown
                                        size={16}
                                        className={`transform transition-transform ${isProjectsOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>
                            {hasSubmenu && isProjectsOpen && (
                                <div className="ml-4 space-y-1">
                                    {['Project A', 'Project B'].map((project, idx) => (
                                        <button
                                            key={idx}
                                            className="w-full flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            {project}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </BentoBox>
            <BentoBox className="mt-4 bg-gradient-to-r from-green-400 to-blue-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Productivity Level</p>
                        <p className="text-2xl font-bold">85%</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                        <User size={24} className="text-blue-500" />
                    </div>
                </div>
                <p className="text-sm mt-2">John Doe</p>
            </BentoBox>
        </div>
    );
};

// React Flow Area Component
const initialNodes = [
    { id: '1', position: { x: 50, y: 50 }, data: { label: 'Input' }, type: 'input' },
    { id: '2', position: { x: 250, y: 150 }, data: { label: 'Process' } },
    { id: '3', position: { x: 450, y: 250 }, data: { label: 'Output' }, type: 'output' },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
];

const ReactFlowArea = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <BentoBox className="h-[600px] relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </BentoBox>
    );
};

// Bottom Navigation Component
const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-sm">Productivity Level: High</div>
            <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                    <HelpCircle size={20} />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                    <Bell size={20} />
                </button>
            </div>
        </div>
    </div>
);

// Main Component
export default function GROQYEnhancedUI() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-300 p-6 font-sans">
            <div className="max-w-7xl mx-auto bg-gray-850 rounded-3xl p-6 shadow-2xl mb-16">
                <div className="grid grid-cols-4 gap-6 h-full">
                    <Sidebar />

                    {/* Main Content */}
                    <div className="col-span-3 space-y-6">
                        {/* Top Controls */}
                        <div className="flex justify-between items-center mb-4">
                            <BentoBox className="flex-grow mr-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="bg-gray-700 text-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                                    />
                                    <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                                </div>
                            </BentoBox>
                            <BentoBox className="flex items-center space-x-2">
                                <button className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors duration-200">
                                    <Settings size={20} className="text-purple-400" />
                                </button>
                                <button className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors duration-200">
                                    <User size={20} className="text-purple-400" />
                                </button>
                            </BentoBox>
                        </div>

                        {/* Node Controls */}
                        <BentoBox className="flex justify-between items-center">
                            <div className="flex space-x-2">
                                {['Input', 'Process', 'Output'].map((label, i) => (
                                    <button
                                        key={i}
                                        className="bg-gray-700 text-xs font-bold py-1 px-3 rounded-md flex items-center hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        <Zap size={14} className="mr-1" />
                                        {label} Node
                                    </button>
                                ))}
                            </div>
                            <button className="bg-gray-700 text-xs font-bold py-1 px-3 rounded-md flex items-center hover:bg-gray-600 transition-colors duration-200">
                                <Settings size={14} className="mr-1" />
                                Global variables
                            </button>
                        </BentoBox>

                        <ReactFlowArea />

                        {/* Bottom Controls */}
                        <div className="grid grid-cols-3 gap-6">
                            <BentoBox className="flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-2 flex items-center justify-center">
                                    <Zap size={24} className="text-white" />
                                </div>
                                <span className="text-sm font-medium">Quick Actions</span>
                            </BentoBox>
                            <BentoBox className="flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-2 flex items-center justify-center">
                                    <BarChart2 size={24} className="text-white" />
                                </div>
                                <span className="text-sm font-medium">Analytics</span>
                            </BentoBox>
                            <BentoBox className="flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-2 flex items-center justify-center">
                                    <Send size={24} className="text-white" />
                                </div>
                                <span className="text-sm font-medium">Deploy</span>
                            </BentoBox>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
