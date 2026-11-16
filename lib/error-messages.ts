import axios from "axios";
import { getErrorMessage } from "./error-handler"; // adjust path to wherever error-handler.ts lives

/* -------------------------------------------------------------------------- */
/*  1. Kinds: what went wrong, independent of which page it happened on       */
/* -------------------------------------------------------------------------- */

export type ErrorKind =
  | "unverified" // email/account not verified
  | "identityRequired" // KYC / legal name / government ID needed
  | "notFound"
  | "alreadyExists"
  | "invalidCredentials"
  | "invalidCode"
  | "expired"
  | "rateLimited"
  | "locked"
  | "planLimit" // free-plan or subscription limits
  | "tooLarge"
  | "unsupported"
  | "insufficientFunds"
  | "network"
  | "unauthorized"
  | "forbidden"
  | "validation"
  | "server"
  | "unknown";

export interface FriendlyError {
  message: string;
  kind: ErrorKind;
  status?: number;
}

/* -------------------------------------------------------------------------- */
/*  2. Shared fallbacks: used when a context has no wording for a kind        */
/* -------------------------------------------------------------------------- */

export const GENERIC_MESSAGES = {
  default: "Something went wrong on our end. Please try again in a moment.",
  network: "We can't reach the server right now. Please check your internet connection and try again.",
  timeout: "That took longer than expected. Please try again.",
  server: "We're having a little trouble on our side. Please try again shortly.",
  rateLimited: "You're moving fast! Please wait a moment and try again.",
  unauthorized: "Your session has expired. Please log in again to continue.",
  forbidden: "You don't have permission to do that.",
  notFound: "We couldn't find what you were looking for.",
  alreadyExists: "That already exists. Please try something different.",
  validation: "Something didn't look right. Please check your details and try again.",
  expired: "That has expired. Please try again.",
  locked: "This isn't available right now. Please contact support if it keeps happening.",
  planLimit: "You've reached the limit for your current plan. Upgrade to keep going.",
  tooLarge: "That's too large. Please choose something smaller.",
  unsupported: "That type isn't supported. Please try a different one.",
  insufficientFunds: "There aren't enough funds to complete this. Please top up and try again.",
  identityRequired: "Please verify your identity to continue.",
  invalidCode: "That code doesn't look right. Please check it and try again.",
  invalidCredentials: "That email or password doesn't look right. Please try again.",
  unverified: "Please verify your account to continue.",
} as const;

const GENERIC_BY_KIND: Partial<Record<ErrorKind, string>> = {
  network: GENERIC_MESSAGES.network,
  server: GENERIC_MESSAGES.server,
  rateLimited: GENERIC_MESSAGES.rateLimited,
  unauthorized: GENERIC_MESSAGES.unauthorized,
  forbidden: GENERIC_MESSAGES.forbidden,
  notFound: GENERIC_MESSAGES.notFound,
  alreadyExists: GENERIC_MESSAGES.alreadyExists,
  validation: GENERIC_MESSAGES.validation,
  expired: GENERIC_MESSAGES.expired,
  locked: GENERIC_MESSAGES.locked,
  planLimit: GENERIC_MESSAGES.planLimit,
  tooLarge: GENERIC_MESSAGES.tooLarge,
  unsupported: GENERIC_MESSAGES.unsupported,
  insufficientFunds: GENERIC_MESSAGES.insufficientFunds,
  identityRequired: GENERIC_MESSAGES.identityRequired,
  invalidCode: GENERIC_MESSAGES.invalidCode,
  invalidCredentials: GENERIC_MESSAGES.invalidCredentials,
  unverified: GENERIC_MESSAGES.unverified,
};

/* -------------------------------------------------------------------------- */
/*  3. Contexts: "domain.action". Add a new entry for every new feature.      */
/*     `default` is used when nothing more specific matches.                  */
/*     `kinds` overrides the shared wording for that specific action.         */
/* -------------------------------------------------------------------------- */

interface ContextRule {
  default: string;
  kinds?: Partial<Record<ErrorKind, string>>;
  /**
   * Wording for a specific backend error code (response.data.code), e.g. "NIN_ALREADY_LINKED".
   * Checked before any text matching, since a code is the most reliable signal there is.
   */
  codes?: Record<string, string>;
}

/**
 * Backend error codes -> kind, so `kind` is right even when a context has no wording for
 * the code. Add codes here as your API grows; a code a context lists in `codes` but that
 * isn't listed here still works (its kind falls back to the HTTP status).
 */
export const CODE_KINDS: Record<string, ErrorKind> = {
  NIN_ALREADY_LINKED: "alreadyExists",
  ALREADY_VERIFIED: "alreadyExists",
  RATE_LIMITED: "rateLimited",
  DETAILS_MISMATCH: "validation",
  SERVICE_UNAVAILABLE: "server",
};

