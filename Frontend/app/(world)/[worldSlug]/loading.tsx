export default function WorldLoading() {
  return (
    <div className="world-loading" role="status" aria-live="polite">
      <span className="world-loading__spinner" aria-hidden="true" />
      <span className="world-loading__label">Loading world…</span>
    </div>
  );
}
