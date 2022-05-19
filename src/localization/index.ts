import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common from './common';
import { homeLocales } from '../features/home';
import { taskSolverLocales } from '../features/taskSolver';
import { reactivityLocales } from '../features/reactivity';
import { formulasLocales } from '../features/formulas';
import { periodicLocales } from '../features/periodicTable';
import { solubilityLocales } from '../features/solubilityTable';
import { reactionsLocales } from '../features/reactions';
import { chainsLocales } from '../features/chains';
import { molarMassLocales } from '../features/molarMass';
import { coefLocales } from '../features/coefArrangement';
import { monetizationLocales } from '../features/monetization';
import { cheatsLocales } from '../features/cheats';
import { LOCALES } from './constants';

i18n.use(initReactI18next).init({
  resources: {
    [LOCALES.ru]: {
      translation: {
        ...common.ru,
        home: homeLocales.ru,
        reactivity: reactivityLocales.ru,
        formulas: formulasLocales.ru,
        periodicTable: periodicLocales.ru,
        solubilityTable: solubilityLocales.ru,
        reactions: reactionsLocales.ru,
        chains: chainsLocales.ru,
        molarMass: molarMassLocales.ru,
        coefArrangement: coefLocales.ru,
        taskSolver: taskSolverLocales.ru,
        monetization: monetizationLocales.ru,
        cheats: cheatsLocales.ru,
      },
    },
    [LOCALES.en]: {
      translation: {
        ...common.en,
        home: homeLocales.en,
        reactivity: reactivityLocales.en,
        formulas: formulasLocales.en,
        periodicTable: periodicLocales.en,
        solubilityTable: solubilityLocales.en,
        reactions: reactionsLocales.en,
        chains: chainsLocales.en,
        molarMass: molarMassLocales.en,
        coefArrangement: coefLocales.en,
        taskSolver: taskSolverLocales.en,
        monetization: monetizationLocales.en,
        cheats: cheatsLocales.en,
      },
    },
  },
  lng: LOCALES.ru,
  fallbackLng: LOCALES.ru,

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
