"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm HCT, your virtual assistant for Highland College of Technology. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("admission") || input.includes("apply")) {
      return "For admission information, you need 5 credits in your O'level or JAMB cut off mark of 160. We offer National Diploma programs in Computer Science, Information Technology, Software Engineering, Data Science, Cybersecurity, and Web Development. Would you like more details about any specific program?"
    }

    if (input.includes("tuition") || input.includes("fee") || input.includes("cost")) {
      return "Our tuition fees are: ND1 (First Year) - ₦180,000, ND2 (Second Year) - ₦170,000, plus a registration fee of ₦15,000. We also offer flexible payment options. Would you like information about scholarships or payment plans?"
    }

    if (input.includes("program") || input.includes("course")) {
      return "We offer 6 National Diploma programs: Computer Science, Information Technology, Software Engineering, Data Science, Cybersecurity, and Web Development. Each program is 2 years duration. Which program interests you most?"
    }

    if (input.includes("contact") || input.includes("location") || input.includes("address")) {
      return "Highland College of Technology is located at Adjacent Dominican Community, Off UI/Sango Road, Education Zone, Samonda. You can reach us at (+234) 708 514 2576, (+234) 805 350 7454, or (+234) 708 007 3489. Email: segun@highlandtech.edu.ng"
    }

    if (input.includes("calendar") || input.includes("semester") || input.includes("session")) {
      return "Our academic calendar: First Semester (Sept - Dec 2024), Second Semester (Jan - May 2025). Registration is from Aug 15 - Sept 5, and examinations are from Nov 20 - Dec 15. Need more specific dates?"
    }

    return "I'd be happy to help you with information about Highland College of Technology! You can ask me about admissions, programs, tuition fees, academic calendar, contact information, or any other questions about our college."
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

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
    )
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
              <p className="text-xs text-red-100">Online now</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-red-900 h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
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
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === "user" ? "bg-red-800 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === "bot" && <Bot className="h-4 w-4 mt-0.5 text-red-800" />}
                      {message.sender === "user" && <User className="h-4 w-4 mt-0.5 text-red-100" />}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.sender === "user" ? "text-red-100" : "text-gray-500"}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-red-800" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-red-800 hover:bg-red-900"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Ask about admissions, programs, fees, or campus info
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
