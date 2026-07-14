export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string | null;
  phoneNumber?: string | null;
  createdAt: string;
}

export interface JoinWaitlistPayload {
  email: string;
  name?: string;
  phoneNumber?: string;
}
