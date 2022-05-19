import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import DeviceInfo from 'react-native-device-info';
import remoteConfig from '@react-native-firebase/remote-config';
import NetInfo from '@react-native-community/netinfo';

import userServiceFactory from './helpers/user.service';
import transactionsServiceFactory from './helpers/monetization/transactions.service';
import authServiceFactory from './helpers/auth.service';
import qonversionServiceFactory from './helpers/monetization/qonversion.service';
import monetizationServiceFactory from './helpers/monetization/monetization.service';
import paidFeaturesServiceFactory from './helpers/monetization/paid-features.service';
import { getData, storeData } from './helpers/storage.service';
import { SUBSCRIPTION_ID } from './helpers/monetization/qonversion.constants';
import { DEFAULT_CONFIG } from './features/monetization/constants';
import { StateInfoType } from './entities';
import { Product } from './features/monetization/entities';

export interface StateContextType {
  state: StateInfoType;
  setState: (state: StateInfoType) => void;
  buyFeature: (diamondsAmount: string) => Promise<void>;
  buyProduct: (productId: string) => Promise<void>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const asyncStorageProductsKey = 'products';
export const proModelOpen = 'proModelOpen';

const StateProvider: React.FC = props => {
  const { children } = props;
  const [state, setState] = useState<StateInfoType>({
    uid: '',
    diamondsAmount: 0,
    hasSubscription: false,
    status: 'NONE',
    remoteConfig: DEFAULT_CONFIG,
    products: [],
  });
  const userService = useMemo(() => userServiceFactory(), []);
  const transactionService = useMemo(
    () => transactionsServiceFactory(userService),
    [userService],
  );
  const authService = useMemo(
    () => authServiceFactory(userService, transactionService),
    [userService, transactionService],
  );
  const qonversionService = useMemo(
    () => qonversionServiceFactory(userService, transactionService),
    [userService, transactionService],
  );
  const paidFeaturesService = useMemo(
    () => paidFeaturesServiceFactory(userService),
    [userService],
  );
  const monetizationService = useMemo(
    () => monetizationServiceFactory(transactionService, paidFeaturesService),
    [transactionService, paidFeaturesService],
  );

  useEffect(() =>{
    console.log('State Product', state.products)
  }, [state.products])

  const initialize = async (showFirstInit = true) => {
    const network = await NetInfo.fetch();
    const localUser: any = await userService.getUser();
    if (localUser) {
      setState({
        ...state,
        uid: localUser.uid || '',
        diamondsAmount: localUser.diamondsAmount || 0,
        hasSubscription: localUser.hasSubscription,
      });
    }

    if (!network.isConnected) {
      if (!localUser) {
        setState({ ...state, status: 'INIT_ERROR' });
      }

      const productsFromStorage = (await getData(
        asyncStorageProductsKey,
      )) as Product[];
      if (productsFromStorage) {
        setState({ ...state, products: productsFromStorage });
      }

      const unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
        if (isConnected) {
          onOnline();
        }
      });

      const onOnline = async () => {
        await initialize(false);
        unsubscribe();
      };
    } else {
      try {
        const isEmulator = await DeviceInfo.isEmulator();
        await qonversionService.init(isEmulator);
        const isFistTime = await getData(proModelOpen);

        if (!localUser && showFirstInit) {
          setState({
            ...state,
            products: qonversionService.products as Product[],
            status: isFistTime ? 'CLOSE_ON_SUCCESS_SUBSCRIPTION' : 'FIRST_INIT'
          });
        }
        await authService.init(qonversionService.uid);
        await qonversionService.checkSubscription();
        await remoteConfig().fetchAndActivate();
        await storeData(asyncStorageProductsKey, qonversionService.products);

        const configString = remoteConfig().getValue('config').asString();
        const config = JSON.parse(configString);
        const user: any = await userService.getUser();

        if (user) {
          setState({
            ...state,
            products: qonversionService.products as Product[],
            uid: user.uid || '',
            hasSubscription: user.hasSubscription,
            diamondsAmount: user.diamondsAmount || 0,
            remoteConfig: config || DEFAULT_CONFIG,
            status: showFirstInit && localUser ? 'CLOSE_ON_SUCCESS_SUBSCRIPTION' : 'FIRST_INIT' ,
          });
        }
      } catch (e) {
        console.log('error =>',e)
        setState({ ...state, status: 'UNKNOWN_ERROR' });
      }
    }
  };

  const buyFeature = async (feature: string) => {
    try {
      await monetizationService.tryUnlockFeature(feature);
      const user: any = await userService.getUser();

      setState({
        ...state,
        diamondsAmount: user?.diamondsAmount,
      });
    } catch (e) {
      setState({ ...state, status: 'SPENDING_ERROR' });

      throw e;
    }
  };

  const buyProduct = async (productId: string) => {
    const network = await NetInfo.fetch();

    if (!network.isConnected) {
      throw 'Network Error';
    }

    try {
      await qonversionService.purchaseItem(productId);
      const user: any = await userService.getUser();

      if (productId === SUBSCRIPTION_ID) {
        setState({
          ...state,
          hasSubscription: true,
          status: 'INIT_SUCCESS',
        });
      } else {
        setState({
          ...state,
          diamondsAmount: user?.diamondsAmount,
          status: 'INIT_SUCCESS',
        });
      }
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <StateContext.Provider value={{ state, setState, buyFeature, buyProduct }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error('useStateContext must be used within a UserProvider');
  }

  return context;
};

export default StateProvider;
