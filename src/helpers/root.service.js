/* eslint-disable */

import * as _ from 'lodash';
import i18n from 'i18next';

import ions from '../json/ions.json';
import table from '../json/table.json';

const t = i18n.t.bind(i18n);

export function parse(str, k) {
  this.Add = function (e) {
    for (let i in this) {
      if (this[i].elements === e.elements) {
        this[i].coef += e.coef;
        return;
      }
    }
    this.push(e);
  };

  function getCloseBraces(s) {
    var brArr = new Array(str[s]);
    s++;
    while (brArr.length != 0) {
      if (str[s] == '(' || str[s] == '[') {
        brArr.push(str[s]);
      }
      if (str[s] == ')' || str[s] == ']') {
        brArr.pop();
      }
      s++;
    }
    return s - 1;
  }

  let stack = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] == '(' || str[i] == '[') {
      stack.push(str[i]);
    }

    if (str[i] == ')') {
      let tmpBr = stack.pop();
      if (tmpBr == '[') {
        this.err = [t('wrongBraces')];
        return;
      }
    }
    if (str[i] == ']') {
      let tmpBr = stack.pop();
      if (tmpBr == '(') {
        this.err = [t('wrongBraces')];
        return;
      }
    }
  }
  if (stack.length != 0) {
    this.err = [t('wrongBraces')];
    return;
  }

  if (str[0] >= 'a' && str[0] <= 'z') {
    this.err = [t('bigLetterError')];
    return;
  }

  var start = 0;
  var end = 1;
  while (end <= str.length) {
    var cf, num;
    if (str[start] === '(' || str[start] === '[') {
      const strTmp = str.substring(start + 1, getCloseBraces(start));
      let c = k;

      end = getCloseBraces(start) + 1;
      if (str[end] >= '1' && str[end] <= '9') {
        c = parseInt(str.substring(end)) * k;
        while (str[end] >= '0' && str[end] <= '9') {
          end++;
        }
      }

      this.parse(strTmp, c);
    } else {
      if (str[end] >= 'a' && str[end] <= 'z') {
        end++;
      }
      num = _.findIndex(table, it => it.element === str.substring(start, end));
      if (num === -1) {
        this.err = [t('inputDataError'), t('bigLetterError')];
        return;
      }
      if (str[end] >= '1' && str[end] <= '9') {
        cf = parseInt(str.substring(end)) * k;
        while (str[end] >= '0' && str[end] <= '9') {
          end++;
        }
      } else {
        cf = k;
      }
      this.Add({ coef: cf, elements: num.toString() });
    }
    start = end;
    end++;
  }
}

export const NOD = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (a && b) {
    if (a > b) {
      a %= b;
    } else b %= a;
  }
  return a + b;
};

