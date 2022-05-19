import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { solveReaction } from '../../../helpers/chemical-search.service';
import { Reaction } from '../../../components/ReactionsTemplate/entities';
import { colors } from '../../../styles';
import { SkewableView, ReactionsTemplate } from '../../../components';
import { EXAMPLES, DEFAULT_EXAMPLE } from '../constants';
import { styles, ResultText } from './styles';

const Reactions = () => {
  const { t } = useTranslation();
  const [results, setResults] = useState<Reaction[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchReactions = async (searchValue: string) => {
    try {
      const { reactions } = await solveReaction(searchValue);

      setResults(reactions as Reaction[]);
    } catch (e) {
      setResults([]);
      setError(t('reactions.error'));
    }

    setIsLoading(false);
  };

  const handleSearch = (searchValue: string) => {
    setIsLoading(true);
    setTimeout(() => searchReactions(searchValue), 0);
  };

  const renderResults = () => {
    return results.map(it => (
      <SkewableView
        key={it.reaction}
        style={styles.resultsSkew}
        containerStyle={styles.resultContainer}
        colors={[colors.purple1, colors.purple1]}
      >
        <ResultText>{it.reaction}</ResultText>
      </SkewableView>
    ));
  };

  return (
    <ReactionsTemplate
      defaultExample={DEFAULT_EXAMPLE}
      examples={EXAMPLES}
      renderResults={renderResults}
      onFind={handleSearch}
      error={error}
      showExamples={!results.length}
      isLoading={isLoading}
    />
  );
};

export default Reactions;
