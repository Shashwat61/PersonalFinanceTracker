import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

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
}