const errorCodeOf = (error: unknown): string | undefined => {
  if (!axios.isAxiosError(error)) return undefined;
  const data = error.response?.data as
    | { code?: unknown; errorCode?: unknown; error?: { code?: unknown } }
    | undefined;
  const code = data?.code ?? data?.errorCode ?? data?.error?.code;
  return typeof code === "string" ? code : undefined;
};

export const ERROR_CONTEXTS = {
  /* ---------------------------------- Auth --------------------------------- */
  "auth.login": {
    default: "We couldn't log you in right now. Please try again.",
    kinds: {
      unverified: "Your email hasn't been verified yet. Verify it to get started.",
      notFound: "We couldn't find an account with that email.",
      invalidCredentials: "That email or password doesn't look right. Please try again.",
      unauthorized: "That email or password doesn't look right. Please try again.",
      rateLimited: "Too many attempts. Please wait a few minutes or reset your password.",
      locked: "This account is currently unavailable. Please contact support.",
    },
  },
  "auth.google": {
    default: "We couldn't continue with Google. Please try again or use your email instead.",
  },
  "auth.signup": {
    default: "We couldn't create your account right now. Please try again.",
    kinds: {
      alreadyExists: "An account with this email already exists. Try logging in instead.",
      validation: "Please check your details. Passwords need at least 8 characters and a number.",
    },
  },
  "auth.verifyEmail": {
    default: "We couldn't verify your email right now. Please try again.",
    kinds: {
      invalidCode: "That code doesn't match. Please check it and try again.",
      validation: "That code doesn't match. Please check it and try again.",
      expired: "That code has expired. Request a new one and try again.",
      alreadyExists: "Your email is already verified. You can log in now.",
      rateLimited: "Too many attempts. Please wait a minute and try again.",
    },
  },
  "auth.resendCode": {
    default: "We couldn't resend the code. Please try again in a moment.",
    kinds: {
      rateLimited: "A code was sent recently. Please wait a minute before requesting another.",
      notFound: "We couldn't find a sign-up with that email. Try signing up again.",
      alreadyExists: "Your email is already verified. You can log in now.",
    },
  },
  "auth.forgotPassword": {
    default: "We couldn't send the reset link right now. Please try again.",
    kinds: {
      notFound: "We couldn't find an account with that email.",
      rateLimited: "You've requested a few resets already. Please wait a bit before trying again.",
    },
  },
  "auth.resetPassword": {
    default: "We couldn't reset your password right now. Please try again.",
    kinds: {
      invalidCode: "This reset link isn't valid. Please request a new one.",
      unauthorized: "This reset link isn't valid. Please request a new one.",
      expired: "This reset link has expired. Please request a new one.",
      alreadyExists: "Your new password must be different from your old one.",
      validation: "Your password needs at least 8 characters, an uppercase letter and a number.",
    },
  },
  "auth.adminVerify2FA": {
    default: "We couldn't verify that code. Please try again.",
    kinds: {
      invalidCode: "That code doesn't match. Please check it and try again.",
      validation: "That code doesn't match. Please check it and try again.",
      unauthorized: "That code doesn't match. Please check it and try again.",
      expired: "That code has expired. Request a new one and try again.",
      rateLimited: "Too many attempts. Please wait a few minutes and try again.",
    },
  },
  "auth.adminResend2FA": {
    default: "We couldn't resend the code. Please try again in a moment.",
    kinds: {
      rateLimited: "A code was sent recently. Please wait a minute before requesting another.",
      expired: "Your sign-in session has expired. Please log in again.",
    },
  },

  /* ------------------------------ Dashboard etc. --------------------------- */
  "dashboard.load": {
    default: "We couldn't load your dashboard. Please refresh the page.",
  },
  "marketplace.load": {
    default: "We couldn't load the marketplace right now. Please refresh and try again.",
  },
  "marketplace.search": {
    default: "We couldn't complete that search. Please try again.",
  },
  "collaborators.search": {
    default: "We couldn't load collaborators right now. Please try again.",
  },
  "connections.load": {
    default: "We couldn't load your connections. Please try again.",
  },
  "connections.respond": {
    default: "We couldn't update that connection request. Please try again.",
    kinds: {
      notFound: "That request is no longer available.",
      alreadyExists: "You've already responded to this request.",
    },
  },

  /* -------------------------------- Projects ------------------------------- */
  "projects.load": {
    default: "We couldn't load your projects. Please refresh and try again.",
    kinds: { notFound: "We couldn't find that project. It may have been removed." },
  },
  "projects.create": {
    default: "We couldn't create your project right now. Please try again.",
    kinds: {
      identityRequired:
        "To create a funded project, please add your legal name and complete identity verification first.",
      planLimit: "You've reached the project or collaborator limit on your current plan. Upgrade to add more.",
      validation: "Please check your project details, including dates and budget, and try again.",
      alreadyExists: "You already have a project with that name. Try a different one.",
    },
  },
  "projects.coverUpload": {
    default: "We couldn't upload that cover image. Please try again.",
    kinds: {
      tooLarge: "That image is too large. Please choose one under 5MB.",
      unsupported: "Please use a PNG, JPG or WebP image.",
      forbidden: "Only the project owner can change the cover image.",
    },
  },
  "tasks.create": {
    default: "We couldn't create that task. Please try again.",
    kinds: {
      forbidden: "Only the project owner can create tasks.",
      validation: "Please check the task details and try again.",
    },
  },
  "tasks.move": {
    default: "We couldn't move that task. Please try again.",
    kinds: {
      forbidden: "You don't have permission to move this task.",
      notFound: "That task no longer exists. Refresh to see the latest.",
    },
  },
  "projectMessages.send": {
    default: "Your message didn't send. Please try again.",
    kinds: {
      forbidden: "Only members of this project can send messages here.",
      notFound: "This project is no longer available.",
    },
  },

  /* ------------------------ Misc features (from hooks) --------------------- */
  "onboarding.update": {
    default: "We couldn't save your progress. Please try again.",
  },
  "collaborators.updateAvailability": {
    default: "We couldn't update your availability. Please try again.",
  },
  "connections.send": {
    default: "We couldn't send that connection request. Please try again.",
    kinds: {
      alreadyExists: "You've already sent a request to this person, or you're already connected.",
      notFound: "We couldn't find that person.",
      forbidden: "You can't send a connection request to this person.",
      rateLimited: "You've sent a lot of requests. Please wait a bit before sending more.",
    },
  },
  "notifications.markRead": {
    default: "We couldn't update your notifications. Please try again.",
  },
  "royalties.load": {
    default: "We couldn't load the royalty splits. Please refresh and try again.",
  },
  "royalties.save": {
    default: "We couldn't save the royalty splits. Please try again.",
    kinds: {
      validation: "Those royalty percentages don't look right. Please check they don't add up to more than 100% and try again.",
      forbidden: "Only the project owner can change royalty splits.",
      alreadyExists: "Royalty splits are locked once everyone has agreed.",
    },
  },
  "escrow.submitEvidence": {
    default: "We couldn't submit your evidence. Please try again.",
    kinds: {
      tooLarge: "One of your files is too large. Please choose smaller ones.",
      unsupported: "One of your files isn't a supported type.",
      forbidden: "Only the person assigned to this milestone can submit evidence.",
      alreadyExists: "Evidence has already been submitted for this milestone.",
    },
  },
  "escrow.approveMilestone": {
    default: "We couldn't approve this milestone. Please try again.",
    kinds: {
      forbidden: "Only the project owner can approve milestones.",
      alreadyExists: "This milestone has already been approved.",
      insufficientFunds: "The escrow doesn't have enough funds to release this payment.",
    },
  },
  "escrow.raiseDispute": {
    default: "We couldn't raise that dispute. Please try again.",
    kinds: {
      alreadyExists: "A dispute is already open for this milestone.",
      validation: "Please tell us a bit about the problem so we can look into it.",
    },
  },
  "escrow.remind": {
    default: "We couldn't send that reminder. Please try again.",
    kinds: { rateLimited: "A reminder was sent recently. Please wait a bit before sending another." },
  },
  "escrow.removeCollaborator": {
    default: "We couldn't remove that collaborator from the escrow. Please try again.",
    kinds: { forbidden: "Only the project owner can remove collaborators." },
  },
  "profile.updateEmail": {
    default: "We couldn't update your email. Please try again.",
    kinds: {
      invalidCredentials: "Your current password isn't correct.",
      alreadyExists: "That email is already in use by another account.",
      validation: "Please enter a valid email address.",
    },
  },
  "profile.backupEmail": {
    default: "We couldn't update your backup email. Please try again.",
    kinds: {
      alreadyExists: "That email is already linked to an account.",
      invalidCode: "That verification code doesn't match. Please check it and try again.",
      expired: "That verification code has expired. Please request a new one.",
    },
  },
  "profile.avatar": {
    default: "We couldn't update your profile photo. Please try again.",
    kinds: {
      tooLarge: "That photo is too large. Please choose a smaller one.",
      unsupported: "Please use a PNG, JPG or WebP image.",
    },
  },
  "profile.endorse": {
    default: "We couldn't post your endorsement. Please try again.",
    kinds: {
      alreadyExists: "You've already endorsed this person.",
      forbidden: "You can only endorse people you've worked with.",
    },
  },
  "profile.portfolio": {
    default: "We couldn't update your portfolio. Please try again.",
  },

  /* -------------------------------- Messages ------------------------------- */
  "messages.react": {
    default: "We couldn't add that reaction. Please try again.",
  },
  "messages.archive": {
    default: "We couldn't update that conversation. Please try again.",
  },
  "messages.deleteChat": {
    default: "We couldn't delete that conversation. Please try again.",
  },
  "messages.sendRequest": {
    default: "We couldn't send your message request. Please try again.",
    kinds: {
      alreadyExists: "You've already sent this person a message request.",
      forbidden: "You can't message this person right now.",
      rateLimited: "You've sent a lot of requests. Please wait a bit before sending more.",
    },
  },
  "messages.load": {
    default: "We couldn't load your messages. Please refresh and try again.",
  },
  "messages.send": {
    default: "Your message didn't send. Please try again.",
    kinds: {
      forbidden: "You can't message this person yet. Send a message request first.",
      notFound: "This conversation is no longer available.",
    },
  },
  "messages.startChat": {
    default: "We couldn't start that conversation. Please try again.",
    kinds: { forbidden: "You can only message people you're connected with." },
  },
  // Called straight from the chat composer (not through a hook), so use
  // getFriendlyMessage(err, "messages.voiceUpload") in its catch block.
  "messages.voiceUpload": {
    default: "We couldn't upload your voice note. Please try again.",
    kinds: {
      tooLarge: "That voice note is too large. Try a shorter recording.",
      unsupported: "Your browser recorded in a format we can't use. Please try another browser.",
    },
  },
  "messages.attachmentUpload": {
    default: "We couldn't upload that attachment. Please try again.",
    kinds: {
      tooLarge: "That file is too large. Please choose a smaller one.",
      unsupported: "That file type isn't supported in messages.",
    },
  },
  "messages.respondRequest": {
    default: "We couldn't update that message request. Please try again.",
    kinds: {
      notFound: "That request is no longer available.",
      alreadyExists: "You've already responded to this request.",
    },
  },

  /* ------------------------------- Agreements ------------------------------ */
  "agreements.load": {
    default: "We couldn't load the agreements for this project. Please refresh and try again.",
  },
  "agreements.upload": {
    default: "We couldn't upload that agreement. Please try again.",
    kinds: {
      tooLarge: "That agreement file is too large. Please choose a smaller one.",
      unsupported: "Please upload your agreement as a PDF.",
      forbidden: "Only the project owner can create agreements.",
    },
  },
  "agreements.update": {
    default: "We couldn't update that agreement. Please try again.",
    kinds: {
      forbidden: "Only the project owner can edit this agreement.",
      alreadyExists: "This agreement has already been signed, so it can't be edited.",
      tooLarge: "That agreement file is too large. Please choose a smaller one.",
      unsupported: "Please upload your agreement as a PDF.",
    },
  },
  "agreements.delete": {
    default: "We couldn't delete that agreement. Please try again.",
    kinds: {
      forbidden: "Only the project owner can delete this agreement.",
      alreadyExists: "Signed agreements can't be deleted. Request a cancellation instead.",
    },
  },
  "agreements.sign": {
    default: "We couldn't record your signature. Please try again.",
    kinds: {
      identityRequired: "Please verify your identity before signing this agreement.",
      alreadyExists: "You've already signed this agreement.",
      expired: "This agreement has expired and can no longer be signed.",
      forbidden: "You're not listed as a signatory on this agreement.",
    },
  },
  "agreements.requestCancel": {
    default: "We couldn't send your cancellation request. Please try again.",
    kinds: { alreadyExists: "A cancellation request is already waiting on this agreement." },
  },
  "agreements.respondCancel": {
    default: "We couldn't submit your response. Please try again.",
    kinds: { notFound: "That cancellation request is no longer active." },
  },

  /* ---------------------------------- Files -------------------------------- */
  "files.load": {
    default: "We couldn't load the project files. Please refresh and try again.",
  },
  "files.upload": {
    default: "We couldn't upload that file. Please try again.",
    kinds: {
      tooLarge: "That file is over the 50MB limit. Please choose a smaller one.",
      unsupported: "That file type isn't supported. Try WAV, MP3, FLAC, MIDI or PDF.",
      planLimit: "You're out of file storage on your current plan. Upgrade or free up space.",
      forbidden: "You don't have permission to add files to this project.",
    },
  },
  "files.download": {
    default: "We couldn't download that file. Please try again.",
    kinds: { notFound: "That file is no longer available." },
  },
  "files.delete": {
    default: "We couldn't delete that file. Please try again.",
    kinds: { forbidden: "You don't have permission to delete this file." },
  },
  "files.saveToSpace": {
    default: "We couldn't save that file to My Space. Please try again.",
    kinds: {
      alreadyExists: "That file is already in My Space.",
      planLimit: "You're out of file storage on your current plan. Upgrade or free up space.",
      tooLarge: "There isn't enough room in My Space for that file.",
    },
  },
  "mySpace.load": {
    default: "We couldn't load My Space. Please refresh and try again.",
  },
  "mySpace.remove": {
    default: "We couldn't remove that file from My Space. Please try again.",
    kinds: { notFound: "That file has already been removed." },
  },
  "mySpace.download": {
    default: "We couldn't download that file. Please try again.",
    kinds: { notFound: "That file is no longer available." },
  },

  /* ----------------------------- Profile & settings ------------------------ */
  "profile.load": {
    default: "We couldn't load this profile. Please refresh and try again.",
    kinds: {
      notFound: "We couldn't find that profile. It may have been removed.",
      forbidden: "This profile is private.",
    },
  },
  "profile.update": {
    default: "We couldn't save your profile changes. Please try again.",
    kinds: {
      validation: "Please check the highlighted details and try again.",
      tooLarge: "That image is too large. Please choose a smaller one.",
      unsupported: "Please use a PNG, JPG or WebP image.",
      alreadyExists: "That's already taken. Please try a different one.",
    },
  },
  "settings.save": {
    default: "We couldn't save your settings. Please try again.",
  },
  "settings.changePassword": {
    default: "We couldn't change your password. Please try again.",
    kinds: {
      invalidCredentials: "Your current password isn't correct.",
      alreadyExists: "Your new password must be different from your current one.",
      validation: "Your new password needs at least 8 characters, an uppercase letter and a number.",
    },
  },
  "settings.verifyIdentity": {
    default: "Verification failed. Please check your details and try again.",
    // Backend codes (see NinjaKycErrorCode in ninja-kyc.service.ts)
    codes: {
      NIN_ALREADY_LINKED: "This NIN is already linked to another account. If this is yours, contact support.",
      ALREADY_VERIFIED: "Your identity has already been verified.",
      RATE_LIMITED: "Too many attempts. Please try again in 24 hours.",
      DETAILS_MISMATCH: "Those details don't match our records. Please double-check your NIN and date of birth.",
      SERVICE_UNAVAILABLE: "Verification service is temporarily unavailable. Please try again later.",
    },
    // Fallbacks when there's no code (e.g. a bare 409 / 429 / 5xx / no connection)
    kinds: {
      validation: "Those ID details don't look right. Please check them and try again.",
      notFound: "We couldn't match those ID details. Please check them and try again.",
      alreadyExists: "This NIN is already linked to another account. If this is yours, contact support.",
      rateLimited: "Too many attempts. Please try again in 24 hours.",
      server: "Verification service is temporarily unavailable. Please try again later.",
      network: "Verification service is temporarily unavailable. Please try again later.",
    },
  },
  "profile.updatePhone": {
    default: "We couldn't save your phone number. Please try again.",
    kinds: {
      validation: "That phone number doesn't look right. Please check it and include the country code.",
      alreadyExists: "That phone number is already linked to another account.",
    },
  },
  "security.setup2FA": {
    default: "We couldn't start two-factor setup. Please try again.",
    kinds: { alreadyExists: "Two-factor authentication is already turned on for your account." },
  },
  "security.verify2FA": {
    default: "We couldn't verify that code. Please try again.",
    kinds: {
      invalidCode: "That code doesn't match. Check your authenticator app and try again.",
      validation: "That code doesn't match. Check your authenticator app and try again.",
      expired: "That code has expired. Enter the latest code from your authenticator app.",
      rateLimited: "Too many attempts. Please wait a few minutes and try again.",
    },
  },
  "security.logoutAll": {
    default: "We couldn't sign you out of your other devices. Please try again.",
  },
  "security.deactivate": {
    default: "We couldn't deactivate your account. Please try again.",
  },
  "security.delete": {
    default: "We couldn't delete your account. Please try again.",
  },
  "security.dataExport": {
    default: "We couldn't request your data export. Please try again.",
    kinds: { rateLimited: "You requested an export recently. Please check your email or try again later." },
  },
  "support.ticket": {
    default: "We couldn't submit your ticket. Please try again.",
    kinds: {
      validation: "Please add a subject and a message, then try again.",
      rateLimited: "You've sent a few tickets already. Please wait a bit before sending another.",
    },
  },
  "settings.linkAccount": {
    default: "We couldn't link that account. Please try again.",
    kinds: { alreadyExists: "That account is already linked to another profile." },
  },

  /* ------------------------ Wallet, banks, subscriptions ------------------- */
  "wallet.load": {
    default: "We couldn't load your wallet. Please refresh and try again.",
  },
  "bank.load": {
    default: "We couldn't load your bank accounts. Please refresh and try again.",
  },
  "bank.add": {
    default: "We couldn't link that bank account. Please try again.",
    kinds: {
      validation: "Please check your account number and bank, then try again.",
      notFound: "We couldn't verify that account. Please check the account number and bank.",
      alreadyExists: "That bank account is already linked.",
      identityRequired: "Please verify your identity before linking a bank account.",
    },
  },
  "bank.update": {
    default: "We couldn't update that bank account. Please try again.",
    kinds: {
      validation: "Please check your account details and try again.",
      notFound: "That bank account is no longer available.",
    },
  },
  "bank.remove": {
    default: "We couldn't remove that bank account. Please try again.",
    kinds: {
      notFound: "That bank account has already been removed.",
      alreadyExists: "This account can't be removed while a withdrawal is in progress.",
    },
  },
  "withdrawals.load": {
    default: "We couldn't load your withdrawals. Please refresh and try again.",
  },
  "withdrawals.create": {
    default: "We couldn't process your withdrawal. Please try again.",
    kinds: {
      insufficientFunds: "You can't withdraw more than your available balance.",
      validation: "Please enter a valid amount and choose a bank account.",
      identityRequired: "Please verify your identity before withdrawing.",
      notFound: "That bank account is no longer available. Please choose another.",
      rateLimited: "Too many withdrawal attempts. Please wait a bit before trying again.",
    },
  },
  "subscription.load": {
    default: "We couldn't load your subscription details. Please refresh and try again.",
  },
  "subscription.subscribe": {
    default: "We couldn't change your plan. Please try again.",
    kinds: {
      alreadyExists: "You're already on this plan.",
      insufficientFunds: "Your payment didn't go through. Please check your payment method and try again.",
      validation: "We couldn't process that plan selection. Please try again.",
    },
  },
  "subscription.cancel": {
    default: "We couldn't cancel your subscription. Please try again.",
    kinds: { alreadyExists: "Your subscription is already set to cancel." },
  },
  "subscription.reactivate": {
    default: "We couldn't reactivate your subscription. Please try again.",
    kinds: { expired: "This subscription has already ended. Please choose a plan to start again." },
  },

  /* ------------------------ Workspace payments (escrow) -------------------- */
  "payments.load": {
    default: "We couldn't load your payment details. Please refresh and try again.",
  },
  "payments.verifyFunding": {
    default:
      "We couldn't confirm your payment yet. If you were charged, don't worry. Check back shortly or contact support.",
  },
  "payments.fundWallet": {
    default: "We couldn't start your wallet top-up. Please try again.",
    kinds: {
      identityRequired: "Please verify your identity before funding your wallet.",
      validation: "Please enter a valid amount and try again.",
    },
  },
  "payments.escrowSave": {
    default: "We couldn't save your payment terms. Please try again.",
    kinds: {
      forbidden: "Only the project owner can change payment terms.",
      validation: "Please check your milestones and amounts. They need to add up to your project budget.",
    },
  },
  "payments.escrowApprove": {
    default: "We couldn't record your approval. Please try again.",
    kinds: { alreadyExists: "You've already responded to these terms." },
  },
  "payments.escrowRequestChanges": {
    default: "We couldn't send your revision request. Please try again.",
    kinds: {
      validation: "Please add a short note explaining what needs to change.",
      forbidden: "You aren't listed as a collaborator on this escrow.",
      alreadyExists: "You've already responded to these terms.",
    },
  },
  "payments.escrowReject": {
    default: "We couldn't reject the escrow terms. Please try again.",
    kinds: {
      forbidden: "You aren't listed as a collaborator on this escrow.",
      alreadyExists: "You've already responded to these terms.",
    },
  },
  "payments.escrowFund": {
    default: "We couldn't fund the escrow. Please try again.",
    kinds: {
      insufficientFunds: "Your wallet doesn't have enough funds for this escrow. Please top up and try again.",
      forbidden: "Only the project owner can fund the escrow.",
    },
  },

  /* ------------------- Added with the second batch of hooks ---------------- */
  "agreements.loadAll": {
    default: "We couldn't load your agreements. Please refresh and try again.",
  },
  "agreements.uploadSigned": {
    default: "We couldn't upload the signed copy. Please try again.",
    kinds: {
      tooLarge: "That file is too large. Please choose a smaller one.",
      unsupported: "Please upload the signed copy as a PDF.",
      forbidden: "You're not listed as a signatory on this agreement.",
      alreadyExists: "This agreement has already been signed.",
    },
  },
  "projects.update": {
    default: "We couldn't save your project changes. Please try again.",
    kinds: {
      forbidden: "Only the project owner can edit this project.",
      validation: "Please check your project details and try again.",
      notFound: "We couldn't find that project. It may have been removed.",
    },
  },
  "projects.delete": {
    default: "We couldn't delete that project. Please try again.",
    kinds: {
      forbidden: "Only the project owner can delete this project.",
      alreadyExists: "This project can't be deleted while it has funds in escrow or active agreements.",
      notFound: "That project has already been removed.",
    },
  },
  "projects.invite": {
    default: "We couldn't send that invitation. Please try again.",
    kinds: {
      alreadyExists: "That person has already been invited to this project.",
      planLimit: "You've reached the collaborator limit on your current plan. Upgrade to invite more people.",
      forbidden: "Only the project owner can invite collaborators.",
      notFound: "We couldn't find that person.",
    },
  },
  "projects.removeCollaborator": {
    default: "We couldn't remove that collaborator. Please try again.",
    kinds: {
      forbidden: "Only the project owner can remove collaborators.",
      notFound: "That collaborator has already been removed.",
    },
  },
  "invites.load": {
    default: "We couldn't load your invitations. Please refresh and try again.",
  },
  "invites.respond": {
    default: "We couldn't update that invitation. Please try again.",
    kinds: {
      notFound: "That invitation is no longer available.",
      alreadyExists: "You've already responded to this invitation.",
      expired: "That invitation has expired.",
    },
  },
  "applications.load": {
    default: "We couldn't load the applications. Please refresh and try again.",
  },
  "applications.apply": {
    default: "We couldn't send your application. Please try again.",
    kinds: {
      alreadyExists: "You've already applied to this project.",
      forbidden: "You can't apply to this project.",
      notFound: "This project is no longer accepting applications.",
      validation: "Please check your application details and try again.",
    },
  },
  "applications.review": {
    default: "We couldn't update that application. Please try again.",
    kinds: {
      forbidden: "Only the project owner can review applications.",
      notFound: "That application is no longer available.",
      alreadyExists: "This application has already been reviewed.",
      planLimit: "You've reached the collaborator limit on your current plan. Upgrade to accept more people.",
    },
  },
  "applications.cancel": {
    default: "We couldn't cancel that application. Please try again.",
    kinds: { notFound: "That application is no longer available." },
  },
  "paymentMethods.load": {
    default: "We couldn't load your payment methods. Please refresh and try again.",
  },
  "paymentMethods.save": {
    default: "We couldn't save that payment method. Please try again.",
    kinds: {
      validation: "Please check your card details and try again.",
      alreadyExists: "That payment method is already saved.",
    },
  },
  "paymentMethods.setDefault": {
    default: "We couldn't change your default payment method. Please try again.",
    kinds: { notFound: "That payment method is no longer available." },
  },
  "paymentMethods.remove": {
    default: "We couldn't remove that payment method. Please try again.",
    kinds: {
      notFound: "That payment method has already been removed.",
      alreadyExists: "You can't remove your only payment method while a subscription is active.",
    },
  },
} as const satisfies Record<string, ContextRule>;

