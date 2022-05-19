import { ImageSourcePropType } from 'react-native';

import EnergyLevelsIMG from './../../assets/images/backgrounds/electronic-configuration.png';
import ElectronicBalanceIMG from './../../assets/images/backgrounds/electronic-balance.png';
import ChainSolutionIMG from './../../assets/images/backgrounds/transformation-chains.png';
import TaskSolutionIMG from './../../assets/images/backgrounds/problem-solver.png';
import MolarMassIMG from './../../assets/images/backgrounds/molar-masses.png';
import { RemoteConfig } from './entities';

export const ENERGY_LEVELS = 'ENERGY_LEVELS';
export const MOLAR_MASS = 'MOLAR_MASS';
export const ELECTRONIC_BALANCE = 'ELECTRONIC_BALANCE';
export const CHAIN_SOLUTION = 'CHAIN_SOLUTION';
export const TASK_SOLUTION = 'TASK_SOLUTION';

export const DEFAULT_CONFIG: RemoteConfig = {
  screens: {
    subscriptionLaunch: {
      enabled: true,
      offering: 'premium',
      permission: 'Premium',
      button: {
        text: {
          en: 'Start',
          ru: 'Начать',
        },
      },
      priceDescription: {
        en: '3 days for free, next @price_premium@ per week',
        ru: '3 дня бесплатно, затем @price_premium@ в неделю',
      },
      disclaimer: {
        en: 'Pro version - english text',
        ru:
          '“Pro-версия” — это услуга по еженедельной подписке. Она дает бесконечные кристаллы и открывает функции, которые доступны только в “Pro-версии”: защиту от учителя “Звонок мамы” и подробное решение задач. Подписка будет обновляться автоматически, если не отключить автоматическое продление не позже чем за 24 часа до истечения срока текущей подписки. Оплата будет взиматься со счета в течение 24 часов до окончания текущего срока подписки. Подписками может управлять пользователь. Отключить автоматическое продление можно в настройках учетной записи после покупки.',
      },
      linkLeft: {
        text: {
          en: 'EULA',
          ru: 'EULA',
        },
        url: 'http://appcrab.net/eula',
      },
      linkRight: {
        text: {
          en: 'Privacy Policy',
          ru: 'Политика конфиденциальности',
        },
        url: 'http://appcrab.net/privacy-policy',
      },
    },
    refillGems: {
      title: {
        en: 'Refill gems',
        ru: 'Пополнить кристаллы',
      },
      buttons: [
        {
          offering: 'chemistryx10.premium.subscription',
          title: {
            en: 'Infinite gems',
            ru: 'Бесконечные кристаллы',
          },
          subtitle: {
            en: 'Pro version - 3 days for free',
            ru: 'Pro-версия - 3 дня бесплатно',
          },
        },
        {
          offering: 'chemistryx10.diamonds.pack1',
          title: {
            en: 'Buy 50 gems',
            ru: 'Купить 50 кристаллов',
          },
        },
        {
          offering: 'chemistryx10.diamonds.pack2',
          title: {
            en: 'Buy 100 gems',
            ru: 'Купить 100 кристаллов',
          },
        },
        {
          offering: 'chemistryx10.diamonds.pack3',
          title: {
            en: 'Buy 1000 gems',
            ru: 'Купить 1000 кристаллов',
          },
        },
      ],
      disclaimer: {
        en: 'Pro version - english text',
        ru:
          '“Pro-версия” — это услуга по еженедельной подписке. Она дает бесконечные кристаллы и открывает функции, которые доступны только в “Pro-версии”: защиту от учителя “Звонок мамы” и подробное решение задач. Подписка будет обновляться автоматически, если не отключить автоматическое продление не позже чем за 24 часа до истечения срока текущей подписки. Оплата будет взиматься со счета в течение 24 часов до окончания текущего срока подписки. Подписками может управлять пользователь. Отключить автоматическое продление можно в настройках учетной записи после покупки.',
      },
    },
  },
};

export const REFILL_GEMS_BUTTONS_INFO: {
  [x: string]: {
    amount: string;
    price?: string;
  };
} = {
  'chemistryx10.premium.subscription': {
    amount: 'UNLIM',
  },
  'chemistryx10.diamonds.pack1': {
    amount: '50',
    price: '4.99',
  },
  'chemistryx10.diamonds.pack2': {
    amount: '100',
    price: '6.99',
  },
  'chemistryx10.diamonds.pack3': {
    amount: '1000',
    price: '59.99',
  },
};

export const TRANSACTION_TYPES = {
  subscription: 'subscription',
  subscriptionCancel: 'subscriptionCancel',
  purchase: 'purchase',
  spending: 'spending',
};

export const PAID_FEATURES: {
  [key: string]: {
    title: string;
    cost: number;
    background: ImageSourcePropType;
    subscriptionRequired: boolean;
  };
} = {
  ENERGY_LEVELS: {
    title: 'energyLevels',
    cost: 1,
    background: EnergyLevelsIMG,
    subscriptionRequired: false,
  },
  MOLAR_MASS: {
    title: 'howMolarMass',
    cost: 2,
    background: MolarMassIMG,
    subscriptionRequired: false,
  },
  ELECTRONIC_BALANCE: {
    title: 'electronicBalance',
    cost: 3,
    background: ElectronicBalanceIMG,
    subscriptionRequired: false,
  },
  CHAIN_SOLUTION: {
    title: 'chainSol',
    cost: 3,
    background: ChainSolutionIMG,
    subscriptionRequired: false,
  },
  TASK_SOLUTION: {
    title: 'taskSolution',
    cost: 5,
    background: TaskSolutionIMG,
    subscriptionRequired: false,
  },
};
