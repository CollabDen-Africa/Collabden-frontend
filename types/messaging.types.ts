export interface MessageRequest {
  id: string;
  senderId: string;
  receiverId: string;
  message?: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
  sender?: {
    id: string;
    email: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface DirectChat {
  id: string;
  user1Id: string;
  user2Id: string;
  isArchived: boolean;
  unreadCount: number;
  lastMessage?: DirectMessage;
  otherParticipant?: {
    id: string;
    email: string;
    displayName?: string | null;
    avatarUrl?: string | null;
  };
}

export interface DirectMessage {
  id: string;
  chatId: string;
  senderId: string;
  content?: string;
  voiceUrl?: string | null;
  voiceDuration?: number | null;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
}

export interface SendMessagePayload {
  content?: string;
  parentId?: string;
  voiceUrl?: string;
  voiceDuration?: number;
}
