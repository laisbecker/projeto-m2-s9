import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @Column({default: new Date})
    created_at: Date

    @ManyToMany(() => Role)
    @JoinColumn({name: "permissionRoles"})
    roles: Role[]
}