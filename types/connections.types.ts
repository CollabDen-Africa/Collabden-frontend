export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface ConnectionPartyProfile {
  id: string;
  email: string;
  displayName?: string | null;
  legalName?: string | null;
  avatarUrl?: string | null;
}

export interface UserConnection {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
  sender?: ConnectionPartyProfile;
  receiver?: ConnectionPartyProfile;
}

export interface ConnectedUser {
  id: string;
  email: string;
  displayName?: string | null;
  legalName?: string | null;
  avatarUrl?: string | null;
}

export interface GetConnectionsParams {
  projectId?: string;
  excludeProjectId?: string;
}

export interface ConnectionRequestPayload {
  receiverId: string;
}

export interface RespondConnectionPayload {
  status: "ACCEPTED" | "REJECTED";
}
