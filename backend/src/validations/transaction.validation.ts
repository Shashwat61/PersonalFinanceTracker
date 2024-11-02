import { z } from 'zod';
import { TRANSACTION_MODE_TYPES } from '../utils/helper';

const getTransactions = z.object({
  query: z.object({
    from: z.string(),
    after: z.string(),
    before: z.string(),
  }),
});

const getTransactionsVersionOne = z.object({
  query: z.object({
    after: z.string(),
    before: z.string(),
    from: z.string(),
    cursor: z.string().optional(),
    limit: z.string().refine((val: string) => {
      if (Number(val) > 100) {
        throw new Error('Limit should be less than 100');
      } else if (Number(val) < 5) {
        throw new Error('Limit should be greater than 10');
      }
      return true;
    }),
  }),
  params: z.object({
    id: z.string(),
  }),
});

const updateTransactions = z.object({
  body: z.object({
    transactionIds: z.string().array(),
    categoryId: z.string().optional(),
    vpaName: z.string().optional(),
  }),
});

// {
//     "id": "",
//     "amount": "13",
//     "transaction_metadata_id": "",
//     "transaction_type": "credit",
//     "user_id": "8d7a7414-f6d6-49a7-b6f5-4a6378566624",
//     "user_bank_mapping_id": "4e1c1d11-f65c-4d4d-8834-0b7e609718ae",
//     "transacted_at": "2024-10-26",
//     "created_at": "2024-10-26T07:59:00.644Z",
//     "updated_at": "2024-10-26T07:59:00.644Z",
//     "message_id": "",
//     "sequence": 0,
//     "user_upi_category_name_mapping_id": "",
//     "userUpiCategoryNameMapping": {
//         "id": "",
//         "category_id": "c2b4bd83-8253-468d-85b9-cdb624ea6728",
//         "upi_name": "",
//         "user_id": "8d7a7414-f6d6-49a7-b6f5-4a6378566624",
//         "created_at": "2024-10-26T07:59:00.644Z",
//         "updated_at": "2024-10-26T07:59:00.644Z",
//         "upi_id": "",
//         "category": {
//             "id": "c2b4bd83-8253-468d-85b9-cdb624ea6728",
//             "name": "Shopping",
//             "created_at": "2024-10-12T10:27:43.012Z",
//             "updated_at": "2024-10-12T10:27:43.012Z"
//         }
//     }
// }
const saveTransaction = z.object({
  body: z.object({
    amount: z.string(),
    transaction_type: z.string(),
    user_bank_mapping_id: z.string(),
    transacted_at: z.string(),
    bank_account_number: z.string(),
    mode: z.string(),
    category_id: z.string(),
  }),
});
export default {
  getTransactions,
  saveTransaction,
  getTransactionsVersionOne,
  updateTransactions,
};
