import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

@Entity()
export class Premission extends Base{
    @Column()
    name: string
}