export type ErrorContext = keyof typeof ERROR_CONTEXTS;

/* -------------------------------------------------------------------------- */
/*  4. Messages for checks that happen in the browser (no API involved)       */
/* -------------------------------------------------------------------------- */

export const CLIENT_MESSAGES = {
  // Auth
  passwordMismatch: "Your passwords don't match. Please try again.",
  passwordTooShort: "Your password needs at least 8 characters.",
  passwordNeedsUppercase: "Please include at least one uppercase letter.",
  passwordNeedsNumber: "Please include at least one number.",
  resetTokenMissing: "This reset link isn't valid. Please request a new one.",
  codeIncomplete: "Please enter the full verification code.",
  emailMissing: "We couldn't find your email. Please try signing up again.",

  // Files & images
  fileTooLarge: (limitMb: number) =>
    `One or more files are over the ${limitMb}MB limit. Please choose smaller ones.`,
  fileFailed: (name: string, reason: string) => `We couldn't upload "${name}". ${reason}`,
  notAnImage: "Please choose an image file (PNG, JPG or WebP).",
  imageTooLarge: (limitMb: number) => `That image is over ${limitMb}MB. Please choose a smaller one.`,
  coverFailedAfterCreate:
    "Your project was created, but the cover image didn't upload. You can add it from the project page.",

  // Money
  withdrawOverBalance: "You can't withdraw more than your available balance.",
  amountInvalid: "Please enter an amount greater than zero.",
  noBankSelected: "Please choose a bank account first.",

  // Identity verification modal
  kycRepeatAttempt: "You just tried these exact details. Edit at least one field before retrying.",
  kycCooldown: "Please wait a moment before trying again.",
  kycMismatch: "Details do not match our records. Please double-check your NIN and date of birth.",
} as const;

