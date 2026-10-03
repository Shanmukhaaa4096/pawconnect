import React from 'react';
import { useSearchParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChatWindow } from '../components/chat/ChatWindow';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MessageSquare, ArrowLeft } from 'lucide-react';

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
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Real-Time Communications
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-orange-600" />
            Adoption Messages & Inquiries
          </h1>
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
