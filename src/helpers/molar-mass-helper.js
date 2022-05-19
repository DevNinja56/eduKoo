import * as _ from 'lodash';

import { parse } from './root.service';
import table from '../json/table.json';

export const getSubstanceInfo = molarMassSubstanceField => {
  let substance = molarMassSubstanceField.replace(/\s+/g, '');
  const List = [];

  List.parse = parse;
  List.parse(substance, 1);

  return {
    mass: Math.round(
      _.reduce(
        List,
        (sum, e) => {
          return (
            sum +
            e.coef *
              table.find(it => it.id === _.parseInt(e.elements) + 1).atomMass
          );
        },
        0,
      ),
    ),
    parsed: List,
    substance: molarMassSubstanceField,
  };
};
