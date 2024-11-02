import {
  MigrationInterface,
  QueryRunner,
  QueryRunnerAlreadyReleasedError,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class UpdateTransactionTableColumns1729932039881
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'transaction',
      'message_id',
      new TableColumn({
        name: 'message_id',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'transaction',
      new TableColumn({
        name: 'mode',
        type: 'enum',
        enum: ['online', 'cash'],
        isNullable: false,
        default: "'online'",
      }),
    );

    await queryRunner.createIndex(
      'transaction',
      new TableIndex({ columnNames: ['mode'] }),
    );

    await queryRunner.changeColumn(
      'transaction',
      'amount',
      new TableColumn({
        name: 'amount',
        type: 'numeric',
        isNullable: false,
        precision: 10,
        scale: 2,
      }),
    );

    await queryRunner.changeColumn(
      'transaction',
      'bank_account_number',
      new TableColumn({
        name: 'bank_account_number',
        type: 'varchar',
        isNullable: false,
        length: '4',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'transaction',
      'message_id',
      new TableColumn({
        name: 'message_id',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.dropColumn('transaction', 'mode');
    await queryRunner.changeColumn(
      'transaction',
      'amount',
      new TableColumn({
        name: 'amount',
        type: 'numeric',
        isNullable: true,
        precision: 10,
        scale: 2,
      }),
    );

    await queryRunner.changeColumn(
      'transaction',
      'bank_account_number',
      new TableColumn({
        name: 'bank_account_number',
        type: 'varchar',
        isNullable: true,
        length: '4',
      }),
    );
  }
}