export const alignment = function (equation) {
  let oxidation = ions;

  let errors = [];

  if (equation.indexOf('=') == -1 || equation.indexOf('+') == -1) {
    const errors = [t('wrongEquation')];
    return { errors };
  }
  var subsL = equation.replace(/\s+/g, '').split('=')[0].split('+');
  var subsR = equation.replace(/\s+/g, '').split('=')[1].split('+');

  subsL = subsL.map(el => prepareChemicalElement(el).substance);
  subsR = subsR.map(el => prepareChemicalElement(el).substance);

  var elems = {};

  function prepareChemicalElement(elementStr) {
    const element = { inline: elementStr };
    element.substance = `000${elementStr}`.replace(/\d+/, '');

    return element;
  }

  function isInteger(num) {
    var s = (num + '').substring((num + '').indexOf('.') + 1, 5);
    return (num ^ 0) === num || s + 1 == 1;
  }

  function elemsCmp(a, b) {
    if (a.elements > b.elements) return 1;
    else return -1;
  }

  function combine(arr) {
    if (oxidation.ions === undefined && oxidation.data !== undefined) {
      oxidation = oxidation.data;
    }

    for (let ii in oxidation.ions.vertical) {
      for (let ji in oxidation.ions.horizontal) {
        var tmpArr = [];
        tmpArr.parse = parse;
        var key_i = Object.keys(oxidation['ions']['vertical'][ii])[0];
        var key_j = Object.keys(oxidation['ions']['horizontal'][ji])[0];
        var p_i = oxidation['ions']['vertical'][ii][key_i];
        var p_j = oxidation['ions']['horizontal'][ji][key_j];
        tmpArr.parse(
          '(' +
            key_i +
            ')' +
            Math.abs(p_j) / NOD(p_j, p_i) +
            '(' +
            key_j +
            ')' +
            Math.abs(p_i) / NOD(p_j, p_i),
          1,
        );
        var isEquels = tmpArr.length == arr.length;
        var l = 0;
        tmpArr.sort(elemsCmp);
        arr.sort(elemsCmp);
        while (isEquels && l < tmpArr.length) {
          isEquels =
            tmpArr[l].elements == arr[l].elements &&
            tmpArr[l].coef == Math.abs(arr[l].coef);
          l++;
        }
        if (isEquels) {
          return [
            { sub: key_i, p: p_i, c: Math.abs(p_j) / NOD(p_j, p_i) },
            { sub: key_j, p: p_j, c: Math.abs(p_i) / NOD(p_j, p_i) },
          ];
        }
      }
    }
    return 0;
  }

  function isSimpleElement(arr, i, j) {
    for (let e in arr) {
      if ((arr[e][j].c != 0 || arr[e][j].p != 0) && e != i) return 0;
    }
    return 1;
  }

  function setPower(sumPower, subs, multiplier, index) {
    var arr = [];
    arr.parse = parse;
    arr.parse(subs, multiplier);
    if (typeof arr.err !== 'undefined' && errors.indexOf(arr.err) == -1)
      errors.concat(arr.err);
    var ionsArr = combine(arr);
    if (ionsArr) {
      for (let i = 0; i < ionsArr.length; i++) {
        setPower(
          ionsArr[i].p,
          ionsArr[i].sub,
          ionsArr[i].c * multiplier,
          index,
        );
      }
    } else {
      for (let j = 0; j < arr.length; j++) {
        arr[j].p = 0;
        if (arr.length == 1) {
          arr[j].p = sumPower;
          continue;
        }
        if (arr.length == 2) {
          if (arr[j]['elements'] == 0) {
            if (
              table[arr[arr.length - 1 - j]['elements']]['class'] == 'METALS'
            ) {
              arr[j].p = -1;
            } else arr[j].p = 1;
          } else if (arr[j]['elements'] == 7) {
            if (arr[arr.length - 1 - j]['elements'] == 8) {
              arr[j].p = 2;
            } else if (
              arr[arr.length - 1 - j]['elements'] == 0 &&
              arr[j]['coef'] == 2
            ) {
              arr[j].p = -1;
            } else arr[j].p = -2;
          } else if (
            table[arr[j]['elements']]['group'] == '7 A' &&
            table[arr[j]['elements']]['period'] >= 3 &&
            table[arr[j]['elements']]['period'] <= 6
          ) {
            if (
              table[arr[arr.length - 1 - j]['elements']]['class'] == 'METALS' ||
              arr[arr.length - 1 - j] == 0
            ) {
              arr[j].p = -1;
            } else if (
              table[arr[j]['elements']]['group'] == '6 A' &&
              table[arr[j]['elements']]['period'] >= 3 &&
              table[arr[j]['elements']]['period'] <= 6
            ) {
              if (
                table[arr[arr.length - 1 - j]['elements']]['class'] ==
                  'METALS' ||
                arr[arr.length - 1 - j] == 0
              ) {
                arr[j].p = -2;
              } else if (
                table[arr[j]['elements']]['group'] == '5 A' &&
                table[arr[j]['elements']]['period'] >= 2 &&
                table[arr[j]['elements']]['period'] <= 5
              ) {
                if (
                  table[arr[arr.length - 1 - j]['elements']]['class'] ==
                    'METALS' ||
                  arr[arr.length - 1 - j] == 0
                ) {
                  arr[j].p = -3;
                }
              }
            }
          }
        } else {
          if (arr[j]['elements'] == 7) arr[j].p = -2;
          else if (arr[j]['elements'] == 0) arr[j].p = 1;
        }
        if (
          table[arr[j]['elements']]['group'] === '1 A' &&
          arr[j]['elements'] != 0
        )
          arr[j].p = 1;
        else if (table[arr[j]['elements']]['group'] === '2 A') arr[j].p = 2;
        else if (
          table[arr[j]['elements']]['group'] === '3 A' &&
          table[arr[j]['elements']]['period'] <= 3
        )
          arr[j].p = 3;
        else if (arr[j]['elements'] == 8) arr[j].p = -1;
      }
      var p = -1;

      var sum = 0;
      for (let i = 0; i < arr.length; i++) {
        sum += (arr[i].p * arr[i].coef) / multiplier;
        if (arr[i].p == 0) {
          p = i;
        }
      }
      if (p >= 0) {
        arr[p].p = (sumPower - sum) / Math.abs(arr[p].coef / multiplier);
      }

      for (let j = 0; j < arr.length; j++) {
        if (typeof elems[arr[j]['elements']] === 'undefined') {
          elems[arr[j]['elements']] = [];
        }
        if (typeof elems[arr[j]['elements']][index] === 'undefined')
          elems[arr[j]['elements']][index] = { c: arr[j]['coef'], p: arr[j].p };
        else elems[arr[j]['elements']][index].c += arr[j].coef;
      }
    }
  }

  for (let i = 0; i < subsL.length; i++) {
    setPower(0, subsL[i], 1, i);
  }
  for (let i = 0; i < subsR.length; i++) {
    setPower(0, subsR[i], -1, i + subsL.length);
  }
  if (errors != '') return { errors };
  var max = 0;
  for (let i in elems) {
    max = max > elems[i].length ? max : elems[i].length;
  }

  for (let i in elems) {
    for (let j = 0; j < max; j++) {
      if (typeof elems[i][j] === 'undefined') {
        elems[i][j] = { c: 0, p: 0 };
      }
    }
  }
  let balance = [];
  var powerIndex = [];
  for (let i in elems) {
    var powerArr = [];
    var coefsArr = [];
    for (let j = 0; j < elems[i].length; j++) {
      if (elems[i][j].c != 0 && powerArr.indexOf(elems[i][j].p) == -1) {
        powerArr.push(elems[i][j].p);
        if (isSimpleElement(elems, i, j)) {
          coefsArr.push(Math.abs(elems[i][j].c));
        } else coefsArr.push(1);
      }
    }
    if (powerArr.length == 2) {
      var j = 0;
      while (elems[i][j].c == 0) {
        j++;
      }
      powerIndex.push(j);
      var x = {
        el: table[i]['element'],
        powerL: powerArr[0],
        powerR: powerArr[1],
        cl: coefsArr[0],
        cr: coefsArr[1],
      };
      x.razn = x.cl * x.cr * (x.powerL - x.powerR);
      if (x.razn > 0) {
        x.process = ['Восстановитель', 'Окислитель'];
      } else {
        x.process = ['Окислитель', 'Восстановитель'];
      }
      balance.push(x);
    }
  }
  let coefs = [];
  var matrix = [];

  var ni = 0;
  for (let i in elems) {
    matrix[ni] = [];
    for (let j in elems[i]) {
      matrix[ni].push(elems[i][j].c);
    }
    ni++;
  }

  if (
    matrix[matrix.length - 1].length - matrix.length > 1 &&
    balance.length == 2
  ) {
    matrix[matrix.length] = [];
    for (let i = 0; i < matrix[0].length; i++) {
      matrix[matrix.length - 1][i] = 0;
    }
    for (let i = 0; i < powerIndex.length; i++) {
      matrix[matrix.length - 1][powerIndex[i]] = balance[i].razn;
    }
  }

  function arrCmp(a, b) {
    let aToS = '',
      bToS = '';

    for (let i = 0; i < a.length; i++) {
      aToS += Math.abs(a[i]);
    }

    for (let i = 0; i < b.length; i++) {
      bToS += Math.abs(b[i]);
    }

    if (aToS < bToS) return 1;
    return -1;
  }

  function zeroStr(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] != 0) return true;
    }
    return false;
  }

  for (let i = 0; i < matrix.length - 1; i++) {
    matrix.sort(arrCmp);
    let a = matrix[i][i];
    for (let j = i + 1; j < matrix.length; j++) {
      let b = matrix[j][i];
      if (b !== 0) {
        for (let k = i; k < matrix[j].length; k++) {
          matrix[j][k] = matrix[i][k] - (matrix[j][k] * a) / b;
        }
      }
    }
  }

  for (let i = 0; i < matrix[0].length; i++) {
    coefs[i] = 0;
  }
  coefs[coefs.length - 1] = 1;

  while (!zeroStr(matrix[matrix.length - 1])) matrix.length--;
  for (let i = matrix.length - 1; i >= 0; i--) {
    var sum = 0;
    for (let j = i + 1; j < matrix.length; j++) {
      sum += matrix[i][j] * coefs[j];
    }
    sum = matrix[i][matrix.length] - sum;
    coefs[i] = (coefs[coefs.length - 1] * sum) / matrix[i][i];
  }
  for (let i = 0; i < coefs.length; i++) {
    coefs[i] = Math.abs(coefs[i]);
  }
  coefs.allInteger = function () {
    for (let i = 0; i < this.length; i++) {
      if (!isInteger(this[i])) return false;
    }
    return true;
  };
  var k = 2;
  const errorsOddsAndEquation = [
    t('failedSetOdds'),
    t('equationNotExist'),
  ];

  if (coefs.indexOf(0) != -1) {
    const errors = errorsOddsAndEquation;
    return { errors };
  }
  while (!coefs.allInteger()) {
    for (let i = 0; i < coefs.length; i++) {
      if (coefs[i] + '' == 'NaN') {
        const errors = errorsOddsAndEquation;
        return { errors };
      }
      coefs[i] /= k - 1;
      coefs[i] *= k;
    }
    k++;
  }

  errors = [];

  balance.forEach(({ powerL, powerR }) => {
    if (
      powerL > 10000 ||
      powerR > 10000 ||
      !Number.isInteger(powerL) ||
      !Number.isInteger(powerR)
    ) {
      errors = errorsOddsAndEquation;
    }
  });

  coefs.forEach(coef => {
    if (coef > 10000 || !Number.isInteger(coef)) {
      errors = errorsOddsAndEquation;
    }
  });

  if (errors.length) {
    return { errors };
  }

  return { subsL, subsR, coefs, balance };
};

export const roundValue = strValue => {
  const value = parseFloat(strValue);
  const roundedValueRough = parseFloat(value.toFixed(2));
  const roundedValueAccurate = parseFloat(value.toFixed(5));

  return roundedValueRough === 0 ? roundedValueAccurate : roundedValueRough;
};
