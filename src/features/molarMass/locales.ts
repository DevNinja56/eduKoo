import { LOCALES } from '../../localization/constants';

export default {
  [LOCALES.ru]: {
    title: 'Найти молярную массу',
    searchTitle: 'Введите формулу вещества:',
    searchButton: 'Найти молярную массу',
    infoTitle: 'Как найти молярную массу {{substanceFormatted}}',
    infoTitle2: 'Доля элементов в {{substanceFormatted}}',
    infoDimension: 'г/моль',
    infoPart1:
      'Найдем в таблице Менделеева все элементы, из которых состоит {{substanceFormatted}}. Это:',
    infoPart1_2:
      'Найдем в таблице Менделеева элемент {{substanceFormatted}}. Это:',
    infoPart2: 'Выпишем их молярные массы (они выделены \n',
    infoPart3: ' красным ',
    infoPart4: ' цветом). Но выпишем не длинным дробями, а в целых числах:',
    infoPart5:
      'Чтобы найти молярную массу {{substanceFormatted}} надо сложить молярные массы всех веществ, из которых состоит {{substanceFormatted}}. То есть надо сложить молярные массы {{elements}}, но если после какого-то из этих элементов стоит число, то его молярную массу еще надо умножить на это число, и уже потом сложить с другими молярными массами.',
    infoPart6:
      'Поэтому молярная масса {{substanceFormatted}} будет находиться так:',
  },
  [LOCALES.en]: {
    title: 'Find molar mass',
    searchTitle: 'Enter substance formula:',
    searchButton: 'Find molar mass',
    infoTitle: 'How to find the molar mass {{substanceFormatted}}',
    infoTitle2: 'Fraction of elements in {{substanceFormatted}}',
    infoDimension: 'g/mole',
    infoPart1:
      "Let's find in the periodic table all elements {{substanceFormatted}} consists of. It is:",
    infoPart1_2:
      "Let's find in the periodic table element {{substanceFormatted}} consists of. It is:",
    infoPart2: "Let's write out their molar masses (they are marked with ",
    infoPart3: ' red ',
    infoPart4:
      " color). But let's write them out not with long fractions but whole numbers instead:",
    infoPart5:
      "To find molar mass {{substanceFormatted}} it's necessary to add molar masses of all consisting {{substanceFormatted}}. Namely, it needs to add molar masses {{elements}}, but if there is a number after the element, it's necessary to multiply its molar mass by this number, and after that to add to other molar masses.",
    infoPart6:
      "That's why molar mass {{substanceFormatted}} will be calculated this way:",
  },
};
