import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User"
import { UserBankMapping } from "./UserBankMapping"

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
    @JoinTable({
        name: "user_bank_mapping",
        joinColumn: {
            name: "bank_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        }
    })
    users!: User[]

    @OneToMany(type => UserBankMapping, userBankMapping => userBankMapping.bank)
    userBankMappings!: UserBankMapping[]
    
}
