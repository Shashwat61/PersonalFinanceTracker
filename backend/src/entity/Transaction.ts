import { BaseEntity, Column, Double, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User"

@Entity("transaction")
export class Transaction extends BaseEntity{
    @PrimaryColumn("uuid")
    id!: string

    @Column()
    amount!: Double

    @Column({
        type: 'uuid',
        nullable: true,
        default: null
    })
    payee_upi_id!: string

    @Column({
        type: 'uuid',
        nullable: true,
        default: null
    })
    user_id!: string

    @Column({
        type: 'uuid',
        nullable: true,
        default: null
    })
    category_id!: string

    @Column({
        type: 'uuid',
        nullable: true,
        default: null
    })
    bank_account_id!: string

    @Column({
        type: 'uuid',
        nullable: true,
        default: null
    })
    transaction_metadata_id!: string

    @Column({
        type: 'enum',
        enum: ['credit', 'debit']
    })
    transaction_type!: string
    
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

    @ManyToOne(()=> User, (user) => user.transactions)
    user!: User




}
