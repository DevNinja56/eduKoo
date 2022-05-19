import * as _ from 'lodash';

import localReactions from '../json/localReactions.json';
import * as chemicalHelper from './chemical-helper.service';

export function searchReaction(
  reactionStr,
  limit = 100,
  reactionsList = localReactions,
) {
  let searchResults = [];
  const searchResultsByRates = {};
  const reaction = chemicalHelper.parseReaction(reactionStr);

  for (const candidate of reactionsList) {
    const candidateReaction = chemicalHelper.parseReaction(candidate.reaction);
    const totalSearchRate = getReactionSearchRate(reaction, candidateReaction);

    if (totalSearchRate > 0) {
      chemicalHelper.addItemToSet(
        searchResultsByRates,
        candidate,
        totalSearchRate,
      );
    }
  }

  Object.keys(searchResultsByRates)
    .sort()
    .forEach(key => {
      const sortedReactions = searchResultsByRates[key].sort(
        (c1, c2) => c1.reaction.length - c2.reaction.length,
      );
      searchResults = sortedReactions.concat(searchResults);
    });

  searchResults = chemicalHelper.filterUniqReactions(searchResults);

  return {
    reactions: searchResults.slice(0, limit),
    status: 'success',
  };
}

export function getReactionSearchRate(reaction, candidateReaction) {
  const rates = {
    lhs: getSideSearchRate(reaction.lhs, candidateReaction.lhs),
    rhs: getSideSearchRate(reaction.rhs, candidateReaction.rhs),
    revLhs: getSideSearchRate(reaction.lhs, candidateReaction.rhs),
    revRhs: getSideSearchRate(reaction.rhs, candidateReaction.lhs),
  };

  rates.direct = rates.lhs > 0 && rates.rhs > 0 ? rates.lhs + rates.rhs : 0;
  rates.reverse =
    rates.revLhs > 0 && rates.revRhs > 0 ? rates.revLhs + rates.revRhs : 0;
  rates.any = Math.max(rates.direct, rates.reverse, rates.lhs, rates.rhs);

  let totalSearchRate;

  switch (reaction.structure) {
    case 'any':
      totalSearchRate = rates.any;
      break;

    case 'lhs':
      totalSearchRate = rates.lhs;
      break;

    case 'rhs':
      totalSearchRate = rates.rhs;
      break;

    case 'full':
      totalSearchRate = rates.direct;
      break;

    default:
      totalSearchRate = rates.any;
  }

  return totalSearchRate;
}

export function getSideSearchRate(source, candidate) {
  const costs = [];
  source.forEach((sElement, sIndex) => {
    costs[sIndex] = [];
    const prep = chemicalHelper.prepareReactionForComparison;

    candidate.forEach((cElement, cIndex) => {
      let cost = 0;
      if (prep(sElement.inline) === prep(cElement.inline)) {
        cost = 2;
      } else if (prep(sElement.substance) === prep(cElement.substance)) {
        cost = 1;
      } else {
        cost = 0;
      }

      costs[sIndex][cIndex] = cost;
    });
  });

  if (!isRatesMatrixValid(costs)) {
    return 0;
  }

  return getMaxRatesFromMatrix(
    costs,
    Math.max(source.length, candidate.length),
  );
}

export function getMaxRatesFromMatrix(rates, matrixSize) {
  const cases = chemicalHelper.generatePermutations(matrixSize);
  let maxRate = 0;

  _.each(cases, singleCase => {
    const caseValue = getCaseValue(singleCase);
    maxRate = Math.max(maxRate, caseValue);
  });

  return maxRate;

  function getCaseValue(singleCase) {
    return singleCase
      .map((colIndex, rowIndex) =>
        rates[rowIndex] instanceof Array ? rates[rowIndex][colIndex] : 0,
      )
      .reduce((sum, current) => sum + (current ? current : 0), 0);
  }
}

export function isRatesMatrixValid(rates) {
  if (rates.length === 0) {
    return false;
  }

  return _.reduce(
    rates,
    (isValid, row) => isValid && _.reduce(row, (sum, n) => sum + n, 0) > 0,
    true,
  );
}
