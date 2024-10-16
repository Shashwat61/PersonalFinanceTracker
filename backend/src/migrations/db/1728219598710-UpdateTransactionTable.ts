import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from "typeorm";

export class UpdateTransactionTable1728219598710 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("transaction", new TableColumn({
            name: "sequence",
            type: "int",
            isNullable: false,
        }))
        await queryRunner.createIndex("transaction", new TableIndex({
            name: "IDX_TRANSACTION_SEQ_ID",
            columnNames: ["sequence"]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("transaction", "IDX_TRANSACTION_SQ_ID")
        await queryRunner.dropColumn("transaction", "sequence")
    }

}
