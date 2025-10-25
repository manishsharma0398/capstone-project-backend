import type { ListingType } from "../db/schema";

interface NormalizedGoogleUser {
  firstName: string;
  lastName: string;
  email: string;
  provider: ListingType.GOOGLE;
}
