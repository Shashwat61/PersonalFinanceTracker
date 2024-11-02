import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddBankAccountNumberColumnInUserBankMappingTable1729407095562
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_bank_mapping',
      new TableColumn({
        name: 'account_number',
        type: 'integer',
        isNullable: false,
      }),
    );
    await queryRunner.dropIndex(
      'user_bank_mapping',
      'IDX_8bc61f1c707324ec4445723384',
    );

    await queryRunner.createIndex(
      'user_bank_mapping',
      new TableIndex({
        columnNames: ['account_number', 'user_id', 'bank_id'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'user_bank_mapping',
      new TableIndex({
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user_bank_mapping', 'account_number');
    await queryRunner.dropColumn('user_bank_mapping', 'account_number');
    await queryRunner.createIndex(
      'user_bank_mapping',
      new TableIndex({
        columnNames: ['user_id', 'bank_id'],
        isUnique: true,
      }),
    );
  }
}
