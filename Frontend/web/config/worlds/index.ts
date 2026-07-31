import type { WorldConfig } from "@/types/world-config";
import { worldConfigSchema } from "./world-config.schema";
import { techWorldConfig } from "./tech.config";
import { gamingWorldConfig } from "./gaming.config";
import { animeWorldConfig } from "./anime.config";
import { poetryWorldConfig } from "./poetry.config";
import { footballWorldConfig } from "./football.config";
import { chessWorldConfig } from "./chess.config";

export const worldConfigs: WorldConfig[] = [
  techWorldConfig,
  gamingWorldConfig,
  animeWorldConfig,
  poetryWorldConfig,
  footballWorldConfig,
  chessWorldConfig,
];

for (const config of worldConfigs) {
  const result = worldConfigSchema.safeParse(config);
  if (!result.success) {
    const detail = result.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid world config for slug "${config.slug}": ${detail}`);
  }
}

const worldRegistry = new Map(worldConfigs.map((config) => [config.slug, config]));

export function getWorldConfig(slug: string): WorldConfig | undefined {
  return worldRegistry.get(slug);
}

export function getAllWorldSlugs(): string[] {
  return worldConfigs.map((config) => config.slug);
}

export function getActiveWorldConfigs(): WorldConfig[] {
  return worldConfigs.filter((config) => config.isActive);
}
