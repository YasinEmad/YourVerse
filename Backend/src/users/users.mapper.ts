import { UserDto } from "./dto/user.dto";
import { UserRow } from "./user.row";

// Serializes a User row to the frontend contract shape. Optional fields are
// omitted when absent (never null), matching UserDto's optional members.
export function toUserDto(user: UserRow): UserDto {
  return {
    id: user.id,
    email: user.email,
    // No Loyalty module exists yet — the DTO contract requires the field, so
    // it is always present and always 0 for now (backend-architecture.md §4).
    loyaltyPoints: 0,
    ...(user.name ? { name: user.name } : {}),
    ...(user.favoriteWorldSlug ? { favoriteWorld: user.favoriteWorldSlug } : {}),
  };
}
