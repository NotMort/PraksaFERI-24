import { Column, Entity, JoinColumn, JoinTable, ManyToMany } from "typeorm";
import { Base } from "./base.entity";
import { Premission } from "./premission.entity";

@Entity()
export class Role extends Base{
    @Column()
    name: string

    //
    @ManyToMany(()=> Premission, {cascade:true})
    @JoinTable({
        name:'role premission',
        joinColumn: {name:'role_id',referencedColumnName:'id'},
        inverseJoinColumn: {name:'premission_id',referencedColumnName:'id'},
})
premissions:Premission[]
}