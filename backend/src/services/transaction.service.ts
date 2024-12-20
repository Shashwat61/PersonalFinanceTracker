import {
  Equal,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from 'typeorm';
import { Transaction } from '@entity/Transaction';
import { User } from '@entity/User';
import { UserBankMapping } from '@entity/UserBankMapping';
import { gmailClient, redisClient } from '@lib';
import {
  AddTransaction,
  GmailMessage,
  GmailMessages,
  GmailThreadMessages,
  Message,
  TransactionParams,
  UpdateTransactionRequestBody,
} from '@custom-types/transaction.types';
import {
  getDate,
  modifyQuery,
  modifyTransactionDataVersionTwo,
} from '@utils/helper';
import { UserUpiDetails } from '@entity/UserUpiDetails';
import { UserUpiCategoryNameMapping } from '@entity/UserUpiCategoryNameMapping';

const getTransactionsVersionTwo = async (
  access_token: string,
  apiQuery: TransactionParams,
  userBankMappingId: string,
  user: User,
) => {
  const { cursor, limit } = apiQuery; // TODO: take it as hashed value and unhash it here

  const query = Object.assign(
    {},
    {
      from: apiQuery.from,
      after: apiQuery.after,
      before: apiQuery.before,
    },
  );
  const modifiedQuery = modifyQuery(query);
  let currentDayLastTransaction = null;
  const userBankMapping = await UserBankMapping.findOneBy({
    user_id: user.id,
    id: userBankMappingId,
  });
  if (!userBankMapping) throw new Error('User bank mapping not found');
  const userBankLastCachedTransactionId = await redisClient.getKey(
    `${user.id}_${userBankMappingId}${apiQuery.after}${apiQuery.before}_last_transaction`,
  );
  if (userBankLastCachedTransactionId) {
    currentDayLastTransaction = await Transaction.findOneBy({
      message_id: userBankLastCachedTransactionId,
    });
  } else {
    currentDayLastTransaction = await Transaction.findOne({
      // add condition for mode online
      where: {
        mode: 'online',
        transacted_at: new Date(apiQuery.after),
        user_bank_mapping_id: userBankMapping.id,
      },

      relations: ['userBankMapping'],
      order: {
        sequence: 'DESC',
      },
    });
  }
  const [transactions, calculatedCursor] = await setGmailMessages(
    modifiedQuery,
    access_token,
    userBankMapping,
    currentDayLastTransaction,
    cursor,
    Number(limit),
    apiQuery,
  );
  return { transactions, cursor: calculatedCursor };
};

async function setGmailMessages(
  modifiedQuery: string,
  access_token: string,
  userBankMapping: UserBankMapping,
  lastTransaction: Transaction | null,
  cursor: string | undefined,
  limit: number,
  query: TransactionParams,
) {
  const messages = await getGmailMessages(
    access_token,
    modifiedQuery,
    lastTransaction,
  );
  if (!messages.length && !lastTransaction) return [];
  if (lastTransaction && !messages.length) {
    // messages [] -> no new messages
    // if cursor -> user is loading for more
    // if no cursor -> user is loading for first time
    let transactions: Transaction[] = [];
    if (!Number(cursor)) {
      // handle if the cache is available then where : sequence else this only
      transactions = await Transaction.find({
        // relations: ["userUpiDetails"],
        where: {
          user_bank_mapping_id: userBankMapping.id,
          transacted_at: Equal(new Date(query.after)),
        },
        order: {
          sequence: 'DESC',
        },
        take: limit,
      });
    } else {
      transactions = await Transaction.find({
        where: {
          user_bank_mapping_id: userBankMapping.id,
          transacted_at: Equal(new Date(query.after)),
          sequence: LessThan(Number(cursor)),
        },
        order: {
          sequence: 'DESC',
        },
        take: limit,
      });
      // setting cache for all transactions if found, handle that/
      // await redisClient.setKey(
      //     `${userBankMapping.user_id}_${userBankMapping.bank_id}${query.after}${query.before}_last_transaction`,
      //     transactions[transactions.length - 1].message_id.toString(),
      //     86400
      // )
    }
    return [transactions, transactions.at(limit - 1)?.sequence];
  }
  // which means either cache value was not found or there is no transaction done for the current day
  // which means get all the messages and iterate over all of'em.
  const savedTransactions = await modifyAndSaveTransactions(
    messages,
    access_token,
    userBankMapping,
    lastTransaction,
  );

  const lastSavedTransaction = savedTransactions[0];
  if (lastSavedTransaction.message_id) {
    const resp = await redisClient.setKey(
      `${userBankMapping.user_id}_${userBankMapping.id}${query.after}${query.before}_last_transaction`,
      lastSavedTransaction.message_id.toString(),
      86400,
    );
  }

  return [
    savedTransactions.slice(0, limit),
    savedTransactions.at(limit - 1)?.sequence,
  ];
}

async function modifyAndSaveTransactions(
  messages: GmailMessage[],
  access_token: string,
  userBankMapping: UserBankMapping,
  lastTransaction: Transaction | null,
) {
  let sortedOrder: Transaction[] = [],
    lastTransactionSequence = lastTransaction?.sequence || 0;
  const uniqueThreadIds = [...new Set(messages?.map((msg) => msg.threadId))];
  const gmailThreadMessages = uniqueThreadIds.map((threadId) =>
    gmailClient.getEmailsFromThreads(threadId, access_token),
  );
  const transactionData = await Promise.all(gmailThreadMessages);
  const savedUserUpiCategoryNameWithUpiId =
    await UserUpiCategoryNameMapping.find({
      where: { user_id: userBankMapping.user_id },
    }); // problem here is it will fetch n results, if user has 1000 upi related payments, then this is a disaster. find a way to optimize this. !IMPORTANT
  const [modifiedResponse, userUpiDetails, messageUpiMap] =
    modifyTransactionDataVersionTwo(
      transactionData,
      userBankMapping,
      savedUserUpiCategoryNameWithUpiId,
    );
  // sort modifiedresponse with reverse order of messages
  messages?.reverse().forEach((msg) => {
    const foundTransaction = modifiedResponse.find(
      (t) => t.message_id === msg.id,
    );
    if (foundTransaction) {
      lastTransactionSequence += 1;
      foundTransaction.sequence = lastTransactionSequence;
      sortedOrder.unshift(foundTransaction);
    }
  });
  // findorcreate  userupidetails bulk
  const dbUserUpiDetails = await UserUpiDetails.find({
    where: {
      upi_id: In(userUpiDetails),
    },
    select: ['upi_id'],
  });

  let savedUserUpiCategoryNameMappingList: UserUpiCategoryNameMapping[] = [];

  const toSaveUpiIds = userUpiDetails
    .filter(
      (upiId) => !dbUserUpiDetails.some((dbUpiId) => dbUpiId.upi_id === upiId),
    )
    .map((upiId) => ({ upi_id: upiId! }));
  // also save in userupicategorynamemapping table
  // whenever a new upi id comes, it will be saved
  if (toSaveUpiIds.length > 0) {
    await UserUpiDetails.insert(toSaveUpiIds);
    const userUpiCategoryNameMappingList = toSaveUpiIds.map((upiId) => {
      const userUpiCategoryNameMappingInstance =
        new UserUpiCategoryNameMapping();
      userUpiCategoryNameMappingInstance.upi_id = upiId.upi_id;
      userUpiCategoryNameMappingInstance.user_id = userBankMapping.user_id;
      return userUpiCategoryNameMappingInstance;
    });
    savedUserUpiCategoryNameMappingList = await UserUpiCategoryNameMapping.save(
      userUpiCategoryNameMappingList,
    );
  }
  // for new user upi ids and will skip the already saved upi ids related transactions
  sortedOrder.forEach((tx) => {
    if (!tx.user_upi_category_name_mapping_id) {
      const foundUserUpiCategoryNameWithUpiId =
        savedUserUpiCategoryNameMappingList.find(
          (item) => item.upi_id === messageUpiMap[tx.message_id as string],
        ); // in online payments,  will always get message id
      if (foundUserUpiCategoryNameWithUpiId) {
        tx.user_upi_category_name_mapping_id =
          foundUserUpiCategoryNameWithUpiId.id;
        tx.userUpiCategoryNameMapping = foundUserUpiCategoryNameWithUpiId;
      }
    }
  });

  // save the last transaction in redis
  const savedTransactions = await Transaction.save(sortedOrder, {
    reload: true,
  });
  return savedTransactions;
}

async function getGmailMessages(
  access_token: string,
  modifiedQuery: string,
  lastTransaction: Transaction | null,
): Promise<GmailMessage[]> {
  const messages: GmailMessage[] = [];
  const gmailMessages = await gmailClient.getMessages(
    access_token,
    modifiedQuery,
  );
  if (
    gmailMessages.resultSizeEstimate === 0 &&
    gmailMessages.messages?.length == 0
  )
    return messages;
  if (gmailMessages.resultSizeEstimate > 0) {
    for (const [index, msg] of gmailMessages.messages!.entries()) {
      if (lastTransaction && lastTransaction.message_id === msg.id) break;
      messages.push(msg);
      if (index == messages.length - 1 && gmailMessages.nextPageToken) {
        const recursiveMessages = await getGmailMessages(
          access_token,
          modifiedQuery,
          lastTransaction,
        );
        messages.push(...recursiveMessages);
      }
    }
  }
  return messages;
}

const updateTransactions = async (
  requestBody: UpdateTransactionRequestBody,
  currentUser: User,
) => {
  // find if all the transction ids received belong to the user
  // if not then throw an error
  // else update the transactions
  // return the updated transactions
  const { transactionIds, categoryId, vpaName } = requestBody;

  const transactions = await Transaction.find({
    where: {
      id: In(transactionIds),
    },
    relations: ['userBankMapping'],
  });
  if (!transactions.length) throw new Error('No transactions found');
  if (transactions.length !== transactionIds.length)
    throw new Error('Transaction not found');
  // only run this logic if either of them is present in request body
  if (categoryId || vpaName) {
    const userBankMapping = transactions[0].userBankMapping;
    const userUpiDetails =
      transactions[0].userUpiCategoryNameMapping?.userUpiDetails;
    // at this point of flow, there cannot be a transaction without a userupicategorynamemapping relation.
    // would always get a single mapping for a user id and upi id both when selected together and in this case for similar transactions with same upi id userUpiCategoryNameMapping will remain same.
    const userUpiCategoryNameMapping = transactions[0].userUpiCategoryNameMapping;
    if (
      userBankMapping.user_id !== userUpiCategoryNameMapping?.user_id ||
      userBankMapping.user_id !== currentUser.id
    )
      throw new Error('Unauthorized');
    if (!userUpiCategoryNameMapping)
      throw new Error('No UserUpiCategoryNameMapping relation found');
    if (categoryId) {
      // transactions.forEach((txn)=>{
      //     txn.category_id = categoryId
      // })
      userUpiCategoryNameMapping.category_id = categoryId;
    }
    if (vpaName) {
      userUpiCategoryNameMapping.upi_name = vpaName;
    }
    await UserUpiCategoryNameMapping.save(userUpiCategoryNameMapping);
    // why find because we just have to save userupicategorynamemapping table instance and when we write find query for tranasction, userupicategorynamemapping will eagerly load with updated data.
    const reloadedTransactions = Transaction.find({
      where: {
        id: In(transactionIds),
      },
    });
    return reloadedTransactions;
  }
};

const saveTransaction = async (transaction: AddTransaction, user: User) => {
  const user_bank_mapping_id = transaction.user_bank_mapping_id;
  const userBankMapping = await UserBankMapping.findOneBy({
    id: user_bank_mapping_id,
    user_id: user.id,
  });
  if (!userBankMapping)
    throw new Error('User bank mapping not found, Not authorized');
  const lastSavedTransaction = await Transaction.findOne({
    where: {
      user_bank_mapping_id: user_bank_mapping_id,
      transacted_at: new Date(transaction.transacted_at),
    },
    order: {
      sequence: 'DESC',
    },
  });

  // make userupinamecategorymapping for this transaction
  const userUpiCategoryNameMapping = new UserUpiCategoryNameMapping();
  userUpiCategoryNameMapping.category_id = transaction.category_id;
  userUpiCategoryNameMapping.user_id = user.id;
  (await userUpiCategoryNameMapping.save()).reload();
  const transactionInstance = new Transaction();
  transactionInstance.amount = Number(transaction.amount);
  transactionInstance.transaction_type = transaction.transaction_type;
  transactionInstance.user_id = user.id;
  transactionInstance.user_bank_mapping_id = user_bank_mapping_id;
  transactionInstance.transacted_at = new Date(transaction.transacted_at);
  transactionInstance.sequence = lastSavedTransaction?.sequence
    ? lastSavedTransaction.sequence + 1
    : 0;
  transactionInstance.mode = transaction.mode;
  transactionInstance.bank_account_number = transaction.bank_account_number;
  transactionInstance.user_upi_category_name_mapping_id =
    userUpiCategoryNameMapping.id;
  await transactionInstance.save();
  return transactionInstance;
};
export default {
  getTransactionsVersionTwo,
  updateTransactions,
  saveTransaction,
};
