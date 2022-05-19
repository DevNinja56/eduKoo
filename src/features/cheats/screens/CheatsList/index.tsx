import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItem } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import filter from 'lodash/filter';

import searchIcon from '../../../../assets/images/icons/search.png';
import { MainContainer, Input } from '../../../../components';
import { SCREENS } from '../../../../navigation/constants';
import inorganic_titles from '../../../../json/cribs/inorganic_titles.json';
import organic_titles from '../../../../json/cribs/organic_titles.json';
import { StackParamList } from '../../../../navigation/entities';
import { colors, metrics } from '../../../../styles';
import { Button } from '../CheatsMain/styles';
import { CribsTitle } from '../../constants';
import { styles, SearchWrapper, SearchButton, SearchIcon } from './styles';

const CheatsList = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<StackParamList, SCREENS.CHEATS_LIST>>();
  const initialData = useMemo(() => {
    const titles: CribsTitle[] =
      params.section === 'ORGANIC' ? organic_titles : inorganic_titles;

    return titles.map((it, index) => ({ ...it, number: index + 1 }));
  }, [params.section]);
  const [filteredData, setFilteredData] = useState<CribsTitle[]>(initialData);
  const [search, setSearch] = useState('');

  const renderItem: ListRenderItem<CribsTitle> = ({
    item: { title, number },
  }) => {
    return (
      <Button
        onPress={() =>
          navigation.navigate(SCREENS.CHEATS_ARTICLE, {
            section: params.section,
            title,
          })
        }
        skewContainerStyle={styles.articleButtonContainer}
        textStyle={styles.articleButtonText}
        bgColors={[colors.purple1, colors.purple1]}
        additionalText={number?.toString()}
        additionalTextStyle={styles.articleNumber}
      >
        {title}
      </Button>
    );
  };

  useEffect(() => {
    const lowerCasedSearch = search.toLowerCase();
    const isEmpty = !lowerCasedSearch.trim().length;

    if (isEmpty) {
      setFilteredData(initialData);

      return;
    }

    const filtered = filter(
      initialData,
      it =>
        it.title.toLowerCase().includes(lowerCasedSearch) ||
        it.keywords?.toLowerCase().includes(lowerCasedSearch) ||
        it?.number === +lowerCasedSearch,
    ) as CribsTitle[];

    setFilteredData(filtered);
  }, [search]);

  return (
    <MainContainer showPreloader>
      <SearchWrapper>
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder={t('cheats.list.search')}
        />
        <SearchButton>
          <SearchIcon source={searchIcon} />
        </SearchButton>
      </SearchWrapper>
      <FlatList
        keyExtractor={it => it.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: metrics.spacing,
          paddingBottom: metrics.spacing * 3,
        }}
        data={filteredData}
        renderItem={renderItem}
      />
    </MainContainer>
  );
};

export default CheatsList;
