export const SUBSCRIPTION_ID = 'chemistryx10.premium.subscription';
export const DIAMONDS_PACK_ID = 'chemistryx10.diamonds.pack';
export const DIAMONDS_PACK1_ID = DIAMONDS_PACK_ID + '1';
export const DIAMONDS_PACK2_ID = DIAMONDS_PACK_ID + '2';
export const DIAMONDS_PACK3_ID = DIAMONDS_PACK_ID + '3';
export const ZERO_IDFA = '00000000-0000-0000-0000-000000000000';

export const PRODUCTS_OFFLINE = [
  {
    productId: SUBSCRIPTION_ID,
    title: 'Unlimited gems',
    price: '1.99 $',
  },
  {
    productId: DIAMONDS_PACK1_ID,
    title: '50 gems',
    price: '4.99 $',
  },
  {
    productId: DIAMONDS_PACK2_ID,
    title: '100 gems',
    price: '6.99 $',
  },
  {
    productId: DIAMONDS_PACK3_ID,
    title: '1000 gems',
    price: '59.99 $',
  },
];

export const PRODUCTS_DATA = {
  [SUBSCRIPTION_ID]: {
    subscription: true,
  },
  [DIAMONDS_PACK1_ID]: {
    diamondsAmount: 50,
  },
  [DIAMONDS_PACK2_ID]: {
    diamondsAmount: 100,
  },
  [DIAMONDS_PACK3_ID]: {
    diamondsAmount: 1000,
  },
};
