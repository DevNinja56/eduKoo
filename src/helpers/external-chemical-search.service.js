import * as _ from 'lodash';

import { apiService } from '../api';

function prepareReaction(reactionData) {
  if (_.isNil(reactionData)) {
    return null;
  }

  const { reaction, ion = null, conditions: condition = null } = reactionData;

  return { reaction, ion, condition };
}

function prepareReactions(rawResponse) {
  const error = rawResponse.success ? null : 'Reaction is not found';
  if (error) {
    return {
      status: 'error',
      why: error,
      reactions: [],
    };
  }

  const response = {
    reactions: [],
    status: 'success',
  };

  response.reactions = rawResponse.reactions
    .map(prepareReaction)
    .filter(reaction => reaction);

  return response;
}

export async function solveReaction(reaction) {
  try {
    const { data } = await apiService.get(
      `/reaction/solve?reaction=${reaction}&size=100`,
    );

    return prepareReactions(data);
  } catch (e) {
    throw e;
  }
}

function prepareChain(steps, chain) {
  const response = {
    reactions: [],
    status: steps.success ? 'success' : 'error',
    react_string: chain,
  };

  _.each(steps.chain, step => {
    if (step.solving.success) {
      response.reactions.push(
        prepareReaction(_.first(_.get(step, ['solving', 'reactions'], []))),
      );
    }
  });

  return response;
}

export async function solveChain(chain) {
  try {
    const { data } = await apiService.get(`/chain/solve?chain=${chain}&size=1`);

    return prepareChain(data, chain);
  } catch (e) {
    throw e;
  }
}
