import _ from 'lodash';

import { apiService } from '../api';
import table from '../json/table.json';

export default function PeriodicTableService() {
  const groups_labels = [
    '1 A',
    '2 A',
    '3 B',
    '4 B',
    '5 B',
    '6 B',
    '7 B',
    '8 B',
    '8 B',
    '8 B',
    '1 B',
    '2 B',
    '3 A',
    '4 A',
    '5 A',
    '6 A',
    '7 A',
    '8 A',
  ];
  const periods = ['1', '2', '3', '4', '5', '6', '7'];
  const self = this;

  this.getGroups = function () {
    return _.clone(groups_labels);
  };

  this.getPeriods = function () {
    return _.clone(periods);
  };

  this.getAll = function () {
    return _.cloneDeep(table);
  };

  this.getElements = function (dict) {
    return _.cloneDeep(_.filter(table, dict));
  };

  this.getElementById = function (id) {
    return _.cloneDeep(_.find(table, { id: _.parseInt(id) }));
  };

  this.getElementsByGroup = function (group) {
    return _.cloneDeep(_.filter({ group: group }));
  };

  this.getElementsByPeriod = function (period) {
    return _.cloneDeep(_.filter({ period: period }));
  };

  this.getDetailedElementInfo = async function (id) {
    const element = self.getElementById(_.toNumber(id));
    const path = `./json/elements/${element.element
      .toLowerCase()
      .replace(/[()]/g, '')}.json`;

    const resp = apiService.get(path);
    return _.merge(element, resp.data);
  };

  this.getDisplayedTable = function () {
    const displayed_table = [];
    const groups = _.uniq(groups_labels);

    function getFakeElement(title, p, g) {
      return {
        element: title,
        group: g,
        period: p,
        atomMass: 0,
        elnegativity: 0,
        elconf: 0,
        color: 'black',
        val: [],
        name: {
          ru: 'emp',
          en: 'emp',
        },
      };
    }

    function getElemByGroupAndPeriod(p, g) {
      const element_mapping = {
        57: '57-71',
        89: '89-103',
      };
      const e = self.getElements({
        period: p,
        group: g,
      });
      if (_.isEmpty(e)) {
        return g != '8 B'
          ? getFakeElement('empty', p, g)
          : [
              getFakeElement('empty', p, g),
              getFakeElement('empty', p, g),
              getFakeElement('empty', p, g),
            ];
      }
      const title = _.get(element_mapping, _.first(e).id, null);
      if (!_.isNil(title)) {
        return getFakeElement(title, p, g);
      }
      return e;
    }

    _.each(periods, period => {
      const elements = self.getElementsByPeriod(period);
      let row = [];
      _.each(groups, group => {
        row = _.concat(row, getElemByGroupAndPeriod(period, group));
      });
      displayed_table.push(row);
    });

    return displayed_table;
  };
}
