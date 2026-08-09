import { UserDto } from "./user.dto";

// SessionDto — the frontend's Frontend/lib/api/types.ts SessionDto. POST
// /users/session and the (mock-era) login/register endpoints all return this
// shape; it never contains a Firebase ID token, access token, or refresh token
// — only the application User, whose session lives in the httpOnly cookie.
export interface SessionDto {
  user: UserDto;
}
