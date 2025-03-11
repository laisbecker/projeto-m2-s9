import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { Role } from "./Role"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    email: string

    @Column()
    senha: string

    @ManyToMany(()=> Role)
    @JoinTable({name: "userRoles"})
    roles: Role[]
}
