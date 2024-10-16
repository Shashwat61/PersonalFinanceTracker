import { BaseEntity, Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { WatchEmailUserMapping } from "./WatchEmailUserMapping";
import { User } from "./User";

@Entity("watch_email")
export class WatchEmail extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Index({unique: true})
    @Column({
        type: "varchar",
        length: "255",
        nullable: false
    })
    email!: string

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

    @ManyToMany((type)=> User, (user) => user.watchEmails)
    @JoinTable({
        name: "watch_email_user_mapping",
        joinColumn: {
            name: "watch_email_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        }
    })
    users!: User[]
    



    // add index

}
