import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChatWindow } from '../components/chat/ChatWindow';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MessageSquare } from 'lucide-react';
import { KawaiiPaw } from '../components/common/KawaiiIcons';

export const MessagesPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();

  const recipientId = searchParams.get('recipientId') || undefined;
  const petId = searchParams.get('petId') || undefined;
  const conversationId = searchParams.get('conversationId') || undefined;

  if (loading) {
    return <LoadingSpinner label="Opening secure messaging..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2EE] text-[#FF7E67] text-xs font-black uppercase tracking-wider mb-2">
            <KawaiiPaw className="w-3.5 h-3.5" />
            <span>Direct Inquiries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B2523] tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-[#FF7E67]" />
            Adoption Messages & Inquiries
          </h1>
          <p className="text-sm text-[#7A6E68] mt-1 font-medium">
            Connect directly with shelter coordinators and adoption applicants in real-time.
          </p>
        </div>
      </div>

      <ChatWindow
        initialConversationId={conversationId}
        initialRecipientId={recipientId}
        initialPet={petId ? ({ _id: petId } as any) : undefined}
      />
    </div>
  );
};

