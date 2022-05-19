import Qonversion from 'react-native-qonversion';
import { IDFA } from 'react-native-idfa';
import find from 'lodash/find';

import { QONVERSION_PROJECT_KEY } from '../../api/constants';
import {
  PRODUCTS_DATA,
  SUBSCRIPTION_ID,
  ZERO_IDFA,
} from './qonversion.constants';

function qonversionServiceFactory(userService, transactionsService) {
  class QonversionService {
    async init(debug = false) {
      this.debug = debug;

      if (debug) {
        Qonversion.setDebugMode();
      }

      try {
        const idfa = await IDFA.getIDFA();
        const isValidIdfa = idfa.trim().length !== 0 && idfa !== ZERO_IDFA;

        const {
          uid,
          userProducts,
          permissions,
        } = await Qonversion.launchWithKey(QONVERSION_PROJECT_KEY, false);

        if (isValidIdfa) {
          await Qonversion.setUserId(idfa);
        }

        this.uid = isValidIdfa ? idfa : uid;
        this.products = await this.getProductsList();
        this.userProducts = userProducts;
        this.permissions = permissions;
      } catch (e) {
        throw e;
      }
    }

    transformProducts(products) {
      const transformedProducts = [];

      for (const [productId, value] of products) {
        transformedProducts.push({
          productId,
          title: value.storeTitle,
          price: value.price,
        });
      }

      return transformedProducts;
    }

    async checkSubscription() {
      try {
        const permissions = await Qonversion.checkPermissions();
        const subscriptionPermission = permissions.get(SUBSCRIPTION_ID);
        const user = await userService.getUser();

        if (!subscriptionPermission) {
          return;
        }

        if (subscriptionPermission.isActive && !user?.hasSubscription) {
          await transactionsService.sendSubscription();
        } else if (!subscriptionPermission.isActive) {
          await transactionsService.sendSubscriptionCancel();
        }
      } catch (e) {
        console.log(e);
      }
    }

    async getProductsList() {
      try {
        const products = await Qonversion.products();
        console.log('Qonversion Product', products)
        return this.transformProducts(products);
      } catch (e) {
        console.log(e);
      }
    }

    async purchaseItem(productId) {
      const products = this.debug
        ? this.products
        : await this.getProductsList();

      if (products.length === 0) {
        throw new Error('Products list is empty');
      }

      const item = find(products, { productId });

      if (!item) {
        throw new Error('Item not found in products list');
      }

      try {
        if (!this.debug) {
          await Qonversion.purchase(productId);
        }

        await waitUntilUserInitialized();

        if (productId === SUBSCRIPTION_ID) {
          await transactionsService.sendSubscription({
            description: `Bought ${productId}`,
          });
        } else {
          await transactionsService.sendPurchase(
            PRODUCTS_DATA[item.productId].diamondsAmount,
            { description: `Bought ${productId}` },
          );
        }
      } catch (e) {
        throw e;
      }
    }
  }

  return new QonversionService();

  async function waitUntilUserInitialized() {
    const checkTime = 1000;
    return new Promise((resolve, reject) => {
      check(resolve);
    });

    function check(cb) {
      const user = userService.getUser();
      if (user === null) {
        setTimeout(() => check(cb), checkTime);
      } else {
        cb();
      }
    }
  }
}

export default qonversionServiceFactory;
