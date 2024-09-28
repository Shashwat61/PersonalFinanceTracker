import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBanksTable1727503352525 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "bank",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "uuid",
                },
                {
                    name: "name",
                    type: "varchar",
                    isNullable: false,
                    isUnique: true,
                    length: "255"
                },
                {
                    name: "listener_email",
                    type: "varchar",
                    isNullable: true,
                    length: "255",
                    isUnique: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ],

        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("bank")
    }

}
