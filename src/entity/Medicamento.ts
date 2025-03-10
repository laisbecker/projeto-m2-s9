import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import { User } from "./User"

@Entity()
export class Medicamento {
    @PrimaryGeneratedColumn()
    id: Number

    @Column()
    nome: string

    @Column()
    descricao: string

    @Column()
    quantidade: number

    @Column()
    userId: number

    @OneToOne(() => User)
    @JoinColumn()
    user: User
}