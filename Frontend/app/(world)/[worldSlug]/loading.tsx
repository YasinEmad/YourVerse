export default function WorldLoading() {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-world-text-muted"
      role="status"
      aria-live="polite"
    >
      <span className="world-loading__spinner block h-8 w-8 rounded-full border-2 border-world-border border-t-world-primary" aria-hidden="true" />
      <span className="text-sm">Loading world…</span>
    </div>
  );
}
