import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTransactionTable1723350863018 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'amount',
            type: 'numeric',
            default: null,
            precision: 10,
            scale: 2,
          },
          {
            name: 'payee_upi_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'receiver_upi_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true,
            default: null,
          },
          {
            name: 'bank_account_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'transaction_metadata_id',
            type: 'uuid',
            isNullable: true,
            default: null,
          },
          {
            name: 'transaction_type',
            type: 'enum',
            enum: ['credit', 'debit'],
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: null,
            length: '255',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
        indices: [
          {
            columnNames: ['payee_upi_id'],
            name: 'IDX_TRANSACTION_PAYEE_UPI_ID',
          },
          {
            columnNames: ['receiver_upi_id'],
            name: 'IDX_TRANSACTION_RECEIVER_UPI_ID',
          },
          {
            columnNames: ['category_id'],
            name: 'IDX_TRANSACTION_CATEGORY_ID',
          },
          {
            columnNames: ['bank_account_id'],
            name: 'IDX_TRANSACTION_BANK_ACCOUNT_ID',
          },
          {
            columnNames: ['transaction_metadata_id'],
            name: 'IDX_TRANSACTION_TRANSACTION_METADATA_ID',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['payee_upi_id'],
            referencedTableName: 'user_upi_details',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['receiver_upi_id'],
            referencedTableName: 'user_upi_details',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['category_id'],
            referencedTableName: 'category',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['bank_account_id'],
            referencedTableName: 'bank_account',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['transaction_metadata_id'],
            referencedTableName: 'transaction_metadata',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transaction');
  }
}
