import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User"

@Entity("bank")
export class Bank extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: false
    })
    name!: string

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
        nullable: true
    })
    listener_email?: string

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

    @ManyToMany(type => User, user => user.banks)
    users!: User[]
    
}
