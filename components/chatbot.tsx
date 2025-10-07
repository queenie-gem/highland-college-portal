"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
} from "lucide-react";
import Markdown from 'react-markdown'
interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
}

// Configuration
const API_CONFIG = {
  baseUrl: "https://highland-chatbot.onrender.com/api/v1",
  apiKey:
    "b4c67848e88194eba8c16b3b75ba7c0f76229a0710c57faa78bdc3545f266beb0d19801248507bcf4975e118487411d936f3592dc4915ec482e7084be2b1778f",
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm HCT, your virtual assistant for Highland College of Technology. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create a new chat session
  const createChatSession = async (): Promise<ChatSession | null> => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/chat/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_CONFIG.apiKey,
        },
        body: JSON.stringify({
          title: "Highland College Chat",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to create chat session:", error);
      setError("Failed to create chat session. Please try again.");
      return null;
    }
  };

  // Handle streaming response
  const handleStreamingResponse = async (
    chatId: string,
    content: string
  ): Promise<void> => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Create bot message placeholder
    const botMessageId = (Date.now() + 1).toString();
    const botMessage: Message = {
      id: botMessageId,
      content: "",
      sender: "bot",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, botMessage]);

    try {
      // Create abort controller for this request
      setIsThinking(true);
      abortControllerRef.current = new AbortController();

      const response = await fetch(
        `${API_CONFIG.baseUrl}/chat/${chatId}?stream=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_CONFIG.apiKey,
          },
          body: JSON.stringify({ content }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let newMessageId = "";
      let currentResponse = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.trim() === "") continue;

            try {
              // Parse the JSON chunk
              const formatedJson = line.slice(6);
              const chunk = JSON.parse(formatedJson);
              console.log(chunk);

              if (chunk.messageId) {
                // Update message ID if provided
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? { ...msg, id: chunk.messageId }
                      : msg
                  )
                );
                newMessageId = chunk.messageId;
              } else if (chunk.chunk) {
                // Append content chunk
                setIsThinking(false);
                currentResponse += chunk.chunk;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId || msg.id === newMessageId
                      ? {
                          ...msg,
                          content: currentResponse,
                          isStreaming: false,
                        }
                      : msg
                  )
                );
              } else if (chunk.done === true) {
                // Mark streaming as complete
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId || msg.id === chunk.messageId
                      ? { ...msg, isStreaming: false }
                      : msg
                  )
                );
                break;
              }
            } catch (parseError) {
              console.warn("Failed to parse chunk:", line, parseError);
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request aborted");
        return;
      }

      console.error("Streaming error:", error);

      // Update the bot message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                content:
                  "I apologize, but I'm experiencing technical difficulties. Please try again later.",
                isStreaming: false,
              }
            : msg
        )
      );

      setError("Failed to get response. Please try again.");
    } finally {
      abortControllerRef.current = null;
      setIsThinking(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    const messageContent = inputValue;
    setInputValue("");

    try {
      // Create chat session if it doesn't exist
      let currentSession = chatSession;
      if (!currentSession) {
        currentSession = await createChatSession();
        if (!currentSession) {
          setIsLoading(false);
          return;
        }
        setChatSession(currentSession);
      }

      await handleStreamingResponse(currentSession.id, messageContent);
    } catch (error) {
      console.error("Send message error:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-red-800 hover:bg-red-900 shadow-lg animate-pulse"
          size="sm"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={`w-80 sm:w-96 bg-white shadow-2xl border-0 transition-all duration-300 ${
          isMinimized ? "h-16" : "h-[500px]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-red-800 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="bg-red-700 p-1.5 rounded-full">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">HCT</h3>
              <p className="text-xs text-red-100">
                {chatSession ? "Connected" : "Connecting..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-red-900 h-8 w-8 p-0"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-red-900 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Error Display */}
            {error && (
              <div className="p-2 bg-red-100 border-b border-red-200">
                <p className="text-sm text-red-700">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="mt-1 h-6 text-xs text-red-700 hover:bg-red-200"
                >
                  Dismiss
                </Button>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === "user"
                        ? "bg-red-800 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === "bot" && (
                        <div className="flex items-center">
                          <Bot className="h-4 w-4 mt-0.5 text-red-800" />
                          {message.isStreaming && isThinking && (
                            <div className="ml-1 flex space-x-1">
                              <div className="w-1 h-1 bg-red-800 rounded-full animate-bounce"></div>
                              <div
                                className="w-1 h-1 bg-red-800 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-1 h-1 bg-red-800 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}
                      {message.sender === "user" && (
                        <User className="h-4 w-4 mt-0.5 text-red-100" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">
                          <Markdown>
                            {message.content}
                          </Markdown>
                        </p>
                        {!message.isStreaming && (
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "user"
                                ? "text-red-100"
                                : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about Highland College..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-red-800 hover:bg-red-900"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {chatSession
                  ? "Ask about admissions, programs, fees, or campus info"
                  : "Connecting to chat service..."}
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
