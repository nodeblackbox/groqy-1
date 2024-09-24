import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Send, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ChatView = ({
    state,
    setState,
    input,
    setInput,
    isLoading,
    handleSubmit,
    startVoiceInput,
    speakMessage,
    downloadChatTranscript,
    clearChat,
}) => {
    const chatContainerRef = React.useRef(null);

    React.useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [state.currentChatId, state.chats]);

    const currentChat = state.chats.find((chat) => chat.id === state.currentChatId) || null;

    return (
        <>
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4 overflow-x-hidden" ref={chatContainerRef}>
                {currentChat?.messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                        <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[80%]`}>
                            <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarImage src={message.role === 'user' ? '/user-avatar.png' : '/bot-avatar.png'} />
                                <AvatarFallback>{message.role === 'user' ? 'U' : 'B'}</AvatarFallback>
                            </Avatar>
                            <div className={`mx-2 ${message.role === 'user' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded-lg shadow overflow-hidden`}>
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <pre className="bg-gray-800 text-white p-2 rounded">
                                                    <code {...props} className={className}>
                                                        {children}
                                                    </code>
                                                </pre>
                                            ) : (
                                                <code {...props} className={className}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                    className="prose dark:prose-invert max-w-none break-words"
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}
            </ScrollArea>
        </>
    );
};

export default ChatView;