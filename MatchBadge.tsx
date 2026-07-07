import { MatchType } from "@/services/scriptureSearchService";

// Calm, reverent color treatment for each confidence tier. Kept gentle on
// purpose — these are quiet assurances, not alarms.
const STYLES: Record<MatchType, string> = {
  "Exact Match": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Strong Match": "bg-primary/10 text-primary border-primary/20",
  "Possible Match": "bg-amber-100 text-amber-800 border-amber-200",
  "Theme Match": "bg-muted text-muted-foreground border-border",
};

export function MatchBadge({
  matchType,
  className = "",
}: {
  matchType: MatchType;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${STYLES[matchType]} ${className}`}
      data-testid={`badge-match-${matchType.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {matchType}
    </span>
  );
}
