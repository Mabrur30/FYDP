import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getAuthToken } from "../utils/auth";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
} from "lucide-react";

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: number;
  userId: number;
  name: string;
  title: string;
  image: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

const initialConversations: Conversation[] = [];

function getConversationFromSearch(search: string) {
  const params = new URLSearchParams(search);
  const rawConversation = params.get("conversation");
  const rawUserId = params.get("userId");
  const targetValue = rawConversation || rawUserId;

  if (!targetValue) return null;

  return initialConversations.find(
    (conversation) =>
      String(conversation.id) === targetValue ||
      String(conversation.userId) === targetValue,
  );
}

export function ChatPage() {
  const location = useLocation();
  const token = getAuthToken();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/conversations`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Unable to load conversations");
        const data = await res.json();
        const convs = (data || []).map((c: any) => ({
          id: String(c.id),
          userId: String(c.userId),
          name: c.name,
          title: c.title,
          image: c.image,
          lastMessage: c.lastMessage,
          lastMessageTime: c.lastMessageTime,
          unreadCount: c.unreadCount || 0,
          online: c.online || false,
          messages: [],
        }));
        setConversations(convs);

        const conversation = getConversationFromSearch(location.search);
        const target = conversation || convs[0] || null;
        if (target) {
          setSelectedConversation(target);
          // load messages
          const msgsRes = await fetch(
            `/api/conversations/${target.id}/messages`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            },
          );
          if (msgsRes.ok) {
            const msgs = await msgsRes.json();
            setSelectedConversation((prev) =>
              prev ? { ...prev, messages: msgs } : prev,
            );
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [location.search]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    (async () => {
      try {
        const res = await fetch(
          `/api/conversations/${selectedConversation.id}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ text: messageInput }),
          },
        );

        if (!res.ok) throw new Error("Unable to send message");
        const saved = await res.json();

        // refresh messages
        const msgsRes = await fetch(
          `/api/conversations/${selectedConversation.id}/messages`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        if (msgsRes.ok) {
          const msgs = await msgsRes.json();
          setSelectedConversation((prev) =>
            prev ? { ...prev, messages: msgs } : prev,
          );
          setConversations((prev) =>
            prev.map((c) =>
              String(c.id) === String(selectedConversation.id)
                ? {
                    ...c,
                    lastMessage: messageInput,
                    lastMessageTime: "Just now",
                  }
                : c,
            ),
          );
        }

        setMessageInput("");
      } catch (err) {
        console.error(err);
      }
    })();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const markAsRead = (conversationId: number) => {
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map((msg) => ({ ...msg, read: true })),
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 pt-20">
        <div className="h-[calc(100vh-5rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-lg h-full flex overflow-hidden">
            {/* Conversations Sidebar */}
            <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
              {/* Search Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                  Messages
                </h2>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      markAsRead(conversation.id);
                    }}
                    className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? "bg-blue-50 border-l-4 border-l-[#1E88E5]"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img
                          src={conversation.image}
                          alt={conversation.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-[#1A1A1A] truncate">
                            {conversation.name}
                          </h4>
                          <span className="text-xs text-gray-500 ml-2">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1 truncate">
                          {conversation.title}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-700 truncate flex-1">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 bg-[#1E88E5] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={selectedConversation.image}
                        alt={selectedConversation.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {selectedConversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">
                        {selectedConversation.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedConversation.online ? "Active now" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Call"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Phone size={20} className="text-[#1E88E5]" />
                    </button>
                    <button
                      type="button"
                      aria-label="Start video call"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Video size={20} className="text-[#1E88E5]" />
                    </button>
                    <button
                      type="button"
                      aria-label="More options"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreVertical size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 0 ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          message.senderId === 0
                            ? "bg-[#1E88E5] text-white rounded-2xl rounded-tr-sm"
                            : "bg-white text-[#1A1A1A] rounded-2xl rounded-tl-sm border border-gray-200"
                        } px-4 py-2 shadow-sm`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${
                            message.senderId === 0
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">{message.timestamp}</span>
                          {message.senderId === 0 && (
                            <span>
                              {message.read ? (
                                <span className="flex items-center gap-0.5">
                                  <Check size={12} />
                                  <Check size={12} />
                                </span>
                              ) : (
                                <Check size={14} />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white text-[#1A1A1A] rounded-2xl rounded-tl-sm border border-gray-200 px-4 py-3 shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:400ms]"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      aria-label="Attach file"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Paperclip size={20} className="text-gray-600" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] resize-none"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label="Open emoji picker"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Smile size={20} className="text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      aria-label="Send message"
                      className="p-2 bg-[#1E88E5] text-white rounded-full hover:bg-[#1565C0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-[#1E88E5] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={40} className="text-[#1E88E5]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
