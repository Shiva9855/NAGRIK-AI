import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  CornerDownRight,
  Languages,
  Loader2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { ChatMessage } from '../types';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Swagat hai! I am your **NagrikAI Assistant**. I can help you report civic issues (like potholes, garbage, or broken lights), track existing complaints, or tell you how to earn reward badges! \n\n*How can I help you today?*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { label: "Report garbage issue", q: "How do I report a garbage dumping issue?" },
    { label: "Earn citizen points", q: "How can I earn citizen points and badges?" },
    { label: "Check nearby issues", q: "Show me nearby issues in my ward" },
    { label: "How AI analyzes images", q: "How does the AI computer vision detect severity?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (!response.ok) {
        throw new Error('Chat failed');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: "⚠️ I am having trouble reaching the NagrikAI servers right now. Rest assured, you can use the **Report Issue** tab directly to upload a photo and register your report instantly!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="nagrik-ai-chatbot">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all duration-200"
          id="chatbot-open-btn"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm">Ask NagrikAI</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-900"></span>
          </span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div 
          className={`bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden w-96 max-w-sm sm:max-w-md ${
            isMinimized ? 'h-14' : 'h-[500px]'
          }`}
          id="chatbot-window"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                🤖
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center">
                  NagrikAI Assistant
                  <Sparkles className="w-3 h-3 ml-1 text-emerald-400 animate-pulse fill-emerald-400" />
                </h4>
                <div className="flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <p className="text-[10px] text-slate-400">Online • AI Civil Guide</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Messages & Actions Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
                {messages.map((msg) => {
                  const isBot = msg.sender === 'bot';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                    >
                      <div className={`flex items-start max-w-[85%] space-x-2 ${isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                          isBot ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-500 text-slate-950 font-bold'
                        }`}>
                          {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className={`rounded-xl p-3 text-sm leading-relaxed ${
                            isBot 
                              ? 'bg-slate-800/80 text-slate-200 border border-slate-700/50' 
                              : 'bg-emerald-500 text-slate-950 font-medium'
                          }`}>
                            {/* Simple Markdown Bold Support */}
                            {msg.text.split('\n').map((para, i) => (
                              <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                                {para.split('**').map((part, index) => {
                                  if (index % 2 === 1) return <strong key={index} className="font-extrabold underline decoration-emerald-400">{part}</strong>;
                                  return part;
                                })}
                              </p>
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 block px-1">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 rounded-md bg-slate-800 text-emerald-400 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl px-3.5 py-2.5 flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span className="text-xs text-slate-400">Analyzing query...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length === 1 && (
                <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40">
                  <div className="flex items-center space-x-1 mb-1.5 text-xs text-emerald-400 font-semibold">
                    <Languages className="w-3.5 h-3.5" />
                    <span>Quick Suggestion / Hindi, Marathi, Kannada support:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {suggestedQuestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(s.q)}
                        className="text-left text-[11px] p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-colors flex items-center line-clamp-1"
                      >
                        <CornerDownRight className="w-3 h-3 text-emerald-400 mr-1 flex-shrink-0" />
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="p-3 border-t border-slate-800 bg-slate-950 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask in Hindi, Marathi, English..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-40 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
