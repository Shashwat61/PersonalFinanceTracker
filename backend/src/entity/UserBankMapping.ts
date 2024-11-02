import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './Transaction';
import { User } from './User';
import { Bank } from './Bank';

@Entity('user_bank_mapping')
@Index(['user_id', 'bank_id'], { unique: true })
export class UserBankMapping extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id!: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  bank_id!: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  account_number!: number;

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

  @OneToMany(() => Transaction, (transaction) => transaction.userBankMapping)
  transactions!: Transaction[];

  @ManyToOne(() => User, (user) => user.userBankMappings)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user!: User;

  @ManyToOne(() => Bank, (bank) => bank.userBankMappings, {
    eager: true,
  })
  @JoinColumn({
    name: 'bank_id',
    referencedColumnName: 'id',
  })
  bank!: Bank;
}
