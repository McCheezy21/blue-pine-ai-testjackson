import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isError?: boolean;
}

interface ChatbotWidgetProps {
  tenantId?: string;
  userToken?: string;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ tenantId, userToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your Blue Pine AI assistant. I can help you with questions about healthcare revenue cycle management, billing processes, and how Blue Pine AI can optimize your workflow. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);

    try {
      // Check if we have authentication and tenant info
      if (!tenantId || !userToken) {
        throw new Error('Please sign in to chat with the AI assistant');
      }

      // Add user message to conversation history
      const newHistory = [
        ...conversationHistory,
        { role: 'user', content: currentMessage }
      ];

      // Call the Bedrock API
      const response = await fetch(`http://localhost:3001/api/tenants/${tenantId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          message: currentMessage,
          conversation_history: newHistory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      if (data.success) {
        const botResponse: Message = {
          id: messages.length + 2,
          text: data.message,
          isBot: true,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);

        // Update conversation history
        setConversationHistory([
          ...newHistory,
          { role: 'assistant', content: data.message }
        ]);
      } else {
        throw new Error(data.error || 'AI service unavailable');
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('sign in')) {
          errorMessage = 'Please sign in to chat with the AI assistant.';
        } else if (error.message.includes('Access denied')) {
          errorMessage = 'You don\'t have access to this tenant\'s AI assistant.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Connection error. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }

      const errorResponse: Message = {
        id: messages.length + 2,
        text: errorMessage,
        isBot: true,
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStatusMessage = () => {
    if (!tenantId || !userToken) {
      return "Sign in to enable AI chat";
    }
    return "AI-powered assistant ready";
  };

  const isDisabled = !tenantId || !userToken || isLoading;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[500px] apple-glass-card border border-slate-200/50 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Blue Pine AI Assistant</h3>
                  <p className="text-xs text-blue-100">{getStatusMessage()}</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 h-96 overflow-y-auto bg-gradient-to-b from-white to-slate-50/50">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      msg.isBot
                        ? msg.isError
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-slate-100 text-slate-800'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    } shadow-sm`}
                  >
                    {msg.isError && (
                      <div className="flex items-center gap-1 mb-1">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-xs font-medium">Error</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.isBot 
                        ? msg.isError 
                          ? 'text-red-600' 
                          : 'text-slate-500' 
                        : 'text-blue-100'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xs px-4 py-2 rounded-2xl bg-slate-100 text-slate-800 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200/50 bg-white/80 backdrop-blur-sm">
            {!tenantId || !userToken ? (
              <div className="text-center py-2">
                <p className="text-sm text-slate-600 mb-2">Sign in to chat with AI</p>
                <div className="text-xs text-slate-500">
                  Access your tenant dashboard to enable AI chat
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isLoading ? "AI is responding..." : "Ask about healthcare RCM..."}
                  disabled={isDisabled}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-slate-900 placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={sendMessage}
                  disabled={isDisabled || !message.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-1"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="apple-button w-16 h-16 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
      >
        {isOpen ? (
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>

      {/* Status Indicator */}
      {!isOpen && (
        <div className={`absolute -top-2 -right-2 w-6 h-6 ${
          tenantId && userToken ? 'bg-green-500' : 'bg-orange-500'
        } text-white text-xs rounded-full flex items-center justify-center`}>
          {tenantId && userToken ? (
            <Sparkles className="w-3 h-3" />
          ) : (
            <AlertCircle className="w-3 h-3" />
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget; 