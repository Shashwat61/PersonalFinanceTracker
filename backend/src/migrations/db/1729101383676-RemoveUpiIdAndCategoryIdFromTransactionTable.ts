import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUpiIdAndCategoryIdFromTransactionTable1729101383676
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "upi_id"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "category_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" ADD "upi_id" uuid`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "category_id" uuid`);
  }
}
