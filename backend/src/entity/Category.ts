import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity("category")
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: "varchar",
        length: 255,
        nullable: false
    })
    name!: string

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
