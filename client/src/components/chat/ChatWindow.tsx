import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, MessageSquare, Sparkles, Building2 } from 'lucide-react';
import { Conversation, Message, Pet } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getSocket, joinConversationRoom, leaveConversationRoom } from '../../services/socket';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ChatWindowProps {
  initialConversationId?: string;
  initialPet?: Pet;
  initialRecipientId?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  initialConversationId,
  initialPet,
  initialRecipientId,
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Load conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await api.getConversations();
        setConversations(res.conversations || []);

        if (initialConversationId) {
          const found = res.conversations?.find((c) => c._id === initialConversationId);
          if (found) {
            setActiveConversation(found);
          }
        } else if (initialRecipientId) {
          // Check if conversation already exists or start new
          const startRes = await api.startConversation(initialRecipientId, initialPet?._id);
          setActiveConversation(startRes.conversation);
          setConversations((prev) => {
            const exists = prev.some((c) => c._id === startRes.conversation._id);
            return exists ? prev : [startRes.conversation, ...prev];
          });
        } else if (res.conversations && res.conversations.length > 0) {
          setActiveConversation(res.conversations[0]);
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [initialConversationId, initialRecipientId]);

  // Load messages and listen to Socket.io when activeConversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const convId = activeConversation._id;
    joinConversationRoom(convId);

    const fetchMessages = async () => {
      try {
        const res = await api.getMessages(convId);
        setMessages(res.messages || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();

    // Socket.io listeners
    const socket = getSocket();

    const handleReceiveMessage = (newMsg: Message) => {
      if (newMsg.conversationId === convId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m._id === newMsg._id)) return prev;
          return [...prev, newMsg];
        });
      }
    };

    const handleUserTyping = (data: { conversationId: string; userName: string; isTyping: boolean }) => {
      if (data.conversationId === convId) {
        setTypingUser(data.isTyping ? data.userName : null);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      leaveConversationRoom(convId);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [activeConversation]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!activeConversation || !user) return;

    const socket = getSocket();
    socket.emit('typing', {
      conversationId: activeConversation._id,
      userName: user.name,
      isTyping: true,
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        conversationId: activeConversation._id,
        userName: user.name,
        isTyping: false,
      });
    }, 1500);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation || !user) return;

    const recipient = activeConversation.participants.find(
      (p) => p._id.toString() !== user._id.toString()
    );

    if (!recipient) return;

    const text = inputText.trim();
    setInputText('');

    // Clear typing
    const socket = getSocket();
    socket.emit('typing', {
      conversationId: activeConversation._id,
      userName: user.name,
      isTyping: false,
    });

    try {
      const res = await api.sendMessage({
        conversationId: activeConversation._id,
        receiverId: recipient._id,
        petId: activeConversation.pet?._id,
        text,
      });

      // Append locally
      setMessages((prev) => {
        if (prev.some((m) => m._id === res.data._id)) return prev;
        return [...prev, res.data];
      });

      // Update conversations list snippet
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConversation._id
            ? { ...c, lastMessage: text, lastMessageAt: new Date().toISOString() }
            : c
        )
      );
    } catch (err: any) {
      alert(`Could not send message: ${err.message}`);
    }
  };

  const getRecipient = (conv: Conversation) => {
    return conv.participants.find((p) => p._id.toString() !== user?._id.toString());
  };

  if (loading) {
    return <LoadingSpinner label="Loading secure conversations..." />;
  }

    return (
    <div className="bg-white rounded-[2rem] border border-[#EDE6DC] shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[720px] max-h-[85vh]">
      {/* CONVERSATION LIST (LEFT PANE) */}
      <div className="border-r border-[#EDE6DC] flex flex-col h-full bg-[#FAF7F2]/60">
        <div className="p-4 border-b border-[#EDE6DC] flex items-center justify-between bg-white/70 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#FF7E67]" />
            <h3 className="font-black text-[#2B2523] text-sm">Conversations</h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF6EC] border border-[#F8E2CA] text-[#965B20]">
            {conversations.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#EDE6DC]/60">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-[#7A6E68] space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-[#D5CEC8]" />
              <p className="text-xs font-bold text-[#2B2523]">No messages yet!</p>
              <p className="text-[11px] text-[#7A6E68] leading-relaxed">
                Inquire on any pet's page to start a friendly chat with the shelter.
              </p>
            </div>
          ) : (
            conversations.map((conv) => {
              const recipient = getRecipient(conv);
              const isSelected = activeConversation?._id === conv._id;
              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'bg-[#FFF6EC] border-l-4 border-[#FF7E67]'
                      : 'hover:bg-white/80'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={
                        recipient?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                      }
                      alt={recipient?.name || 'User'}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#EDE6DC]"
                    />
                    {recipient?.role === 'shelter' && (
                      <span className="absolute -bottom-1 -right-1 p-0.5 bg-[#1C6C57] text-white rounded-full">
                        <Building2 className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#2B2523] truncate">
                        {recipient?.name || 'Support'}
                      </p>
                    </div>
                    {conv.pet && (
                      <p className="text-[11px] font-bold text-[#FF7E67] truncate flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> About {conv.pet.name}
                      </p>
                    )}
                    <p className="text-[11px] text-[#7A6E68] truncate mt-0.5 font-medium">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ACTIVE CHAT AREA (RIGHT PANE) */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col h-full bg-white">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            {(() => {
              const recipient = getRecipient(activeConversation);
              return (
                <div className="p-4 border-b border-[#EDE6DC] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        recipient?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={recipient?.name}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[#FF7E67]/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-[#2B2523] text-sm">
                          {recipient?.name}
                        </h4>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFF2EE] text-[#FF7E67] border border-[#FCD7CE] capitalize">
                          {recipient?.role}
                        </span>
                      </div>
                      <p className="text-xs text-[#7A6E68] font-medium">
                        {recipient?.role === 'shelter'
                          ? recipient.organization?.name || 'Certified Rescue Shelter'
                          : 'Adoption Applicant'}
                      </p>
                    </div>
                  </div>

                  {/* Connected Pet Badge */}
                  {activeConversation.pet && (
                    <div className="flex items-center gap-2 p-1.5 pr-3 bg-[#FAF7F2] rounded-2xl border border-[#EDE6DC]">
                      <img
                        src={activeConversation.pet.photos?.[0]}
                        alt={activeConversation.pet.name}
                        className="w-8 h-8 rounded-xl object-cover"
                      />
                      <div className="text-left">
                        <span className="block text-[10px] uppercase font-black text-[#A49B95]">Regarding</span>
                        <span className="block text-xs font-black text-[#2B2523] leading-tight">
                          {activeConversation.pet.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#FFFDF9]">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-[#7A6E68] space-y-2">
                  <p className="text-xs font-bold text-[#2B2523]">This is the start of your warm conversation. 🐾</p>
                  <p className="text-[11px] text-[#7A6E68] max-w-sm mx-auto">
                    Feel free to ask about routines, meet & greets, home environments, or dietary needs!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const senderId = (msg.sender as any)?._id || msg.sender;
                  const isMine = senderId?.toString() === user?._id.toString();

                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isMine
                            ? 'bg-[#FF7E67] text-white rounded-br-xs font-medium'
                            : 'bg-white text-[#2B2523] border border-[#EDE6DC] rounded-bl-xs font-medium'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-[#A49B95] mt-1 px-1 font-semibold">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {typingUser && (
                <div className="flex items-center gap-1.5 text-xs text-[#FF7E67] italic font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#FF7E67] animate-ping" />
                  <span>🐾 {typingUser} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 bg-white border-t border-[#EDE6DC] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type your friendly message..."
                className="flex-1 px-4 py-3 text-sm bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl text-[#2B2523] placeholder-[#A49B95] focus:outline-none focus:border-[#FF7E67] transition-all font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 rounded-2xl bg-[#FF7E67] hover:bg-[#F26B53] text-white font-extrabold transition-all shadow-md shadow-[#FF7E67]/20 disabled:opacity-40 disabled:hover:bg-[#FF7E67] active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#7A6E68] space-y-3 bg-[#FFFDF9]">
            <MessageSquare className="w-12 h-12 text-[#D5CEC8]" />
            <h4 className="text-base font-black text-[#2B2523]">No Conversation Selected</h4>
            <p className="text-xs text-[#7A6E68] max-w-sm leading-relaxed">
              Select an existing chat thread from the left or browse pets and click "Message Shelter Directly".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
