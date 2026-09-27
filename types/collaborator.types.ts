export interface MarketplaceCollaborator {
  id: string;
  email: string;
  displayName: string | null;
  legalName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  experience?: string | null;
  skills: string[];
  genres: string[];
  openToCollaborate: boolean;
  onboardingCompleted: boolean;
  identityVerified?: boolean;
  isVerified?: boolean;
}

export interface UpdateAvailabilityPayload {
  openToCollaborate: boolean;
}
