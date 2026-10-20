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

export interface DirectMessageAttachment {
  id: string;
  messageId: string;
  url: string;
  name?: string | null;
  mimeType?: string | null;
  size?: number | null;
  createdAt?: string;
}

export interface AttachmentInput {
  url: string;
  name?: string | null;
  mimeType?: string | null;
  size?: number | null;
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
  attachments?: DirectMessageAttachment[];
}

export interface AttachmentUploadResponse {
  path: string;
  signedUrl: string;
  name: string;
  mimeType: string;
  size: number;
  expiresInSeconds: number;
}

export const MAX_DM_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_MESSAGE = 10;

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  user?: {
    id: string;
    displayName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
  };
}

export interface SendMessagePayload {
  content?: string;
  parentId?: string;
  voiceUrl?: string;
  voiceDuration?: number;
  attachments?: AttachmentInput[];
}

export interface VoiceUploadResponse {
  path: string;
  signedUrl: string;
  mimeType: string;
  size: number;
  durationSeconds: number;
  expiresInSeconds: number;
}

export const MAX_VOICE_DURATION_SECONDS = 180;
