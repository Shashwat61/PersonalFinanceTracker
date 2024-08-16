import { UUID } from "crypto"
import { BaseEntity, Column, Entity, Generated, Index, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm"

@Entity("user")
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: "varchar",
        default: null,
        length: "255"
    })
    name! : string;
    @Index("IDX_USER_EMAIL", {unique: true})
    @Column({
        type: "varchar",
        default: null,
        length: "255"
    })
    email!: string;

    @Column({
        type: "timestamp",
        default: "now()",
        nullable: false
    })
    created_at!: Date;

    @UpdateDateColumn()
    @Column({
        type: "timestamp",
        default: "now()",
        nullable: false
    })
    updated_at!: Date;
}
