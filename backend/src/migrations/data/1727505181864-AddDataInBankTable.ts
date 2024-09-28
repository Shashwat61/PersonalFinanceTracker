import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDataInBankTable1727505181864 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO bank (name, listener_email) VALUES ('HDFC', 'alerts@hdfcbank.net')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM bank WHERE name = 'HDFC'`)
    }

}
