import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { UserAuth } from "src/common/decorator/auth.decorator";

@Controller("order")
@ApiTags("order")
@UserAuth()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  getMyOrder() {
    return this.orderService.getAllOrdered();
  }

  @Get("/:id")
  findOneById(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.findById(id);
  }
  @Get("/set-in-process/:id")
  setInProcess(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.setInProcess(id);
  }
  @Get("/set-pack/:id")
  setPacked(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.setPacked(id);
  }
  @Get("/set-to-transit/:id")
  setToTransit(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.setToTransit(id);
  }
  @Get("/delivery/:id")
  delivery(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.delivery(id);
  }
  @Get("/canceled/:id")
  canceled(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.canceled(id);
  }
}
