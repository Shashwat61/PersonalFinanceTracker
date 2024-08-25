import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Transaction } from "./Transaction"
import { User } from "./User"

@Entity("user_upi_details")
export class UserUpiDetails extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "uuid",
        nullable: true
    })
    user_id!: string

    @Column({
        type: "varchar",
        length: "255",
        nullable: false
    })
    upi_id!: string

    @Column({
        type: "timestamp",
        default: "now()",
        nullable: false
    })
    created_at!: Date

    @UpdateDateColumn()
    @Column({
        type: "timestamp",
        default: "now()",
        nullable: false
    })
    updated_at!: Date

    @OneToMany(()=>Transaction, (transaction) => transaction.userUpiDetails)
    transactions!: Transaction[]

    @ManyToOne(()=> User, (user) => user.userUpiDetails)
    user!: User
}
