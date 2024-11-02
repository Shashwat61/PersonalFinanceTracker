import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('watch_email_user_mapping')
@Index(['watch_email_id', 'user_id'], { unique: true })
export class WatchEmailUserMapping extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  watch_email_id!: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  user_id!: string;

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
}
