import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserUpiDetails } from './UserUpiDetails';
import { Transaction } from './Transaction';
import { Category } from './Category';

@Entity('user_upi_category_name_mapping')
export class UserUpiCategoryNameMapping extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id!: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  upi_id!: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  upi_name!: string | null;

  @Column({
    type: 'uuid',
    nullable: true,
    default: null,
  })
  category_id!: string | null;

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

  @ManyToOne(
    () => UserUpiDetails,
    (userUpiDetails) => userUpiDetails.userUpiCategoryNameMappings,
  )
  @JoinColumn({
    name: 'upi_id',
    referencedColumnName: 'upi_id',
  })
  userUpiDetails!: UserUpiDetails;

  @OneToMany(
    () => Transaction,
    (transaction) => transaction.userUpiCategoryNameMapping,
  )
  transactions!: Transaction[];

  @ManyToOne(
    () => Category,
    (category) => category.userUpiCategoryNameMappings,
    {
      eager: true,
    },
  )
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
  })
  category!: Category;
}
