import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main
      id="main-content"
      className="auth-main grid min-h-dvh place-items-center bg-world-bg px-6 py-8 text-world-text"
    >
      {children}
    </main>
  );
}
