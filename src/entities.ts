import { Product, RemoteConfig } from './features/monetization/entities';

export interface ElementData {
  element: string;
  name: {
    [language: string]: string;
    ru: string;
    en: string;
  };
  id: number;
  group: string;
  groupInfo?: string;
  period: string;
  atomMass: string;
  elnegativity?: string;
  elconf?: string;
  color: string;
  val: string[];
  class: {
    [language: string]: string;
    ru: string;
    en: string;
  };
  subclass?: {
    [language: string]: string;
    ru: string;
    en: string;
  };
  crystalStruct?: {
    [language: string]: string;
    ru: string;
    en: string;
  };
  physColor?: {
    [language: string]: string;
    ru: string;
    en: string;
  };
  tempMelting: string;
  tempBoiling: string;
  discoverer?: {
    [language: string]: string;
    ru: string;
    en: string;
  };
}

export interface Formula {
  description: string;
  symbol: string | { v: string; sub: string };
  defaultMeasure: string[];
  frmls: object[];
}

export interface LangData<T = string> {
  ru: T;
  en: T;
  [language: string]: T;
}

export interface Substance {
  subst: string;
  coef: number;
  side: string;
}
export interface Reaction {
  object: Substance[];
  record: string;
}

export type StatusType =
  | 'NONE'
  | 'FIRST_INIT'
  | 'UNKNOWN_ERROR'
  | 'INIT_ERROR'
  | 'INIT_SUCCESS'
  | 'SPENDING_ERROR'
  | 'CLOSE_ON_SUCCESS_SUBSCRIPTION';

export interface StateInfoType {
  uid: string;
  products: Product[];
  diamondsAmount: number;
  hasSubscription: boolean;
  status: StatusType;
  remoteConfig: RemoteConfig;
}
