import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserUpiCategoryNameMappingTableColumns1729940482026
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_upi_category_name_mapping',
      'upi_id',
      new TableColumn({
        name: 'upi_id',
        type: 'varchar',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_upi_category_name_mapping',
      'upi_id',
      new TableColumn({
        name: 'upi_id',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
