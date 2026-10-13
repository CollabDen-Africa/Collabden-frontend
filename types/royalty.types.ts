export interface RoyaltySplit {
  id: string;
  projectId: string;
  userId: string;
  royaltyShare: number;
  role: string | null;
  user: {
    id: string;
    email: string;
    displayName: string | null;
    legalName: string | null;
    avatarUrl: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RoyaltySettingsResponse {
  projectId: string;
  totalShare: number;
  remainingShare: number;
  splits: RoyaltySplit[];
}

export interface UpdateRoyaltySplitInput {
  userId: string;
  royaltyShare: number;
  role?: string | null;
}