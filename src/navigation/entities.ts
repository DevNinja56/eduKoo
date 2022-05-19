import { Reaction } from '../entities';
import { Solution } from '../features/taskSolver/entities';
import { SectionsType } from '../features/cheats/constants';
import { SCREENS } from './constants';

export type StackParamList = {
  [x: string]: any;
  [SCREENS.TASK_SOLVER_SOLUTION]: {
    solution: Solution;
    substFormula?: string;
  };
  [SCREENS.TASK_SOLVER_PROBLEM_FIND]: {
    reaction: Reaction;
    isSimple: boolean;
    givenFields: any[];
    substFormula?: string;
  };
  [SCREENS.TASK_SOLVER_PROBLEM_GIVEN]: {
    reaction: Reaction;
    isSimple: boolean;
    substFormula?: string;
  };
  [SCREENS.CHEATS_LIST]: {
    section: SectionsType;
  };
  [SCREENS.CHEATS_ARTICLE]: {
    section: SectionsType;
    title: string;
  };
};
