// Thrown by cart mutations when no session can be resolved (no header/cookie,
// or a tampered id that fails verification). Rendered by AllExceptionsFilter as
// the EXACT mock shape { error: "Missing session" } / 400 — the frontend's
// existing cart error handling depends on that mock behavior (see
// app/api/mock/cart/items/route.ts).
export class MissingSessionException extends Error {
  constructor(message = "Missing session") {
    super(message);
    this.name = "MissingSessionException";
  }
}
