import React from "react";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="container page">
      {children}
    </main>
  );
}
