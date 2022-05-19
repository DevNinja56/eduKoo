import NetInfo from '@react-native-community/netinfo';

import { getData, storeData } from '../storage.service';
import { TRANSACTION_TYPES } from '../../features/monetization/constants';
import { USER_TRANSACTION } from '../../api/constants';
import { awsService } from '../../api';

const pendingTransactionsKey = 'pending-transactions';
const sendPendingTransactionsInterval = 5000;

function transactionsServiceFactory(userService) {
  class TransactionsService {
    constructor() {
      const unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected) {
          onOnline();
        }
      });

      async function onOnline() {
        await sendPendingTransactions();

        unsubscribe();
      }
    }

    async getPendingTransactions() {
      let transactions = await getData(pendingTransactionsKey);
      if (!(transactions instanceof Array)) {
        transactions = [];
      }

      return transactions;
    }

    applyTransaction(user, transaction) {
      if (typeof user !== 'object' || user === null) {
        return user;
      }

      const clone = JSON.parse(JSON.stringify(user));

      switch (transaction.type) {
        case 'spending': {
          if (!clone.hasSubscription) {
            clone.diamondsAmount -= transaction.diamondsAmount;
          }
          break;
        }

        case 'purchase': {
          clone.diamondsAmount += transaction.diamondsAmount;
          break;
        }

        case 'subscription': {
          clone.hasSubscription = true;
          break;
        }

        case 'subscriptionCancel': {
          clone.hasSubscription = false;
          break;
        }
      }

      if (clone.diamondsAmount < 0) {
        clone.diamondsAmount = 0;
      }

      return clone;
    }

    async sendSpending(diamondsAmount) {
      return await this.processTransaction({
        type: TRANSACTION_TYPES.spending,
        time: Date.now(),
        diamondsAmount,
      });
    }

    async sendPurchase(diamondsAmount, transactionDetails) {
      return await this.processTransaction({
        type: TRANSACTION_TYPES.purchase,
        time: Date.now(),
        transactionDetails,
        diamondsAmount,
      });
    }

    async sendSubscription(transactionDetails) {
      return await this.processTransaction({
        type: TRANSACTION_TYPES.subscription,
        diamondsAmount: 0,
        transactionDetails,
        time: Date.now(),
      });
    }

    async sendSubscriptionCancel(transactionDetails = {}) {
      return await this.processTransaction({
        type: TRANSACTION_TYPES.subscriptionCancel,
        diamondsAmount: 0,
        time: Date.now(),
        transactionDetails,
      });
    }

    async processTransaction(transaction) {
      let user = await userService.getUser();
      if (!user) {
        return user;
      }

      user = this.applyTransaction(user, transaction);
      user.transactions.push(transaction);

      await userService.updateUser(user);

      sendTransactions([transaction]);
    }
  }

  return new TransactionsService();

  async function sendTransactions(transactions) {
    try {
      const { data } = await awsService.post(USER_TRANSACTION, {
        transactions,
      });

      return data;
    } catch (error) {
      await saveTransactionsLocally(transactions);

      setTimeout(sendPendingTransactions, sendPendingTransactionsInterval);

      return false;
    }
  }

  async function saveTransactionsLocally(transactionsToSave) {
    let transactions = await getData(pendingTransactionsKey);
    if (!(transactions instanceof Array)) {
      transactions = [];
    }

    transactions = transactions.concat(transactionsToSave);

    await storeData(pendingTransactionsKey, transactions);
  }

  async function sendPendingTransactions() {
    const transactions = await getData(pendingTransactionsKey);
    await storeData(pendingTransactionsKey, []);

    if (!transactions || transactions.length === 0) {
      return;
    }

    await sendTransactions(transactions);
  }
}

export default transactionsServiceFactory;
