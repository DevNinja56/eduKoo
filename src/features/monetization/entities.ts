export interface RemoteConfig {
  screens: {
    subscriptionLaunch: {
      enabled: boolean;
      offering: string;
      permission: string;
      button: {
        text: {
          en: string;
          ru: string;
        };
      };
      priceDescription: {
        en: string;
        ru: string;
      };
      disclaimer: {
        en: string;
        ru: string;
      };
      linkLeft: {
        text: {
          en: string;
          ru: string;
        };
        url: string;
      };
      linkRight: {
        text: {
          en: string;
          ru: string;
        };
        url: string;
      };
    };
    refillGems: {
      title: {
        en: string;
        ru: string;
      };
      buttons: {
        offering: string;
        title: {
          en: string;
          ru: string;
        };
        subtitle?: {
          en: string;
          ru: string;
        };
      }[];
      disclaimer: {
        en: string;
        ru: string;
      };
    };
  };
}

export interface Product {
  productId: string;
  title: string | undefined;
  price: number | undefined;
}
export interface GemsButtonProps {
  buttonTextColor:any;
}