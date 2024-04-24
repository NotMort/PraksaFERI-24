import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItem } from "entities/order-item.entity";
import { Order } from "entities/order.entity";
import { OrdersController } from "./orders.controller";
import { OrderService } from "./orders.service";

@Module({
    imports:[TypeOrmModule.forFeature([Order, OrderItem])],
    controllers:[OrdersController],
    providers: [OrderService],
})
export class OrderModule{

}