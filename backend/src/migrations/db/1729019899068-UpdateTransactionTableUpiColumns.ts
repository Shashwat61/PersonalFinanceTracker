import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class UpdateTransactionTableUpiColumns1729019899068
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transaction', 'payee_upi_id');
    await queryRunner.dropColumn('transaction', 'receiver_upi_id');
    await queryRunner.addColumn(
      'transaction',
      new TableColumn({
        name: 'upi_id',
        type: 'varchar',
        isNullable: false,
      }),
    );
    await queryRunner.createIndex(
      'transaction',
      new TableIndex({
        columnNames: ['upi_id'],
        name: 'IDX_TRANSACTION_UPI_ID',
      }),
    );
    await queryRunner.createForeignKey(
      'transaction',
      new TableForeignKey({
        columnNames: ['upi_id'],
        referencedTableName: 'user_upi_details',
        referencedColumnNames: ['upi_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'transaction',
      new TableColumn({
        name: 'payee_upi_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'transaction',
      new TableColumn({
        name: 'receiver_upi_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createIndex(
      'transaction',
      new TableIndex({
        columnNames: ['payee_upi_id'],
        name: 'IDX_TRANSACTION_PAYEE_UPI_ID',
      }),
    );
    await queryRunner.createIndex(
      'transaction',
      new TableIndex({
        columnNames: ['receiver_upi_id'],
        name: 'IDX_TRANSACTION_RECEIVER_UPI_ID',
      }),
    );
    await queryRunner.createForeignKey(
      'transaction',
      new TableForeignKey({
        columnNames: ['payee_upi_id'],
        referencedTableName: 'user_upi_details',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'transaction',
      new TableForeignKey({
        columnNames: ['receiver_upi_id'],
        referencedTableName: 'user_upi_details',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.dropColumn('transaction', 'upi_id');
  }
}
