import { getData, storeData, removeData } from './storage.service';

const uidKey = 'persistentUID';
const userKey = 'user';

function userServiceFactory() {
  class UserService {
    async updateUser(user) {
      await storeData(userKey, user);
    }

    async getUser() {
      return await getData(userKey);
    }

    async getUserUID() {
      const user = await getData(userKey);
      if (!user) {
        return null;
      }

      return user.uid;
    }

    async savePersistentUid(uid) {
      try {
        await storeData(uidKey, uid);
      } catch (error) {
        console.log(error, uid);
      }
    }

    async cleanTransactions() {
      const user = await getData(userKey);
      if (!user) {
        return;
      }

      user.transactions = [];

      await this.updateUser(user);
    }

    async setSubscription(hasSubscription) {
      const user = await getData(userKey);
      if (!user) {
        return;
      }

      user.hasSubscription = hasSubscription;

      await this.updateUser(user);
    }

    async removeUser() {
      await removeData(userKey);
    }

    async cleanUp() {
      await removeData(userKey);
    }
  }

  return new UserService();
}

export default userServiceFactory;
