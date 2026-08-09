import { Controller, Get, Headers, Param, Query } from "@nestjs/common";
import { Public } from "../common/auth/public.decorator";
import { GetProductQueryDto } from "./dto/get-product.query.dto";
import { ListProductsQueryDto } from "./dto/list-products.query.dto";
import { ProductDetailDto } from "./dto/product-detail.dto";
import { ProductListResponseDto } from "./dto/product-list-response.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Public()
  list(
    @Query() query: ListProductsQueryDto,
    @Headers("x-locale") locale?: string,
  ): Promise<ProductListResponseDto> {
    return this.productsService.list(query, locale);
  }

  @Get(":slug")
  @Public()
  detail(
    @Param("slug") slug: string,
    @Query() query: GetProductQueryDto,
    @Headers("x-locale") locale?: string,
  ): Promise<ProductDetailDto> {
    return this.productsService.detail(slug, query.world, locale);
  }
}
