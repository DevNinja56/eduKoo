import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { solveChain } from '../../../helpers/chemical-search.service';
import { Reaction } from '../../../components/ReactionsTemplate/entities';
import { colors } from '../../../styles';
import { SkewableView, ReactionsTemplate } from '../../../components';
import { EXAMPLES, DEFAULT_EXAMPLE } from '../constants';
import { PaidFeature } from '../../monetization';
import { CHAIN_SOLUTION } from '../../monetization/constants';
import {
  styles,
  ResultText,
  ResultChainText,
  ArrowWrapper,
  ArrowNumber,
  ArrowText,
} from './styles';

const Chains = () => {
  const { t } = useTranslation();
  const [results, setResults] = useState<{
    chain: string;
    reactions: Reaction[];
  }>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchChains = async (searchValue: string) => {
    try {
      const { reactions, react_string } = await solveChain(searchValue);

      setResults({ chain: react_string, reactions });
    } catch (e) {
      setResults(undefined);
      setError(t('reactions.error'));
    }

    setIsLoading(false);
  };

  const handleSearch = (searchValue: string) => {
    const errors = [];

    if (searchValue.includes('+')) {
      errors.push(t('chains.errorPlus'));
    }
    if (searchValue === '=' || searchValue === '===') {
      errors.push(t('chains.errorEqual'));
      errors.push(t('chains.errorReaction'));
    }

    if (errors.length) {
      setResults(undefined);
      setError(errors.join(' '));
    } else {
      setIsLoading(true);
      setTimeout(() => searchChains(searchValue), 0);
    }
  };

  const renderArrow = (num: number) => {
    return (
      <ArrowWrapper>
        <ArrowNumber>{num}</ArrowNumber>
        <ArrowText>→</ArrowText>
      </ArrowWrapper>
    );
  };

  const renderResults = () => {
    if (!results) {
      return null;
    }

    return (
      <React.Fragment>
        <SkewableView
          style={styles.resultsChainSkew}
          containerStyle={styles.resultChainContainer}
          colors={[colors.purple3A, colors.purple3A]}
        >
          {results.chain.split('=').map((it, index, array) => (
            <React.Fragment>
              <ResultChainText>{it}</ResultChainText>
              {index + 1 !== array.length && renderArrow(index + 1)}
            </React.Fragment>
          ))}
        </SkewableView>
        <PaidFeature featureKey={CHAIN_SOLUTION}>
          {results.reactions.map((it, index) => (
            <SkewableView
              key={it.reaction}
              style={styles.resultsSkew}
              containerStyle={styles.resultContainer}
              colors={[colors.purple1, colors.purple1]}
            >
              <ResultText>{`${index + 1}) ${it.reaction}`}</ResultText>
            </SkewableView>
          ))}
        </PaidFeature>
      </React.Fragment>
    );
  };

  return (
    <ReactionsTemplate
      defaultExample={DEFAULT_EXAMPLE}
      examples={EXAMPLES}
      renderResults={renderResults}
      onFind={handleSearch}
      error={error}
      showExamples={!results}
      isLoading={isLoading}
    />
  );
};

export default Chains;
