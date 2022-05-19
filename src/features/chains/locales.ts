import { LOCALES } from '../../localization/constants';

export default {
  [LOCALES.ru]: {
    title: 'Решение цепочек',
    errorPlus: 'В цепочке превращений не должно быть "+"!',
    errorEqual: '"=" - это точно не цепочка превращений!',
    errorReaction:
      'Похоже, что вы ищете реакцию, а не цепочку превращений, перейдите в раздел "Поиск реакций" и повторите попытку.',
  },
  [LOCALES.en]: {
    title: 'Solution of chains',
    errorPlus: 'There shouldn\'t be any "+" in transformation chain!',
    errorEqual: '"=" - this is definitely not a transformation chain!',
    errorReaction:
      'It seems you are looking for a reaction, not a transformation chain. Go to "the part "Search of reactions" and try again.',
  },
};
