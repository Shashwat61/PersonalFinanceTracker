import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class UpdateForeignKeyInUserUpiCategoryNameMappingTable1729021763386 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey("user_upi_category_name_mapping", new TableForeignKey({
            columnNames: ["upi_id"],
            referencedTableName: "user_upi_details",
            referencedColumnNames: ["upi_id"]
        }))
        await queryRunner.createIndex("user_upi_category_name_mapping", new TableIndex({
            columnNames: [ "user_id", "upi_id"],
            isUnique: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        

    }

}
