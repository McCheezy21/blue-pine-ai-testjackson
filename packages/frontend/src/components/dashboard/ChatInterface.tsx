import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { X, Send, MessageCircle, Minimize2, Maximize2, AlertCircle, Loader2, Expand, Shrink, ThumbsUp, ThumbsDown, MessageSquare, Star, Paperclip } from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isError?: boolean;
  metadata?: {
    category?: string;
    confidence?: number;
  };
  feedback?: {
    rating: 'positive' | 'negative';
    comment?: string;
  };
}

interface ConversationRating {
  overall_rating: number;
  feedback_text?: string;
}

// Global chat state to persist across pages
const globalChatState = {
  messages: [] as ChatMessage[],
  isOpen: false,
  isMinimized: false,
  isExpanded: false,
  hasActiveChat: false,
  subscribers: new Set<(state: any) => void>(),
  
  subscribe(callback: (state: any) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  },
  
  setState(updates: Partial<{ 
    messages: ChatMessage[]; 
    isOpen: boolean; 
    isMinimized: boolean;
    isExpanded: boolean;
    hasActiveChat: boolean;
  }>) {
    if (updates.messages) this.messages = updates.messages;
    if (updates.isOpen !== undefined) this.isOpen = updates.isOpen;
    if (updates.isMinimized !== undefined) this.isMinimized = updates.isMinimized;
    if (updates.isExpanded !== undefined) this.isExpanded = updates.isExpanded;
    if (updates.hasActiveChat !== undefined) this.hasActiveChat = updates.hasActiveChat;
    this.subscribers.forEach(callback => callback({ 
      messages: this.messages, 
      isOpen: this.isOpen,
      isMinimized: this.isMinimized,
      isExpanded: this.isExpanded,
      hasActiveChat: this.hasActiveChat
    }));
  }
};

interface ChatInterfaceProps {
  showInputBar?: boolean;
  tenantId?: string;
  userToken?: string;
  embeddedMode?: boolean;
}

const INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes

