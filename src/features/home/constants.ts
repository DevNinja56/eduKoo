import { ImageSourcePropType } from 'react-native';

import reactivitySeries from '../../assets/images/icons/icon-menu-act.png';
import coeffArrangement from '../../assets/images/icons/icon-menu-balance.png';
import tasksFormulas from '../../assets/images/icons/icon-menu-formulas.png';
import periodicTable from '../../assets/images/icons/icon-menu-mendeleev.png';
import molarMasses from '../../assets/images/icons/icon-menu-molar.png';
import solubilityTable from '../../assets/images/icons/icon-menu-sol.png';
import cheats from '../../assets/images/icons/icon-menu-tips.png';
import tasks from '../../assets/images/icons/icon-menu-tasks.png';
import reactions from '../../assets/images/icons/icon-menu-reactions.png';
import teacherProtection from '../../assets/images/icons/icon-menu-protect.png';
import guide from '../../assets/images/icons/icon-menu-guide.png';
import transChains from '../../assets/images/icons/icon-menu-chains.png';
import { SCREENS } from '../../navigation/constants';

export interface MenuButtonType {
  title: string;
  icon: ImageSourcePropType;
  route: string;
}

export const MENU_BUTTONS: MenuButtonType[] = [
  {
    title: 'home.menu.tasks',
    icon: tasks,
    route: SCREENS.TASK_SOLVER_REACTION_QUESTION,
  },
  {
    title: 'home.menu.periodicTable',
    icon: periodicTable,
    route: SCREENS.PERIODIC_TABLE,
  },
  {
    title: 'home.menu.reactions',
    icon: reactions,
    route: SCREENS.REACTIONS,
  },
  {
    title: 'home.menu.transChains',
    icon: transChains,
    route: SCREENS.CHAINS,
  },
  {
    title: 'home.menu.cheats',
    icon: cheats,
    route: SCREENS.CHEATS_MAIN,
  },
  {
    title: 'home.menu.coeffArrangement',
    icon: coeffArrangement,
    route: SCREENS.COEF_ARRANGEMENT,
  },
  {
    title: 'home.menu.molarMasses',
    icon: molarMasses,
    route: SCREENS.MOLAR_MASSES,
  },
  {
    title: 'home.menu.tasksFormulas',
    icon: tasksFormulas,
    route: SCREENS.FORMULAS,
  },
  {
    title: 'home.menu.solubilityTable',
    icon: solubilityTable,
    route: SCREENS.SOLUBILITY_TABLE,
  },
  {
    title: 'home.menu.reactivitySeries',
    icon: reactivitySeries,
    route: SCREENS.REACTIVITY,
  },
  {
    title: 'home.menu.teacherProtection',
    icon: teacherProtection,
    route: SCREENS.HOME,
  },
  {
    title: 'home.menu.guide',
    icon: guide,
    route: SCREENS.HOME,
  },
];
