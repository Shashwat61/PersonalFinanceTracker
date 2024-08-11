import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBankAccountTable1723348516397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "bank_account",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "account_number",
                        type: "varchar",
                        default: null,
                        length: "255"
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        isNullable: false
                    }
                ],
                indices: [
                    {
                        columnNames: ["account_number"],
                        name: "IDX_BANK_ACCOUNT_ACCOUNT_NUMBER",
                        isUnique: true
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("bank_account")
    }

}
