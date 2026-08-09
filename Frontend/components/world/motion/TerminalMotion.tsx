"use client";

export default function TerminalMotion() {
  return (
    <div
      className="pointer-events-none absolute inset-0 grid items-center justify-items-start overflow-hidden ps-8 font-world-mono text-sm text-world-primary"
      aria-hidden="true"
    >
      <span>&gt; boot multiverse_store</span>
      <span>✓ theme engine online</span>
      <span>&gt; </span>
      <span className="world-motion__cursor" />
    </div>
  );
}
