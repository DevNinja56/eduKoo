import _ from 'lodash';

import ionsByNameAndCharge from '../json/ionsByNameAndCharge.json';

export const getAnions = function () {
  return _.cloneDeep(
    _.filter(ionsByNameAndCharge, ion => {
      return _.lt(ion.charge, 0);
    }),
  );
};

export const getCations = function () {
  return _.cloneDeep(
    _.filter(ionsByNameAndCharge, ion => {
      return _.gt(ion.charge, 0);
    }),
  );
};
