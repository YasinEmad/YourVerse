import { IsNotEmpty, IsString } from "class-validator";

// POST /users/session request body. The Firebase ID token minted by the
// frontend's Firebase Auth client. The backend verifies it server-side with
// the Firebase Admin SDK and never returns it (or any other credential).
export class SessionRequestDto {
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
