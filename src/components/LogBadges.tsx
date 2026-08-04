import type { LogStatus, LogType } from "../lib/logs";

export function StatusBadge({ status }: { status: LogStatus }) {
  const slug = status.toLowerCase().replace(/\s+/g, "-");
  return <span className={`log-status-badge log-status-${slug}`}>{status}</span>;
}

export function TypeBadge({ type }: { type: LogType }) {
  return <span className={`log-type-badge log-type-${type}`}>{type}</span>;
}
