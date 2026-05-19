import { getSiteUrl } from "@/lib/utils";

const TOKEN_LENGTH = 12;
const TOKEN_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export function generateInviteToken() {
  const bytes = new Uint8Array(TOKEN_LENGTH);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { randomBytes } = require("crypto") as typeof import("crypto");
    const nodeBytes = randomBytes(TOKEN_LENGTH);
    bytes.set(nodeBytes);
  }

  let token = "";
  for (let i = 0; i < TOKEN_LENGTH; i += 1) {
    token += TOKEN_ALPHABET[bytes[i] % TOKEN_ALPHABET.length];
  }

  return token;
}

export function getListingInviteUrl(token: string) {
  return `${getSiteUrl()}/listing/${token}`;
}

export type InviteStatus = "active" | "inactive";
export type ApprovalStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "needs_changes"
  | "hidden";
