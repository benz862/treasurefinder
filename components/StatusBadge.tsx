interface StatusBadgeProps {
  status: string;
  variant?: "default" | "payment";
}

const styles: Record<string, string> = {
  draft: "bg-charcoal/10 text-charcoal",
  submitted: "bg-yellow/40 text-charcoal",
  approved: "bg-leaf/20 text-leaf",
  needs_changes: "bg-coral/20 text-coral",
  hidden: "bg-charcoal/10 text-charcoal/70",
  active: "bg-leaf/20 text-leaf",
  inactive: "bg-charcoal/10 text-charcoal/70",
  published: "bg-leaf/20 text-leaf",
  paid: "bg-leaf/20 text-leaf",
  unpaid: "bg-coral/20 text-coral",
  pending: "bg-yellow/40 text-charcoal",
};

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const key = variant === "payment" ? status : status;
  const className = styles[key] || "bg-charcoal/10 text-charcoal";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${className}`}>
      {status}
    </span>
  );
}
