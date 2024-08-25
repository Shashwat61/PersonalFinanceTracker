import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class UpdateForeignKeysInTransactionTable1724617603896 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("transaction", "payee_upi_id", new TableColumn({
            name: "payee_upi_id",
            type: "varchar",
            isNullable: true
        }))
        await queryRunner.changeColumn("transaction", "receiver_upi_id", new TableColumn({
            name: "receiver_upi_id",
            type: "varchar",
            isNullable: true
        }))

        // await queryRunner.dropForeignKeys("transaction", [new TableForeignKey(
        //     {
        //         columnNames: ["payee_upi_id"],
        //         referencedColumnNames: ["id"],
        //         referencedTableName: "user_upi_details"
        //     }),
        //     new TableForeignKey(
        //     {
        //         columnNames: ["receiver_upi_id"],
        //         referencedColumnNames: ["id"],
        //         referencedTableName: "user_upi_details"
        //     }
        // )])
        await queryRunner.createForeignKeys("transaction", [
            new TableForeignKey({
                columnNames: ["payee_upi_id"],
                referencedColumnNames: ["upi_id"],
                referencedTableName: "user_upi_details"
            }),
            new TableForeignKey({
                columnNames: ["receiver_upi_id"],
                referencedColumnNames: ["upi_id"],
                referencedTableName: "user_upi_details"
            })
        ]
    )
    await queryRunner.createIndices("transaction", [
        new TableIndex({
            name: "IDX_TRANSACTION_PAYEE_UPI_ID",
            columnNames: ["payee_upi_id"]
        }),
        new TableIndex({
            name: "IDX_TRANSACTION_RECEIVER_UPI_ID",
            columnNames: ["receiver_upi_id"]
        })
    ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("transaction", "payee_upi_id", new TableColumn({
            name: "payee_upi_id",
            type: "uuid",
            isNullable: true
        }))
        await queryRunner.changeColumn("transaction", "receiver_upi_id", new TableColumn({
            name: "receiver_upi_id",
            type: "uuid",
            isNullable: true
        }))

        await queryRunner.dropForeignKeys("transaction", [new TableForeignKey(
            {
                columnNames: ["payee_upi_id"],
                referencedColumnNames: ["upi_id"],
                referencedTableName: "user_upi_details"
            }),
            new TableForeignKey(
            {
                columnNames: ["receiver_upi_id"],
                referencedColumnNames: ["upi_id"],
                referencedTableName: "user_upi_details"
            }
        )])
        await queryRunner.createForeignKeys("transaction", [
            new TableForeignKey({
                columnNames: ["payee_upi_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "user_upi_details"
            }),
            new TableForeignKey({
                columnNames: ["receiver_upi_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "user_upi_details"
            })
        ]
    )
    await queryRunner.createIndices("transaction", [
        new TableIndex({
            name: "IDX_TRANSACTION_PAYEE_UPI_ID",
            columnNames: ["payee_upi_id"]
        }),
        new TableIndex({
            name: "IDX_TRANSACTION_RECEIVER_UPI_ID",
            columnNames: ["receiver_upi_id"]
        })
    ])
    }

}
