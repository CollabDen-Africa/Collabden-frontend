export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeUrl: string;
}

export interface CreateSupportTicketPayload {
  subject: string;
  message: string;
}
