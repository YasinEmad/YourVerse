"use client";

export default function TerminalMotion() {
  return (
    <div className="world-motion world-motion--terminal" aria-hidden="true">
      <span>&gt; boot multiverse_store</span>
      <span>✓ theme engine online</span>
      <span>&gt; </span>
      <span className="world-motion__cursor" />
    </div>
  );
}
