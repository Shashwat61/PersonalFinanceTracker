import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddIndexToCategoryIdInUserUpiCategoryNameMappingTable1728828950265
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'user_upi_category_name_mapping',
      new TableIndex({
        columnNames: ['category_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'user_upi_category_name_mapping',
      'category_id',
    );
  }
}