/* -------------------------------------------------------------------------- */
/*  5. Detecting the kind from the backend message / status code              */
/*     Order matters: the first match wins.                                   */
/* -------------------------------------------------------------------------- */

// Notes on ordering:
//  - notFound first, so "does not exist" isn't read as "already exists".
//  - expired before invalidCode: "Your OTP has expired" mentions "otp" too.
//  - alreadyExists before unverified: "Email is already verified" mentions "verified" too.
//  - forbidden is last and deliberately excludes "not authorized": a 401 with that
//    message means "log in again" (kindFromStatus), not "no permission".
//  - ['’] accepts curly apostrophes from mobile keyboards / some backends.
const KIND_PATTERNS: [ErrorKind, RegExp][] = [
  ["notFound", /not found|no account|not (yet )?register(ed)?|unregistered|does not exist|doesn['’]?t exist|no such/i],
  ["identityRequired", /identity|kyc|\bnin\b|government id|legal name/i],
  ["expired", /expired/i],
  ["invalidCode", /invalid (code|otp|token)|(code|otp|token).*(incorrect|invalid|wrong)|incorrect (code|otp)|\botp\b/i],
  ["planLimit", /upgrade|plan limit|limit reached|free plan|subscription (required|limit)|storage (full|limit)/i],
  ["tooLarge", /too large|file size|payload too large|exceeds? .*(limit|size)/i],
  ["unsupported", /unsupported|file type|invalid file|mime/i],
  ["insufficientFunds", /insufficient|not enough (funds|balance)/i],
  ["rateLimited", /too many|rate limit|try again later|throttl/i],
  ["locked", /locked|suspend|disabled|banned/i],
  // "(current) password is incorrect/wrong" covers the change-password wording too.
  // "invalid" is deliberately left out of that part: "Password is invalid" is usually a
  // format rule on the NEW password, not a wrong current one.
  ["invalidCredentials", /invalid (credentials|email or password)|wrong password|incorrect password|password (is |was )?(incorrect|wrong)|credentials/i],
  ["alreadyExists", /already|exist|registered|conflict|duplicate/i],
  ["unverified", /verif(y|ied|ication)/i],
  ["forbidden", /forbidden|permission denied|not allowed/i],
];

const kindFromMessage = (raw: string): ErrorKind =>
  KIND_PATTERNS.find(([, re]) => re.test(raw))?.[0] ?? "unknown";

const kindFromStatus = (status?: number): ErrorKind => {
  if (!status) return "unknown";
  if (status === 401) return "unauthorized";
  if (status === 402) return "insufficientFunds";
  if (status === 403) return "forbidden";
  if (status === 404) return "notFound";
  if (status === 409) return "alreadyExists";
  if (status === 413) return "tooLarge";
  if (status === 415) return "unsupported";
  if (status === 400 || status === 422) return "validation";
  if (status === 429) return "rateLimited";
  if (status >= 500) return "server";
  return "unknown";
};

/* -------------------------------------------------------------------------- */
/*  6. Main helpers                                                           */
/* -------------------------------------------------------------------------- */

const isFriendlyError = (error: unknown): error is FriendlyError =>
  typeof error === "object" &&
  error !== null &&
  typeof (error as FriendlyError).message === "string" &&
  typeof (error as FriendlyError).kind === "string";

/**
 * Turns anything thrown (axios error, Error, or a plain string) into a friendly
 * message plus a `kind` the UI can branch on.
 *
 *   const { message, kind } = getFriendlyError(err, "agreements.sign");
 *
 * An already-translated FriendlyError passes straight through. That lets AuthContext
 * translate once (while it still has the HTTP status) and store the FriendlyError, and
 * pages can then call isErrorKind(authError, "notFound") without translating the
 * friendly sentence a second time, which would lose the kind.
 */
export const getFriendlyError = (error: unknown, context?: ErrorContext): FriendlyError => {
  if (isFriendlyError(error)) return error;

  const rule: ContextRule | undefined = context ? ERROR_CONTEXTS[context] : undefined;
  const pick = (kind: ErrorKind) =>
    rule?.kinds?.[kind] ?? GENERIC_BY_KIND[kind] ?? rule?.default ?? GENERIC_MESSAGES.default;

  // No response at all: offline, DNS, CORS, or timeout
  if (axios.isAxiosError(error) && !error.response) {
    if (error.code === "ECONNABORTED") {
      return { message: GENERIC_MESSAGES.timeout, kind: "network" };
    }
    return { message: pick("network"), kind: "network" };
  }

  const status = axios.isAxiosError(error) ? error.response?.status : undefined;

  // A backend error code beats any text matching. This runs before the 5xx rule so a
  // code like SERVICE_UNAVAILABLE (a 503) can carry its own wording.
  const code = errorCodeOf(error);
  if (code) {
    const codeKind = CODE_KINDS[code];
    const custom = rule?.codes?.[code];
    if (custom) return { message: custom, kind: codeKind ?? kindFromStatus(status), status };
    if (codeKind) return { message: pick(codeKind), kind: codeKind, status };
  }

  // Server errors: never show raw backend text
  if (status && status >= 500) {
    return { message: pick("server"), kind: "server", status };
  }

  const raw = typeof error === "string" ? error : getErrorMessage(error);

  // Backend text first (usually more specific), then the status code
  let kind = kindFromMessage(raw);
  if (kind === "unknown") kind = kindFromStatus(status);

  return { message: pick(kind), kind, status };
};

/** Shortcut when you only need the string */
export const getFriendlyMessage = (error: unknown, context?: ErrorContext): string =>
  getFriendlyError(error, context).message;

/** Replaces the useMemo + includes()/regex checks on login, signup and create project */
export const isErrorKind = (error: unknown, kind: ErrorKind, context?: ErrorContext): boolean =>
  getFriendlyError(error, context).kind === kind;