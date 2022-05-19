import { searchReaction } from './local-chemical-search.service';
import {
  filterUniqReactions,
  prepareReactionForDisplay,
  splitChainOntoReactions,
} from './chemical-helper.service';
import {
  solveReaction as solveReactionAsync,
  solveChain as solveChainAsync,
} from './external-chemical-search.service';

export async function solveReaction(reaction, limit = 100) {
  const results = searchReaction(reaction);

  if (results.reactions.length) {
    return {
      ...results,
      reactions: results.reactions.map(it => ({
        ...it,
        reaction: prepareReactionForDisplay(it.reaction),
      })),
    };
  } else {
    try {
      const data = await solveReactionAsync(reaction);
      const { reactions } = searchReaction(reaction, limit, data.reactions);

      if (!reactions.length) {
        throw 'error';
      }

      return {
        reactions: filterUniqReactions(reactions),
      };
    } catch (e) {
      throw e;
    }
  }
}

export async function solveChain(chain) {
  try {
    const reactionsToSearch = splitChainOntoReactions(chain);
    const data = await Promise.all(
      reactionsToSearch.map(async reaction => await solveReaction(reaction)),
    );

    return {
      reactions: data.map(it => it.reactions[0]),
      react_string: chain,
      status: 'success',
    };
  } catch (e) {
    return await solveChainAsync(chain);
  }
}