export const ChatInterface = ({ showInputBar = false, tenantId, userToken, embeddedMode = false }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(globalChatState.messages);
  const [isOpen, setIsOpen] = useState(globalChatState.isOpen);
  const [isMinimized, setIsMinimized] = useState(globalChatState.isMinimized);
  const [isExpanded, setIsExpanded] = useState(globalChatState.isExpanded);
  const [hasActiveChat, setHasActiveChat] = useState(globalChatState.hasActiveChat);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    messageId: string;
    rating: 'positive' | 'negative' | null;
  }>({
    isOpen: false,
    messageId: '',
    rating: null
  });

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [conversationStartTime, setConversationStartTime] = useState<number>(Date.now());
  const [conversationRating, setConversationRating] = useState<ConversationRating>({
    overall_rating: 0,
    feedback_text: ''
  });
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [inactivityRating, setInactivityRating] = useState(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Add tooltip state for hover
  const [showFileTooltip, setShowFileTooltip] = useState(false);

  // Always focus the input after sending and on mount
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);

  // Subscribe to global state changes
  useEffect(() => {
    return globalChatState.subscribe((state) => {
      setMessages(state.messages);
      setIsOpen(state.isOpen);
      setIsMinimized(state.isMinimized);
      setIsExpanded(state.isExpanded);
      setHasActiveChat(state.hasActiveChat);
    });
  }, []);

  // Generate conversation ID when chat opens
  useEffect(() => {
    if (isOpen && !conversationId) {
      const newConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setConversationId(newConversationId);
      setConversationStartTime(Date.now());
    }
  }, [isOpen, conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      setShowInactivityModal(true);
    }, INACTIVITY_TIMEOUT_MS);
  };

  // Reset timer on user message or chat interaction
  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [messages, isOpen, isMinimized]);

  // Also reset timer on input change (user is typing)
  useEffect(() => {
    resetInactivityTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  // Hide modal and reset timer if user interacts with chat after inactivity
  const handleCloseInactivityModal = () => {
    setShowInactivityModal(false);
    setInactivityRating(0);
    resetInactivityTimer();
  };

  // Submit inactivity rating (reuse conversationId, etc.)
  const handleSubmitInactivityRating = async () => {
    if (inactivityRating === 0) {
      alert('Please select a rating.');
      return;
    }
    setIsSubmittingRating(true);
    try {
      await fetch(`http://localhost:3001/api/tenants/${tenantId}/chat/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          overall_rating: inactivityRating,
          conversation_length: messages.length,
          conversation_duration_seconds: Math.floor((Date.now() - conversationStartTime) / 1000),
          source: 'inactivity_modal'
        })
      });
      setShowInactivityModal(false);
      setInactivityRating(0);
      resetInactivityTimer();
    } catch (error) {
      alert('Failed to submit rating.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !selectedFile) return;

    let userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    // If a file is selected, add a fileUrl and fileName to the message
    let fileUrl: string | undefined = undefined;
    let fileName: string | undefined = undefined;
    let fileType: string | undefined = undefined;
    if (selectedFile) {
      fileUrl = URL.createObjectURL(selectedFile);
      fileName = selectedFile.name;
      fileType = selectedFile.type;
      // Attach file info to message
      (userMessage as any).fileUrl = fileUrl;
      (userMessage as any).fileName = fileName;
      (userMessage as any).fileType = fileType;
    }

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    globalChatState.setState({ 
      messages: newMessages, 
      isOpen: true, 
      isMinimized: false,
      hasActiveChat: true 
    });
    
    const currentMessage = inputValue;
    setInputValue("");
    setSelectedFile(null);
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

      // Call our backend Bedrock API
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
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          sender: 'ai',
          timestamp: new Date(),
          metadata: data.metadata
        };

        const updatedMessages = [...newMessages, aiMessage];
        setMessages(updatedMessages);
        globalChatState.setState({ messages: updatedMessages });

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

      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date(),
        isError: true,
      };

      const updatedMessages = [...newMessages, errorResponse];
      setMessages(updatedMessages);
      globalChatState.setState({ messages: updatedMessages });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChat = () => {
    if (isMinimized) {
      // Restore from minimized state
      globalChatState.setState({ isOpen: true, isMinimized: false });
    } else {
      // Minimize the chat
      globalChatState.setState({ isMinimized: true, isOpen: true });
    }
  };

  const handleMinimize = () => {
    globalChatState.setState({ isMinimized: true, isOpen: true });
  };

  const handleToggleExpand = () => {
    globalChatState.setState({ isExpanded: !isExpanded });
  };

  const handleCloseAttempt = () => {
    setShowCloseConfirm(true);
  };

  const handleConfirmClose = () => {
    setMessages([]);
    setIsOpen(false);
    setShowCloseConfirm(false);
    setConversationHistory([]);
    globalChatState.setState({ 
      messages: [], 
      isOpen: false, 
      isMinimized: false,
      isExpanded: false,
      hasActiveChat: false 
    });
  };

  const handleOpenChat = () => {
    if (!hasActiveChat) {
      globalChatState.setState({ 
        isOpen: true, 
        isMinimized: false,
        hasActiveChat: true 
      });
    } else {
      globalChatState.setState({ isOpen: true, isMinimized: false });
    }
  };

  const getStatusMessage = () => {
    if (!tenantId || !userToken) {
      return "Sign in to enable AI chat";
    }
    return "AI-powered assistant ready";
  };

  const isDisabled = !tenantId || !userToken || isLoading;

  const handleFeedback = async (messageId: string, rating: 'positive' | 'negative', comment?: string) => {
    try {
      await fetch(`http://localhost:3001/api/tenants/${tenantId}/chat/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          messageId,
          rating,
          comment,
          category: feedbackModal.rating === 'negative' ? 'improvement_needed' : 'helpful'
        })
      });

      // Update message with feedback
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback: { rating, comment } }
          : msg
      ));

      setFeedbackModal({ isOpen: false, messageId: '', rating: null });
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const openFeedbackModal = (messageId: string, rating: 'positive' | 'negative') => {
    setFeedbackModal({
      isOpen: true,
      messageId,
      rating
    });
  };

  const handleClose = () => {
    // If there are messages in the conversation, show rating modal
    if (messages.length > 1) { // More than just the welcome message
      setShowRatingModal(true);
    } else {
      // No conversation to rate, just close
      handleConfirmClose();
    }
  };

  const handleSubmitRating = async () => {
    if (conversationRating.overall_rating === 0) {
      alert('Please provide an overall rating before submitting.');
      return;
    }

    setIsSubmittingRating(true);

    try {
      const conversationDuration = Math.floor((Date.now() - conversationStartTime) / 1000);
      
      const response = await fetch(`http://localhost:3001/api/tenants/${tenantId}/chat/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          overall_rating: conversationRating.overall_rating,
          conversation_length: messages.length,
          conversation_duration_seconds: conversationDuration
        })
      });

      if (response.ok) {
        console.log('✅ Rating submitted successfully');
        setShowRatingModal(false);
        handleConfirmClose();
      } else {
        console.error('Failed to submit rating');
        alert('Failed to submit rating. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating. Please try again.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleSkipRating = () => {
    setShowRatingModal(false);
    handleConfirmClose();
  };

  const resetChat = () => {
    setMessages([{
      id: '1',
      text: "Hello! I'm your Blue Pine AI assistant. I can help you with healthcare revenue cycle management questions, billing processes, claims management, and more. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }]);
    setInputValue("");
    setConversationId('');
    setConversationRating({
      overall_rating: 0,
      feedback_text: ''
    });
  };

  // Always focus the input after sending and on mount
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    if (inputRef2.current) inputRef2.current.focus();
  }, []);
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    if (inputRef2.current) inputRef2.current.focus();
  }, [messages]);

  return (
    <>
      {/* Chat Input Bar - only show on dashboard or embedded mode */}
      {showInputBar && !embeddedMode && (
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          {!tenantId || !userToken ? (
            <div className="text-center py-2">
              <p className="text-sm text-slate-600 mb-2">Sign in to chat with AI</p>
              <div className="text-xs text-slate-500">
                Access your tenant dashboard to enable AI chat
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isLoading ? "AI is responding..." : "Ask Blue Pine AI anything..."}
                  className="pr-12 text-gray-700 placeholder-gray-500"
                  disabled={isDisabled}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  disabled={isDisabled || !inputValue.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {hasActiveChat && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleToggleChat}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  {isMinimized ? 'Show' : 'Hide'} Chat
                </Button>
              )}
            </form>
          )}
        </div>
      )}

      {/* Only render floating/fixed chat widget if not in embeddedMode */}
      {!embeddedMode && (
        <>
          {/* Floating Chat Widget (when minimized or no active chat) - ALWAYS in fixed position */}
          {(!isOpen || isMinimized) && (
            <div className="fixed bottom-6 right-6 z-40">
              <Button
                onClick={handleOpenChat}
                className="h-14 w-14 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                size="icon"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
              {/* Status Indicator */}
              <div className={`absolute -top-2 -right-2 w-6 h-6 ${
                tenantId && userToken ? 'bg-green-500' : 'bg-orange-500'
              } text-white text-xs rounded-full flex items-center justify-center`}>
                {tenantId && userToken ? (
                  <span className="text-xs">AI</span>
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
              </div>
            </div>
          )}

          {/* Chat Window - positioned to not interfere with button */}
          {isOpen && !isMinimized && hasActiveChat && (
            <>
              {/* Keep the floating button in same position even when chat is open */}
              <div className="fixed bottom-6 right-6 z-50">
                <Button
                  onClick={handleMinimize}
                  className="h-14 w-14 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                  size="icon"
                >
                  <MessageCircle className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Chat window positioned to not overlap the button */}
              <div className={`fixed bottom-24 right-6 z-40 transition-all duration-300 ease-in-out ${
                isExpanded ? 'w-[500px] h-[600px]' : 'w-96 h-96'
              }`}>
                <Card className="h-full flex flex-col shadow-xl bg-white border border-gray-200 apple-glass-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-b rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">Blue Pine AI Assistant</CardTitle>
                        <p className="text-xs text-blue-100">{getStatusMessage()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleExpand}
                        className="h-8 w-8 p-0 text-white hover:bg-white/10"
                        title={isExpanded ? "Collapse chat" : "Expand chat"}
                      >
                        {isExpanded ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="h-8 w-8 p-0 text-white hover:bg-white/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-3 bg-white p-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : message.isError
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-gray-100 text-gray-900 border'
                          }`}
                        >
                          {message.isError && (
                            <div className="flex items-center gap-1 mb-1">
                              <AlertCircle className="w-3 h-3" />
                              <span className="text-xs font-medium">Error</span>
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          {(message as any).fileUrl && (
                            <div className="mt-2">
                              {((message as any).fileType || '').startsWith('image/') ? (
                                <img src={(message as any).fileUrl} alt={(message as any).fileName} className="max-w-xs max-h-40 rounded shadow border" />
                              ) : (
                                <a href={(message as any).fileUrl} download={(message as any).fileName} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                                  {(message as any).fileName || 'Download file'}
                                </a>
                              )}
                            </div>
                          )}
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' 
                              ? 'text-blue-100' 
                              : message.isError 
                              ? 'text-red-600' 
                              : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 p-3 rounded-lg border">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </CardContent>
                  
                  {/* Chat Input in Window */}
                  <div className="border-t bg-white p-3">
                    {!tenantId || !userToken ? (
                      <div className="text-center py-2">
                        <p className="text-sm text-slate-600 mb-1">Sign in to chat with AI</p>
                        <div className="text-xs text-slate-500">
                          Access your tenant dashboard to enable AI chat
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="flex gap-2">
                        {/* + Button for file upload with tooltip */}
                        <div className="relative flex items-center">
                          <label
                            className="flex items-center cursor-pointer"
                            onMouseEnter={() => setShowFileTooltip(true)}
                            onMouseLeave={() => setShowFileTooltip(false)}
                          >
                            <Paperclip className="h-5 w-5 text-gray-500 hover:text-blue-600" />
                            <input
                              type="file"
                              className="hidden"
                              onChange={e => {
                                if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
                              }}
                              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.txt"
                            />
                          </label>
                          {showFileTooltip && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-8 z-50 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                              Add photos and files
                            </div>
                          )}
                        </div>
                        {/* Show filename if file selected */}
                        {selectedFile && (
                          <span className="text-xs text-gray-600 max-w-[120px] truncate">{selectedFile.name}</span>
                        )}
                        <Input
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={isLoading ? "AI is responding..." : "Ask about healthcare RCM..."}
                          className="flex-1 text-sm"
                          disabled={isDisabled}
                        />
                        <Button
                          type="submit"
                          size="sm"
                          disabled={isDisabled || (!inputValue.trim() && !selectedFile)}
                          className="px-3"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </form>
                    )}
                  </div>
                </Card>
              </div>
            </>
          )}
        </>
      )}

      {/* Embedded mode: always show chat window in place */}
      {embeddedMode && (
        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 bg-white p-4 flex flex-col justify-end rounded-3xl">
            {messages.length === 0 && (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-2xl md:text-3xl text-[#CCCCCC] text-center font-medium select-none" style={{lineHeight: 1.3}}>
                  How can I help your facility today?
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-[#004466] text-white'
                      : message.isError
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-[#EAEFF2] text-[#333333] border border-[#CCCCCC]'
                  }`}
                >
                  {message.isError && (
                    <div className="flex items-center gap-1 mb-1">
                      <AlertCircle className="w-3 h-3" />
                      <span className="text-xs font-medium">Error</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {(message as any).fileUrl && (
                    <div className="mt-2">
                      {((message as any).fileType || '').startsWith('image/') ? (
                        <img src={(message as any).fileUrl} alt={(message as any).fileName} className="max-w-xs max-h-40 rounded shadow border" />
                      ) : (
                        <a href={(message as any).fileUrl} download={(message as any).fileName} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                          {(message as any).fileName || 'Download file'}
                        </a>
                      )}
                    </div>
                  )}
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' 
                      ? 'text-[#EAEFF2]' 
                      : message.isError 
                      ? 'text-red-600' 
                      : 'text-[#CCCCCC]'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#EAEFF2] text-[#333333] p-3 rounded-lg border border-[#CCCCCC]">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 w-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Chat Input in Window (outside scrollable area) */}
          <div className="border-t-0 bg-white p-6 rounded-b-2xl">
            {!tenantId || !userToken ? (
              <div className="text-center py-2">
                <p className="text-sm text-[#333333] mb-1">Sign in to chat with AI</p>
                <div className="text-xs text-[#CCCCCC]">
                  Access your tenant dashboard to enable AI chat
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                {/* + Button for file upload with tooltip */}
                <div className="relative flex items-center">
                  <label
                    className="flex items-center cursor-pointer"
                    onMouseEnter={() => setShowFileTooltip(true)}
                    onMouseLeave={() => setShowFileTooltip(false)}
                  >
                    <Paperclip className="h-6 w-6 text-[#CCCCCC] hover:text-[#004466]" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
                      }}
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.txt"
                    />
                  </label>
                  {showFileTooltip && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-8 z-50 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                      Add photos and files
                    </div>
                  )}
                </div>
                {/* Show filename if file selected */}
                {selectedFile && (
                  <span className="text-xs text-[#004466] max-w-[120px] truncate">{selectedFile.name}</span>
                )}
                <input
                  ref={inputRef2}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isLoading ? "AI is responding..." : "Type anything..."}
                  className="flex-1 px-5 py-4 rounded-2xl bg-[#EAEFF2] text-lg text-[#333333] placeholder-[#CCCCCC] shadow focus:outline-none focus:ring-2 focus:ring-[#004466] border-0"
                  disabled={isDisabled}
                  style={{transition: 'box-shadow 0.2s'}}
                />
                <button
                  type="submit"
                  disabled={isDisabled || (!inputValue.trim() && !selectedFile)}
                  className="px-5 py-4 rounded-2xl bg-[#004466] hover:bg-[#005580] text-white shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{fontSize: 22}}
                >
                  <Send className="h-6 w-6" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Close Confirmation Dialog */}
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>End Chat Session?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to end this chat? This will close the conversation and clear the chat history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCloseConfirm(false)}>
              No, Continue Chat
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              Yes, End Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Feedback Modal */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {feedbackModal.rating === 'positive' ? 'Great! Tell us more' : 'Help us improve'}
            </h3>
            <p className="text-gray-600 mb-4">
              {feedbackModal.rating === 'positive' 
                ? 'What made this response helpful?'
                : 'What could we do better?'
              }
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Your feedback (optional)..."
              onChange={(e) => {
                // Store comment in state if needed
              }}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setFeedbackModal({ isOpen: false, messageId: '', rating: null })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleFeedback(feedbackModal.messageId, feedbackModal.rating!, '')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Conversation Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
            <p className="text-gray-600 mb-6">How was your conversation with our AI assistant?</p>
            
            {/* Overall Rating */}
            <div className="mb-6">
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setConversationRating(prev => ({ ...prev, overall_rating: rating }))}
                    className={`p-1 transition-colors ${
                      conversationRating.overall_rating >= rating
                        ? 'text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {conversationRating.overall_rating === 0 ? 'Click to rate' :
                 conversationRating.overall_rating === 1 ? 'Poor' :
                 conversationRating.overall_rating === 2 ? 'Fair' :
                 conversationRating.overall_rating === 3 ? 'Good' :
                 conversationRating.overall_rating === 4 ? 'Very Good' : 'Excellent'}
              </p>
            </div>

            {/* Optional Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={conversationRating.feedback_text || ''}
                onChange={(e) => setConversationRating(prev => ({ ...prev, feedback_text: e.target.value }))}
                placeholder="Tell us what you liked or how we can improve..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleSkipRating}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={conversationRating.overall_rating === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inactivity Modal */}
      {showInactivityModal && (
        <AlertDialog open={showInactivityModal} onOpenChange={setShowInactivityModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you still there?</AlertDialogTitle>
              <AlertDialogDescription>
                It looks like you haven't interacted with the chat for a while. Was this chat helpful?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex items-center justify-center gap-2 my-2">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setInactivityRating(star)}
                  className={
                    (inactivityRating >= star ? 'text-yellow-400' : 'text-gray-300') +
                    ' text-2xl focus:outline-none'
                  }
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star />
                </button>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseInactivityModal}>Dismiss</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitInactivityRating} disabled={isSubmittingRating || inactivityRating === 0}>
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
