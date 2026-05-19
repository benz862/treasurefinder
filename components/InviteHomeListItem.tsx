"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { getListingInviteUrl } from "@/lib/invite";
import type { Home } from "@/types/database";
import { Check, Copy, Link2, Pencil, Trash2, XCircle } from "lucide-react";

interface InviteHomeListItemProps {
  home: Home;
  onEdit: (home: Home) => void;
  onDelete: (homeId: string) => void;
  onApprove: (homeId: string) => void;
  onReject: (homeId: string) => void;
  onDeactivateInvite: (homeId: string) => void;
}

export function InviteHomeListItem({
  home,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onDeactivateInvite,
}: InviteHomeListItemProps) {
  const [copied, setCopied] = useState(false);

  async function copyInviteLink() {
    if (!home.invite_token) return;
    await navigator.clipboard.writeText(getListingInviteUrl(home.invite_token));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-teal-100 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-charcoal">
              {home.seller_name || "Invited Home"}
            </p>
            <StatusBadge status={home.approval_status} />
            {home.invite_status === "inactive" && (
              <StatusBadge status="inactive" />
            )}
          </div>
          <p className="mt-1 text-sm text-charcoal/60">
            {home.address || "Waiting for homeowner to add address"}
          </p>
          {home.seller_email && (
            <p className="mt-1 text-xs text-charcoal/50">{home.seller_email}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {home.invite_token && home.invite_status === "active" && (
            <button
              type="button"
              onClick={copyInviteLink}
              className="inline-flex items-center gap-1 rounded-full border border-teal-200 px-3 py-1.5 text-sm text-teal hover:bg-teal/5"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy Link"}
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(home)}
            className="inline-flex items-center gap-1 rounded-full border border-teal-200 px-3 py-1.5 text-sm text-teal hover:bg-teal/5"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          {home.approval_status === "submitted" && (
            <>
              <button
                type="button"
                onClick={() => onApprove(home.id)}
                className="rounded-full bg-leaf/20 px-3 py-1.5 text-sm font-medium text-leaf"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => onReject(home.id)}
                className="rounded-full bg-coral/10 px-3 py-1.5 text-sm font-medium text-coral"
              >
                Request Changes
              </button>
            </>
          )}
          {home.invite_token && home.invite_status === "active" && (
            <button
              type="button"
              onClick={() => onDeactivateInvite(home.id)}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-charcoal/60 hover:bg-charcoal/5"
            >
              <XCircle className="h-4 w-4" />
              Deactivate
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(home.id)}
            className="rounded-full p-1.5 text-coral hover:bg-coral/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {home.invite_token && home.invite_status === "active" && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-teal/5 px-3 py-2 text-xs text-charcoal/70">
          <Link2 className="h-4 w-4 shrink-0 text-teal" />
          <span className="truncate">{getListingInviteUrl(home.invite_token)}</span>
        </div>
      )}
    </div>
  );
}
