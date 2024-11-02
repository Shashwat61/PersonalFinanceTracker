import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddForeignKeyInTransactionTable1724595000047
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'transaction',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
        name: 'IDX_TRANSACTION_USER_ID',
      }),
    );
    await queryRunner.createIndex(
      'transaction',
      new TableIndex({
        name: 'IDX_TRANSACTION_USER_ID',
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transaction', 'IDX_TRANSACTION_USER_ID');
  }
}
