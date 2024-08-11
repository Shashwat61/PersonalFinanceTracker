# Low Level Design according to requirement

## Functional Requirements

1. user should be able to set the email for which the emails will start coming in.
2. user should see all the transactions whenever a transaction is made either debit or credit.
3. user should see all the details of the transaction when clicked on it. for eg ( transaction type (credit/debit)
   to whom transaction is made, by whom transaction is made, amount, time and date, upi transaction number and UPI of other)
4. user should be able to give a category to each transaction.
5. user can filter all the transactions based on transaction type, categories, date and time, UPI id of other person.

![alt text](./schema_design.png)

## Migrations Commands

1. DB Table Migration

    ```bash
    npm run run_db_migration
    ```

2. Data Migrations

    ```bash
    npm run run_data_migration
    ```

3. Rollback DB Migrations

    ```bash
    npm run revert_db_migration
    ```

4. Rollback Data Migrations

    ```bash
    npm run revert_data_migration
    ```

5. Create DB Migration

   ```bash
    npm run create_migration db tablename
    ```

6. Create Data Migration

    ```bash
     npm run create_migration data tablename
     ```
