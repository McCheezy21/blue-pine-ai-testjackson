
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
import { X, Send, MessageCircle, Minimize2, Maximize2 } from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Global chat state to persist across pages
const globalChatState = {
  messages: [] as ChatMessage[],
  isOpen: false,
  isMinimized: false,
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
    hasActiveChat: boolean;
  }>) {
    if (updates.messages) this.messages = updates.messages;
    if (updates.isOpen !== undefined) this.isOpen = updates.isOpen;
    if (updates.isMinimized !== undefined) this.isMinimized = updates.isMinimized;
    if (updates.hasActiveChat !== undefined) this.hasActiveChat = updates.hasActiveChat;
    this.subscribers.forEach(callback => callback({ 
      messages: this.messages, 
      isOpen: this.isOpen,
      isMinimized: this.isMinimized,
      hasActiveChat: this.hasActiveChat
    }));
  }
};

interface ChatInterfaceProps {
  showInputBar?: boolean;
}

export const ChatInterface = ({ showInputBar = false }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(globalChatState.messages);
  const [isOpen, setIsOpen] = useState(globalChatState.isOpen);
  const [isMinimized, setIsMinimized] = useState(globalChatState.isMinimized);
  const [hasActiveChat, setHasActiveChat] = useState(globalChatState.hasActiveChat);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to global state changes
  useEffect(() => {
    return globalChatState.subscribe((state) => {
      setMessages(state.messages);
      setIsOpen(state.isOpen);
      setIsMinimized(state.isMinimized);
      setHasActiveChat(state.hasActiveChat);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    globalChatState.setState({ 
      messages: newMessages, 
      isOpen: true, 
      isMinimized: false,
      hasActiveChat: true 
    });
    setInputValue("");
    setIsLoading(true);

    // Mock AI response - replace with actual Amazon Bedrock integration later
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. I'm Blue Pine AI, and I'm here to help you with your healthcare automation needs. This is a mock response - the Amazon Bedrock integration will be implemented soon.",
        sender: 'ai',
        timestamp: new Date()
      };
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      globalChatState.setState({ messages: updatedMessages });
      setIsLoading(false);
    }, 1500);
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

  const handleCloseAttempt = () => {
    setShowCloseConfirm(true);
  };

  const handleConfirmClose = () => {
    setMessages([]);
    setIsOpen(false);
    setShowCloseConfirm(false);
    globalChatState.setState({ 
      messages: [], 
      isOpen: false, 
      isMinimized: false,
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

  return (
    <>
      {/* Chat Input Bar - only show on dashboard */}
      {showInputBar && (
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Blue Pine AI anything..."
                className="pr-12 text-gray-700 placeholder-gray-500"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
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
        </div>
      )}

      {/* Floating Chat Widget (when minimized or no active chat) */}
      {(isMinimized || (!isOpen && !hasActiveChat)) && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={handleOpenChat}
            className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Window - positioned at bottom-right */}
      {isOpen && !isMinimized && hasActiveChat && (
        <div className="fixed bottom-4 right-4 w-96 h-96 z-50">
          <Card className="h-full flex flex-col shadow-lg bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-white border-b">
              <CardTitle className="text-lg">Blue Pine AI Chat</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMinimize}
                  className="h-8 w-8 p-0"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseAttempt}
                  className="h-8 w-8 p-0"
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
                        : 'bg-gray-100 text-gray-900 border'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg border">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            
            {/* Chat Input in Window */}
            <div className="border-t bg-white p-3">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
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
    </>
  );
};
