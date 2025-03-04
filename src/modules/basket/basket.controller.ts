import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { BasketService } from "./basket.service";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";
import { BasketDto } from "./dto/basket.dto";
import { UserAuth } from "src/common/decorator/auth.decorator";

@Controller("basket")
@ApiTags("basket")
@UserAuth()
export class BasketController {
  constructor(private basketService: BasketService) {}

  @Post("add-to-basket")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }

  @Get()
  getBasket() {
    return this.basketService.getUserBasket();
  }
}
