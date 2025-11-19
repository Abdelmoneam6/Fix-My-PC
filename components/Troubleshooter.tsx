import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertTriangle, CheckCircle, Cpu, RotateCcw } from 'lucide-react';
import { ChatMessage } from '../types';
import { initializeChat, sendMessageStream } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const Troubleshooter: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat with a welcome message
    initializeChat();
    setMessages([{
      id: 'init',
      role: 'model',
      text: "Hello! I'm your FixMyRig assistant. Briefly describe the problem you're having with your PC (e.g., 'Won't turn on', 'Blue Screen', 'Overheating'). Remember to always unplug your PC before touching internal components!",
      timestamp: Date.now()
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let fullResponse = '';
      const modelMsgId = (Date.now() + 1).toString();
      
      // Add placeholder for streaming
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      const stream = sendMessageStream(userMsg.text);
      
      for await (const chunk of stream) {
        if (chunk) {
          fullResponse += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, text: fullResponse } : msg
          ));
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm encountering a connection error. Please check your API key or internet connection and try again.",
        timestamp: Date.now(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    initializeChat();
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: "Diagnostics reset. What issue are you facing now?",
      timestamp: Date.now()
    }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <div className="flex-none mb-4 bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="text-yellow-500 shrink-0 mt-1" />
        <p className="text-sm text-yellow-200">
          <strong>Safety Warning:</strong> Always power down and unplug your PC before opening the case. Ground yourself to prevent electrostatic discharge (ESD) damage.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 glass-panel rounded-2xl mb-4 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                msg.role === 'user'
                  ? 'bg-cyber-primary/20 text-white border border-cyber-primary/30'
                  : msg.isError 
                    ? 'bg-red-900/50 text-red-200 border border-red-700'
                    : 'bg-cyber-800 text-gray-200 border border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-50 text-xs">
                {msg.role === 'model' ? <Cpu size={12} /> : <CheckCircle size={12} />}
                <span>{msg.role === 'model' ? 'FixMyRig AI' : 'You'}</span>
              </div>
              <div className="prose prose-invert prose-sm leading-relaxed">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-cyber-800 border border-gray-700 rounded-2xl px-5 py-4 flex gap-2 items-center">
                    <div className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <button
            onClick={handleReset}
            className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors border border-gray-700"
            title="Reset Conversation"
        >
            <RotateCcw size={20} />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your issue (e.g. 'GPU fans loud but no video')..."
            className="w-full bg-cyber-800 text-white pl-4 pr-12 py-4 rounded-xl border border-gray-700 focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary outline-none transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 p-2 bg-cyber-primary/20 hover:bg-cyber-primary/40 text-cyber-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Troubleshooter;
