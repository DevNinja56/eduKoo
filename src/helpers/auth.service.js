import { Platform } from 'react-native';

import { getData, removeData } from './storage.service';
import { USER_INFO, USER_INIT } from '../api/constants';
import { awsService, setUserToken } from '../api';

function authServiceFactory(userService, transactionsService) {
  return {
    init,
  };

  async function init(uid) {
    await userService.cleanTransactions();
    await initUser(uid);
  }

  async function initUser(uid) {
    setUserToken(uid);

    await userService.savePersistentUid(uid);

    try {
      const { data } = await awsService.post(USER_INIT);
      await userService.updateUser(data);

      const reactionsLimitsCount = await getData('reactionsLimitsCount');
      const isIosUpdateOfOlderVersion = !!reactionsLimitsCount;
      const userShouldGetGiftSub =
        isIosUpdateOfOlderVersion && Platform.OS === 'ios';

      if (userShouldGetGiftSub) {
        await userService.setSubscription(true);
        await transactionsService.sendSubscription({
          description: 'Gift subscription for old users',
        });

        await removeData('reactionsLimitsCount');
      }

      return true;
    } catch (error) {
      const { response } = error;
      const { status, data } = response;

      if (status === 400 && data.code === 'ConditionalCheckFailedException') {
        await updateUserInfo();

        return;
      }

      throw new Error(error.message);
    }
  }

  async function updateUserInfo() {
    try {
      const { data } = await awsService.get(USER_INFO);
      let user = data;
      const transactions = await transactionsService.getPendingTransactions();

      transactions.forEach(transaction => {
        user = transactionsService.applyTransaction(user, transaction);
      });

      const localUser = await userService.getUser();

      if (
        !localUser ||
        user.transactions.length >= localUser.transactions.length
      ) {
        await userService.updateUser(user);
      }
    } catch (error) {
      const { response } = error;

      if (response.status === 404) {
        await userService.removeUser();

        throw new Error('User not found in database');
      }
    }
  }
}

export default authServiceFactory;
