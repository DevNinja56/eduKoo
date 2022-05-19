/* eslint-disable */

import * as _ from 'lodash';

const predefinedPermutations = [];

predefinePermutations();

export function formatReaction(reaction) {
  let formattedReaction = reaction.match(/[A-Za-z0-9\+\=\[\]\(\)]+/g).join('');
  while (formattedReaction.length > 0 && formattedReaction.charAt(0) === '+') {
    formattedReaction = formattedReaction.substr(1);
  }

  while (
    formattedReaction.length > 0 &&
    formattedReaction.charAt(formattedReaction.length - 1) === '+'
  ) {
    formattedReaction = formattedReaction.substr(
      0,
      formattedReaction.length - 1,
    );
  }

  return formattedReaction;
}

export function prepareReactionForComparison(reaction) {
  return formatReaction(reaction)
    .match(/[A-Za-z0-9\+\=]+/g)
    .join('')
    .toLowerCase();
}

// удаление русских слов в реакциях и самой цепочке,типа: (раств.), (катод, анод)
// добавление пробелов между элементами и знаками
export function prepareReactionForDisplay(reaction) {
  const preformattedReaction = reaction
    .replace(/[а-яА-Я]/g, '')
    .replace(/\(\)/g, '')
    .replace(/\( \)/g, '')
    .replace(/\(.\)/g, '')
    .replace(/\(., .\)/g, '');

  const sides = parseReaction(preformattedReaction),
    lhs = sides.lhs.map(el => el.inline).join(' + '),
    rhs = sides.rhs.map(el => el.inline).join(' + ');

  return `${lhs} = ${rhs}`;
}

export function parseReaction(reaction) {
  reaction = formatReaction(reaction);

  let lhs = [],
    rhs = [],
    structure,
    [lhsStr = '', rhsStr = ''] = reaction.split('=');

  lhs = splitReactionSide(lhsStr);
  rhs = splitReactionSide(rhsStr);

  if (reaction.indexOf('=') === -1) {
    structure = 'any';
  } else if (reaction.indexOf('=') === 0) {
    structure = 'rhs';
  } else if (reaction.indexOf('=') === reaction.length - 1) {
    structure = 'lhs';
  } else {
    structure = 'full';
  }

  return { lhs, rhs, structure };
}

export function splitReactionSide(reactionSide = '') {
  return reactionSide
    .trim()
    .split('+')
    .filter(({ length }) => length > 0)
    .map(prepareChemicalElement);
}

export function splitChainOntoReactions(chain) {
  const substances = chain.split('=').map(substance => substance.trim());
  return substances.reduce((result, current, index, array) => {
    if (index > 0) {
      result.push(`${array[index - 1]} = ${current}`);
      return result;
    }
    return result;
  }, []);
}

export function filterUniqReactions(reactions) {
  return _.uniqWith(reactions, (r1, r2) =>
    _.isEqual(formatReaction(r1.reaction), formatReaction(r2.reaction)),
  );
}

export function prepareChemicalElement(elementStr) {
  const element = { inline: elementStr };
  element.substance = `000${elementStr}`.replace(/\d+/, '');

  return element;
}

export function prepareIonLayout(str) {
  if (typeof str !== 'string') {
    return null;
  }

  const htmlStr = str
    .replace(/\n/g, '<br>')
    .replace(/\t/g, '&nbsp;&nbsp;')
    .replace(/аяформа:/g, 'ая форма:<br>');

  return superscriptIonSigns(htmlStr);
}

export function prepareConditionLayout(str) {
  if (typeof str !== 'string') {
    return null;
  }

  let htmlStr = str.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;');

  htmlStr = htmlStr.charAt(0).toUpperCase() + htmlStr.substr(1);

  return htmlStr;
}

export function superscriptIonSigns(str) {
  const ionSigns = [];
  const ionSignsRegEx = /[A-Za-z0-9]([\+\−\-])/g;
  const singleSignRegEx = /[\+\-\−]/;
  let match;

  while ((match = ionSignsRegEx.exec(str))) {
    if (singleSignRegEx.test(match[1])) {
      ionSigns.push({ symbol: match[1], index: match.index });
    }
  }

  let newStr = '',
    prevIndex = 0;
  ionSigns.forEach((ionSign, index) => {
    const partBeforeSign = str.slice(prevIndex, ionSign.index + 1);
    const signWrapped = `<sup>${ionSign.symbol}</sup>`;

    newStr += partBeforeSign + signWrapped;
    prevIndex = ionSign.index + 2;
  });

  return newStr;
}

export function addItemToSet(set, item, kind) {
  if (!(set[kind] instanceof Array)) {
    set[kind] = [];
  }

  set[kind].push(item);
}

export function generatePermutations(length) {
  if (predefinedPermutations[length] instanceof Array) {
    return predefinedPermutations[length];
  }

  const result = [],
    inputArr = Array(length)
      .fill()
      .map((item, index) => index);

  permute(inputArr);
  predefinedPermutations[length] = result;

  return result;

  ////////////////////////////

  function permute(arr, m = []) {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  }
}

export function predefinePermutations(count = 7) {
  for (let i = 0; i < count; i++) {
    generatePermutations(i);
  }
}
