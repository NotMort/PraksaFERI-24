import { Column, Entity, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { Exclude } from "class-transformer";
import { OrderItem } from "./order-item.entity";

@Entity()
export class Order extends Base{
    @Column()
    @Exclude()
    first_name:string
    @Column()
    @Exclude()
    last_name:string
    @Column()
    email:string
    @OneToMany(()=>OrderItem,(OrderItem)=>OrderItem.order)
    order_items:OrderItem[]

    get name():string{
        return `${this.first_name} ${this.last_name}`
    }

    get total():number{
        return this.order_items.reduce((sum,item)=> sum+item.quantity*item.price,0)
    }
}