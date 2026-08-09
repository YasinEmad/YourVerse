import { ProductListItemDto } from "./product-list-item.dto";

// Mirrors ProductDetailDto in Frontend/lib/api/types.ts exactly
// (ProductDetailDto extends ProductViewModel).
export class ProductDetailDto extends ProductListItemDto {}
