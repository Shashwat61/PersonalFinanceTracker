import { UUID } from 'crypto';
import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { WatchEmail } from './WatchEmail';
import { Transaction } from './Transaction';
import { UserUpiDetails } from './UserUpiDetails';
import { UserBankMapping } from './UserBankMapping';
import { Bank } from './Bank';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    default: null,
    length: '255',
  })
  name!: string;
  @Index('IDX_USER_EMAIL', { unique: true })
  @Column({
    type: 'varchar',
    default: null,
    length: '255',
  })
  email!: string;

  @Column({
    type: 'timestamp',
    default: 'now()',
    nullable: false,
  })
  created_at!: Date;

  @UpdateDateColumn()
  @Column({
    type: 'timestamp',
    default: 'now()',
    nullable: false,
  })
  updated_at!: Date;

  @ManyToMany((type) => WatchEmail, (watchEmail) => watchEmail.users, {
    cascade: true,
  })
  watchEmails!: WatchEmail[];

  @OneToMany(() => UserUpiDetails, (userUpiDetails) => userUpiDetails.user)
  userUpiDetails!: UserUpiDetails[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions!: Transaction[];

  @ManyToMany((type) => Bank)
  @JoinTable({
    name: 'user_bank_mapping',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'bank_id',
      referencedColumnName: 'id',
    },
  })
  banks!: Bank[];

  @OneToMany(() => UserBankMapping, (userBankMapping) => userBankMapping.user)
  userBankMappings!: UserBankMapping[];
}
