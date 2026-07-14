export type AgreementStatus = "DRAFT" | "PENDING_SIGNATURE" | "SIGNED";

export interface LegalAgreement {
  id: string;
  projectId: string;
  title: string | null;
  content: string | null;
  fileUrl: string | null;
  filePath: string | null;
  status: AgreementStatus;
  auditMetadata?: any;
  createdAt: string;
  updatedAt: string;
  signatures?: AgreementSignature[];
}

export interface AgreementSignature {
  id: string;
  agreementId: string;
  userId: string;
  legalName: string;
  signedAt: string;
  user?: { id: string; email: string };
}
