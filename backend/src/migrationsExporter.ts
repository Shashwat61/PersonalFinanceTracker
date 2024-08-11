import { AddUUIDExtension1723290666124 } from "./migrations/db/1723290666124-AddUUIDExtension"
import { CreateUserTable1723292610702 } from "./migrations/db/1723292610702-CreateUserTable"
import { CreateBankAccountTable1723348516397 } from "./migrations/db/1723348516397-CreateBankAccountTable"
import { CreateCategoryTable1723348573166 } from "./migrations/db/1723348573166-CreateCategoryTable"
import { CreateTransactionMetadataTable1723348588041 } from "./migrations/db/1723348588041-CreateTransactionMetadataTable"
import { CreateUserUPIDetailsTable1723349865060 } from "./migrations/db/1723349865060-CreateUserUPIDetailsTable"
import { CreateTransactionTable1723350863018 } from "./migrations/db/1723350863018-CreateTransactionTable"


export default [
    AddUUIDExtension1723290666124,
    CreateUserTable1723292610702,
    CreateBankAccountTable1723348516397,
    CreateCategoryTable1723348573166,
    CreateTransactionMetadataTable1723348588041,
    CreateUserUPIDetailsTable1723349865060,
    CreateTransactionTable1723350863018
]