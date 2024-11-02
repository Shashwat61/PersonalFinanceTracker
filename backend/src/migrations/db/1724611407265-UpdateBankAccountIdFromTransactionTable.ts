import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class UpdateBankAccountIdFromTransactionTable1724611407265
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transaction', 'bank_account_id');
    await queryRunner.addColumn(
      'transaction',
      new TableColumn({
        name: 'bank_account_number',
        type: 'integer',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.createIndex(
      'transaction',
      new TableIndex({
        name: 'IDX_TRANSACTION_BANK_ACCOUNT_NUMBER',
        columnNames: ['bank_account_number'],
      }),
    );

    await queryRunner.addColumn(
      'transaction',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      }),
    );
    await queryRunner.createForeignKey(
      'transaction',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex(
      'transaction',
      new TableIndex({
        name: 'IDX_TRANSACTION_USER_ID',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.addColumn(
      'transaction',
      new TableColumn({
        name: 'transacted_at',
        type: 'date',
        isNullable: false,
      }),
    );
    await queryRunner.createIndex(
      'transaction',
      new TableIndex({
        columnNames: ['transacted_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'transaction',
      'IDX_TRANSACTION_BANK_ACCOUNT_NUMBER',
    );
    await queryRunner.dropColumn('transaction', 'bank_account_number');
    await queryRunner.addColumn(
      'transaction',
      new TableColumn({
        name: 'bank_account_id',
        type: 'uuid',
        isNullable: false,
      }),
    );
    await queryRunner.dropIndex('transaction', 'IDX_TRANSACTION_USER_ID');
    await queryRunner.dropForeignKey('transaction', 'user_id');
    await queryRunner.dropColumn('transaction', 'user_id');
    await queryRunner.dropIndex('transaction', 'transacted_at');
  }
}
