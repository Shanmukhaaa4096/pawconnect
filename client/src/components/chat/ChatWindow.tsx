import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  User as UserIcon,
  MessageSquare,
  Sparkles,
  Building2,
  Phone,
  Video,
  Paperclip,
  Mic,
  Check,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react';
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
  const [showMobileChat, setShowMobileChat] = useState(false);

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
            setShowMobileChat(true);
          }
        } else if (initialRecipientId) {
          const startRes = await api.startConversation(initialRecipientId, initialPet?._id);
          setActiveConversation(startRes.conversation);
          setShowMobileChat(true);
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

      setMessages((prev) => {
        if (prev.some((m) => m._id === res.data._id)) return prev;
        return [...prev, res.data];
      });

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
    return <LoadingSpinner label="Opening conversations..." />;
  }

  return (
    <div className="bg-white rounded-3xl border border-[#EAD2D3] shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[720px] max-h-[82vh]">
      {/* ── CONVERSATION THREADS (LEFT PANE) ─────────────────────────── */}
      <div
        className={`md:col-span-4 lg:col-span-4 border-r border-[#EAD2D3] flex flex-col h-full bg-[#FDF7F7] ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-[#EAD2D3] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#C96366]" />
            <h3 className="font-extrabold text-[#292323] text-sm">Inbox & Inquiries</h3>
          </div>
          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#FDEEEF] text-[#C96366] border border-[#EAD2D3]">
            {conversations.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#F4E4E4]">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-[#736363] space-y-2">
              <p className="text-xs font-extrabold text-[#292323]">No messages yet</p>
              <p className="text-[11px] text-[#A89898] leading-relaxed font-medium">
                Click "Message Shelter" on any pet profile to start a direct inquiry.
              </p>
            </div>
          ) : (
            conversations.map((conv) => {
              const recipient = getRecipient(conv);
              const isSelected = activeConversation?._id === conv._id;
              return (
                <button
                  key={conv._id}
                  onClick={() => {
                    setActiveConversation(conv);
                    setShowMobileChat(true);
                  }}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-all ${
                    isSelected ? 'bg-[#FDEEEF] border-l-4 border-[#C96366]' : 'hover:bg-white'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={
                        recipient?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                      }
                      alt={recipient?.name || 'User'}
                      className="w-11 h-11 rounded-2xl object-cover border border-[#EAD2D3]"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-[#292323] truncate">
                        {recipient?.name || 'PawConnect User'}
                      </p>
                    </div>
                    {conv.pet && (
                      <p className="text-[10px] font-bold text-[#C96366] truncate mt-0.5">
                        Regarding {conv.pet.name}
                      </p>
                    )}
                    <p className="text-[11px] text-[#736363] truncate mt-0.5 font-medium">
                      {conv.lastMessage || 'Start conversation...'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── ACTIVE CHAT SCREEN (Screen 7 Reference Mockup) ───────────── */}
      <div
        className={`md:col-span-8 lg:col-span-8 flex flex-col h-full bg-[#F3E6E6]/40 ${
          showMobileChat ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeConversation ? (
          <>
            {/* Top Bar matching Screen 7: Back, Avatar, Name, Status, Call Actions */}
            {(() => {
              const recipient = getRecipient(activeConversation);
              return (
                <div className="p-3.5 sm:p-4 border-b border-[#EAD2D3] bg-[#C96366] text-white flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="md:hidden p-1 rounded-full hover:bg-white/10 text-white"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="relative">
                      <img
                        src={
                          recipient?.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={recipient?.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/60"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#C96366] rounded-full" />
                    </div>

                    <div>
                      <h4 className="font-extrabold text-white text-sm leading-tight">
                        {recipient?.name}
                      </h4>
                      <p className="text-[10px] text-white/80 font-medium">Active Status</p>
                    </div>
                  </div>

                  {/* Audio & Video Call icons matching Screen 7 */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => alert(`Starting voice call with ${recipient?.name}... (Simulated)`)}
                      className="p-2 rounded-full hover:bg-white/20 text-white transition"
                      title="Audio Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Starting video call with ${recipient?.name}... (Simulated)`)}
                      className="p-2 rounded-full hover:bg-white/20 text-white transition"
                      title="Video Call"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Chat Messages Pane */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#F3E6E6]/30">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-[#736363] space-y-2">
                  <p className="text-xs font-bold text-[#292323]">Start of your message thread</p>
                  <p className="text-[11px] text-[#A89898] max-w-sm mx-auto">
                    Say hello, ask questions about pet habits, or coordinate a friendly shelter visit!
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
                      {/* Bubble (Matches Screen 7) */}
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm flex items-end gap-2 ${
                          isMine
                            ? 'bg-[#C96366] text-white rounded-2xl rounded-br-xs font-medium'
                            : 'bg-white text-[#292323] border border-[#EAD2D3] rounded-2xl rounded-bl-xs font-medium'
                        }`}
                      >
                        <span className="flex-1">{msg.text}</span>
                        {isMine && <CheckCheck className="w-3.5 h-3.5 text-white/80 shrink-0" />}
                      </div>

                      {/* Timestamp */}
                      <span className="text-[9px] text-[#A89898] mt-1 px-1 font-semibold">
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
                <div className="flex items-center gap-1.5 text-xs text-[#C96366] italic font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#C96366] animate-ping" />
                  <span>{typingUser} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Bar (Matches Screen 7: Type message..., Mic, Attach, Send) */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 bg-white border-t border-[#EAD2D3] flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => alert('File attachment feature simulation')}
                className="p-2 text-[#A89898] hover:text-[#C96366] transition"
                title="Attach photo"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => alert('Voice note feature simulation')}
                className="p-2 text-[#A89898] hover:text-[#C96366] transition"
                title="Record voice note"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type message..."
                className="flex-1 h-10 px-4 rounded-full bg-[#F3E6E6]/60 border border-[#EAD2D3] text-xs sm:text-sm text-[#292323] placeholder-[#A89898] focus:outline-none focus:border-[#C96366]"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-[#C96366] hover:bg-[#98494B] text-white flex items-center justify-center transition disabled:opacity-40 shadow"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#736363] space-y-2">
            <MessageSquare className="w-12 h-12 text-[#EAD2D3]" />
            <h4 className="text-base font-black text-[#292323]">Select a Conversation</h4>
            <p className="text-xs text-[#A89898] max-w-sm font-medium">
              Choose a message thread from the left or visit any pet to contact their shelter directly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
