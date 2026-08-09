// UserDto — the frontend's Frontend/lib/api/types.ts UserDto, field-for-field.
// loyaltyPoints is always present because the frontend contract requires it;
// with no Loyalty module yet the honest value is 0 (a later phase adds the
// real account). name/favoriteWorld are omitted when absent rather than sent
// as null, matching the frontend's optional fields.
export interface UserDto {
  id: string;
  email: string;
  name?: string;
  favoriteWorld?: string;
  loyaltyPoints: number;
}
