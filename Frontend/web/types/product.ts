export interface ProductViewModel {
  slug: string;
  title: string;
  subtitle?: string;
  primaryMeta?: string;
  secondaryMeta?: string;
  price: number;
  currency: string;
  badge?: string;
  imageUrl?: string;
  accentColor?: string;
  available: boolean;
}
