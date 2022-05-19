import table from '../../json/table.json';
import { ElementData } from '../../entities';

export const TABLE = table.reduce(
  (acc: any, it: ElementData) => ({
    ...acc,
    [`${it.period}.${it.group}${it.groupInfo ? `.${it.groupInfo}` : ''}`]: it,
  }),
  {},
);

export const HIDDEN_ELEMENTS = {
  LANTHAN: 'Лантаноиды',
  ACTIN: 'Актиноиды',
};

export interface EnergyLevel {
  level: number;
  orbs: string[];
}

export interface OrbCells {
  [x: string]: { cols: number; color: string };
}

export const CELL_STATES = {
  none: '',
  half: '↑',
  full: '↑↓',
};

export const ORBS_CELLS: OrbCells = {
  s: { cols: 1, color: '#ecac74' },
  p: { cols: 3, color: '#ff4489' },
  d: { cols: 5, color: '#29f9f9' },
  f: { cols: 7, color: '#78ff88' },
};

export const ENERGY_LEVELS: EnergyLevel[] = [
  { level: 7, orbs: ['s', 'p'] },
  { level: 6, orbs: ['s', 'p', 'd'] },
  { level: 5, orbs: ['s', 'p', 'd', 'f'] },
  { level: 4, orbs: ['s', 'p', 'd', 'f'] },
  { level: 3, orbs: ['s', 'p', 'd'] },
  { level: 2, orbs: ['s', 'p'] },
  { level: 1, orbs: ['s'] },
];

export const LEVELS_EXP = /[spdf]/;
