import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveUserIdFromTransactionTable1724606577346
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transaction', 'user_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
