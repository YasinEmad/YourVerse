// Row shape read from Prisma (the application User). Exported so the contract
// test can build a representative sample and the auth guard can attach the row
// to the request.
export interface UserRow {
  id: string;
  firebaseUid: string;
  email: string;
  name: string | null;
  favoriteWorldSlug: string | null;
  createdAt: Date;
  updatedAt: Date;
}
