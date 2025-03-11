import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Permission } from "./Permission";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @Column({default: new Date})
    created_at: Date

    @ManyToMany(() => User)
    @JoinTable({name: "userRoles"})
    users: User[]

    @ManyToMany(() => Permission)
    @JoinTable({name: "permissionRoles"})
    permissions: Permission[]
}