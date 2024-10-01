import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn,  Unique, UpdateDateColumn } from "typeorm"
import { Transaction } from "./Transaction"

@Entity("user_bank_mapping")
@Index(["user_id", "bank_id"], {unique: true})
export class UserBankMapping extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "uuid",
        nullable: false
    })
    user_id!: string

    @Column({
        type: "uuid",
        nullable: false
    })
    bank_id!: string

    @Column({
        type: 'timestamp',
        default: 'now()',
        nullable: false
    })
    created_at!: Date

    @UpdateDateColumn()
    @Column({
        type: 'timestamp',
        default: 'now()',
        nullable: false
    })
    updated_at!: Date


    @OneToMany(()=> Transaction, (transaction)=> transaction.userBankMapping)
    transactions!: Transaction[]
}
