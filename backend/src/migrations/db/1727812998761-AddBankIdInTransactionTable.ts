import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddBankIdInTransactionTable1727812998761
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'transaction',
      new TableColumn({
        name: 'user_bank_mapping_id',
        type: 'uuid',
        isNullable: false,
      }),
    );
    await queryRunner.createForeignKey(
      'transaction',
      new TableForeignKey({
        columnNames: ['user_bank_mapping_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user_bank_mapping',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transaction', 'user_bank_mapping_id');
    await queryRunner.dropForeignKey('transaction', 'user_bank_mapping_id');
  }
}
