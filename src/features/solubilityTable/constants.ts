import { SolubilityItemOption } from './entities';

export const solubilityItemsOption: { [key: string]: SolubilityItemOption } = {
  P: {
    name: { ru: 'P', en: 'S' },
    colors: ['rgb(61, 122, 214)', 'rgb(71, 207, 228)'],
  },
  M: {
    name: { ru: 'M', en: 'SS' },
    colors: ['rgb(228, 124, 123)', 'rgb(245, 177, 107)'],
  },
  H: {
    name: { ru: 'H', en: 'I' },
    colors: ['rgb(183, 17, 124)', 'rgb(255, 117, 117)'],
  },
};
