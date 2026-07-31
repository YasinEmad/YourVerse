import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getWorldConfig } from "@/config/worlds";
import { WorldProvider } from "@/components/world/WorldProvider";

export default function WorldLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { worldSlug: string };
}) {
  const config = getWorldConfig(params.worldSlug);
  if (!config || !config.isActive) {
    notFound();
  }

  return <WorldProvider config={config}>{children}</WorldProvider>;
}
