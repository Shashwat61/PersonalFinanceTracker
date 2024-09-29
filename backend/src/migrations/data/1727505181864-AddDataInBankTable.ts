import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDataInBankTable1727505181864 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO bank (name, listener_email) VALUES ('HDFC Bank', 'alerts@hdfcbank.net')`);
        await queryRunner.query(`INSERT INTO bank (name, listener_email) VALUES ('Axis Bank', null)`);
        await queryRunner.query(`INSERT INTO bank (name, listener_email) VALUES ('Canara Bank', null)`);
        await queryRunner.query(`INSERT INTO bank (name, listener_email) VALUES ('PNB Bank', null)`);
        await queryRunner.query(`INSERT INTO bank (name, listener_email) VALUES ('SBI Bank', null)`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM bank WHERE name = 'HDFC'`);
        await queryRunner.query(`DELETE FROM bank WHERE name = 'Axis Bank'`);
        await queryRunner.query(`DELETE FROM bank WHERE name = 'Canara Bank'`);
        await queryRunner.query(`DELETE FROM bank WHERE name = 'PNB Bank'`);
        await queryRunner.query(`DELETE FROM bank WHERE name = 'SBI Bank'`);
    }

}
