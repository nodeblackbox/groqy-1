// app/kanban/page.jsx
"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const DynamicKanbanBoard = dynamic(() => import('@/components/KanbanBoard'), {
    ssr: false,
});

export default function KanbanPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-10"></div>
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="py-4 px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center"
                    >
                        <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 sm:mb-0">
                            Futuristic Kanban
                        </h1>
                        <nav className="flex justify-center sm:justify-end w-full sm:w-auto">
                            <ul className="flex space-x-4">
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">Dashboard</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">Projects</a></li>
                                <li><a href="#" className="hover:text-cyan-400 transition-colors">Team</a></li>
                            </ul>
                        </nav>
                    </motion.div>
                </header>
                <main className="flex-grow overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-full"
                    >
                        <DynamicKanbanBoard />
                    </motion.div>
                </main>
                <footer className="py-4 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
                        <p>&copy; 2024 Futuristic Kanban. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}