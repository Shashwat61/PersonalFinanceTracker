import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { UserUpiDetails } from "./UserUpiDetails"

@Entity("user_upi_category_name_mapping")
export class UserUpiCategoryNameMapping extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "uuid",
        nullable: false
    })
    user_id!: string
    
    @Column({
        type: "varchar",
        length: 255,
        nullable: false
    })
    upi_id!: string

    @Column({
        type: "varchar",
        length: 255,
        nullable: true
    })
    upi_name!: string

    @Column({
        type: "uuid",
        nullable: true
    })
    category_id!: string

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

    @ManyToOne(()=> UserUpiDetails, (userUpiDetails) => userUpiDetails.userUpiCategoryNameMappings)
    userUpiDetails!: UserUpiDetails


}
