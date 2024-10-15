import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User"
import { UserUpiDetails } from "./UserUpiDetails"
import { UserBankMapping } from "./UserBankMapping"
import { UserUpiCategoryNameMapping } from "./UserUpiCategoryNameMapping"

@Entity("transaction")
export class Transaction extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
        default: null
    })
    amount!: number

    @Column({
        type: 'varchar',
        length: 255
    })
    upi_id!: string

    @Column({
        type: 'uuid',
        nullable: true,
        default: null
    })
    category_id!: string

    @Column({
        type: 'integer',
        nullable: true,
        default: null
    })
    bank_account_number!: number

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
        type: 'uuid',
        name: "user_id",
        nullable: false
    })
    user_id!: string

    @Column({
        type: 'uuid',
        name: "user_bank_mapping_id",
        nullable: false
    })
    user_bank_mapping_id!: string

    @Column({
        type: 'date',
        nullable: false
    })
    transacted_at!: Date

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

    @Column({
        type: 'varchar',
        nullable: false,
    })
    message_id!: string

    @Column({
        type: 'integer',
        nullable: false,
    })
    sequence!: number

    @Column({
        type: 'uuid',
        nullable: true,
        default: null
    })
    user_upi_category_name_mapping_id!: string

    @ManyToOne(()=> User, (user) => user.transactions, {cascade: true})
    @JoinColumn({name: "user_id"})
    user!: User

    @ManyToOne(()=> UserUpiDetails, (userUpiDetails) => userUpiDetails.transactions, {
        // eager: true,
    })
    @JoinColumn({name: "upi_id", referencedColumnName: "upi_id"})
    userUpiDetails!: UserUpiDetails

    @ManyToOne(() => UserBankMapping, (userBankMapping) => userBankMapping.transactions, { cascade: true})
    @JoinColumn({ name: "user_bank_mapping_id" })
    userBankMapping!: UserBankMapping;

    @ManyToOne(()=> UserUpiCategoryNameMapping, (
        userUpiCategoryNameMapping) => userUpiCategoryNameMapping.transactions, {
        eager: true,
        nullable: true
    })
    @JoinColumn({name: "user_upi_category_name_mapping_id"})
    userUpiCategoryNameMapping?: UserUpiCategoryNameMapping

}
