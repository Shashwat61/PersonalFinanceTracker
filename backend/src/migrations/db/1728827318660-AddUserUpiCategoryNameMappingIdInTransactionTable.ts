import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class AddUserUpiCategoryNameMappingIdInTransactionTable1728827318660 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("transaction", new TableColumn({
            name: "user_upi_category_name_mapping_id",
            type: "uuid",
            isNullable: true
        }))
        await queryRunner.createForeignKey("transaction", new TableForeignKey({
            columnNames: ["user_upi_category_name_mapping_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "user_upi_category_name_mapping",
        }))

        await queryRunner.createIndex("transaction", new TableIndex({
            columnNames: ["user_upi_category_name_mapping_id"]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("transaction", "user_upi_category_name_mapping")
        await queryRunner.dropForeignKey("transaction", "user_upi_category_name_mapping_id")
        await queryRunner.dropIndex("transaction", "user_upi_category_name_mapping_id")
    }

}
