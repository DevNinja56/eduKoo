import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, ViewStyle } from 'react-native';

import { colors } from '../../styles';
import MainContainer from '../MainContainer';
import SkewableView from '../SkewableView';
import Button from '../Button';
import Input from '../Input';
import ErrorBlock from '../ErrorBlock';
import {
  styles,
  SearchWrapper,
  ExamplesTitle,
  Example,
  ExampleText,
  Preloader,
} from './styles';

interface Props {
  defaultExample: string;
  examples: string[];
  onFind: (searchValue: string) => void;
  renderResults: () => JSX.Element | JSX.Element[] | null;
  showExamples?: boolean;
  isLoading?: boolean;
  searchText?: string;
  contentStyle?: ViewStyle;
  error?: string;
}

interface Ref {
  searchFromOutside: (search: string) => void;
}

const ReactionsTemplate: ForwardRefRenderFunction<Ref, Props> = (
  props,
  ref,
) => {
  const {
    defaultExample,
    examples,
    onFind,
    renderResults,
    showExamples,
    isLoading,
    searchText,
    contentStyle,
    error,
  } = props;
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const handleSearchPress = () => {
    const isEmpty = !search.trim().length;
    const searchValue = isEmpty ? defaultExample : search;

    setSearch(searchValue);
    onFind(searchValue);
  };

  const handleExamplePress = (newSearch: string) => () => {
    setSearch(newSearch);
    onFind(newSearch);
  };

  useImperativeHandle(
    ref,
    () => ({
      searchFromOutside(val: string) {
        setSearch(val);
        onFind(val);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const renderExamples = () => {
    return examples.map(it => (
      <Example onPress={handleExamplePress(it)} key={it}>
        <SkewableView
          containerStyle={styles.exampleContainer}
          colors={[colors.purple1, colors.purple1]}
        >
          <ExampleText>{it}</ExampleText>
        </SkewableView>
      </Example>
    ));
  };

  return (
    <MainContainer>
      <SearchWrapper>
        <Input
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchPress}
          placeholder={`${t('example')} ${defaultExample}`}
        />
        <Button onPress={handleSearchPress}>{searchText || t('find')}</Button>
      </SearchWrapper>
      {isLoading ? (
        <Preloader size={75} />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentStyle]}
        >
          <View>
            {showExamples ? (
              <React.Fragment>
                <ExamplesTitle>{t('examples')}</ExamplesTitle>
                {renderExamples()}
                {!!error && <ErrorBlock>{error}</ErrorBlock>}
              </React.Fragment>
            ) : (
              renderResults()
            )}
          </View>
        </ScrollView>
      )}
    </MainContainer>
  );
};

export default forwardRef(ReactionsTemplate);
