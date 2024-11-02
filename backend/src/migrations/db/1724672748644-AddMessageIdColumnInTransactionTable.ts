import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddMessageIdColumnInTransactionTable1724672748644
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'transaction',
      new TableColumn({
        name: 'message_id',
        type: 'varchar',
      }),
    );
    await queryRunner.createIndex(
      'transaction',
      new TableIndex({
        name: 'IDX_TRANSACTION_MESSAGE_ID',
        columnNames: ['message_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('transaction', 'IDX_TRANSACTION_MESSAGE_ID');
    await queryRunner.dropColumn('transaction', 'message_id');
  }
}
