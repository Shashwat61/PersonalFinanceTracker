import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategories1728728279539 implements MigrationInterface {
  private categories = [
    'Personal',
    'Groceries',
    'Transport',
    'Bills',
    'Self Transfer',
    'Food & Drinks',
    'Transport',
    'Shopping',
    'Entertainment',
    'Events',
    'Travel',
    'Medical',
    'Fitness',
    'Services',
    'Subscription',
    'Credit Bill',
    'Investment',
    'Miscellanious',
    'Lent',
    'Donation',
    'Cash Withdrawal',
  ];
  public async up(queryRunner: QueryRunner): Promise<void> {
    this.categories.map(async (category) => {
      await queryRunner.query(
        `INSERT INTO category (name) VALUES ('${category}')`,
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('TRUNCATE TABLE category');
  }
}
