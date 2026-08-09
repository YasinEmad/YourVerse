import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

// Marks a route as not requiring a session. Phase 0 has no global auth guard
// yet, so this is declarative for now; Phase 4 adds the guard and reads this key.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
