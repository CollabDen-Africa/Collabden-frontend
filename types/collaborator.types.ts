export interface MarketplaceCollaborator {
  id: string;
  email: string;
  displayName: string | null;
  legalName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  skills: string[];
  genres: string[];
  openToCollaborate: boolean;
  onboardingCompleted: boolean;
}

export interface UpdateAvailabilityPayload {
  openToCollaborate: boolean;
}
