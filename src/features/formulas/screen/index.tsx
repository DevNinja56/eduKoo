/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { SectionList, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

import formulas from '../../../json/formulas.json';
import { MainContainer, SubText, Text } from '../../../components';
import { Formula as FormulaType } from '../../../entities';
import { colors, metrics } from '../../../styles';
import Formula from '../components/Formula';
import {
  HeaderWrapper,
  MeasureWrapper,
  ItemWrapper,
  SymbolMeasureWrapper,
} from './styles';

interface Section {
  info: {
    description: string;
    measure: string;
    symbol: string;
  };
}

const Formulas = () => {
  const { t } = useTranslation();
  const data = formulas.map((it: FormulaType) => {
    const { description, symbol, defaultMeasure } = it;
    const measure = defaultMeasure
      ? defaultMeasure.length > 1
        ? `, ${t(defaultMeasure[0])}/${t(defaultMeasure[1])}`
        : ` , ${t(defaultMeasure[0])}`
      : '';
    const info = {
      description: t(`formulas.${description}`),
      measure,
      symbol,
    };

    return {
      info,
      data: it.frmls,
    };
  });

  const renderSectionHeader = ({ section }: { section: Section }) => {
    const { info } = section;
    const { description, measure, symbol } = info;

    return (
      <HeaderWrapper
        colors={['rgba(86, 75, 255, 0.15)', 'rgba(62, 15, 130, 0)']}
        containerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: metrics.spacing,
          flexWrap: 'wrap',
        }}
      >
        <Text style={{ lineHeight: metrics.spacing * 1.3 }}>{description}</Text>
        <MeasureWrapper
          containerStyle={{
            justifyContent: 'center',
            maxHeight: metrics.spacing * 2,
            paddingBottom: Platform.OS === 'ios' ? 0 : metrics.spacing * 0.5,
          }}
          colors={[colors.blue, colors.blue]}
        >
          <SymbolMeasureWrapper>
            <SubText
              style={{
                fontFamily: 'univiapro-blackitalic',
                color: colors.white,
              }}
              text={symbol}
            />
            <Text>{measure}</Text>
          </SymbolMeasureWrapper>
        </MeasureWrapper>
      </HeaderWrapper>
    );
  };

  const renderItem = ({ item, section }: { item: any; section: Section }) => {
    const {
      info: { symbol },
    } = section;

    return (
      <ItemWrapper
        width="100%"
        colors={[colors.purple1, colors.purple1]}
        containerStyle={{
          paddingHorizontal: metrics.spacing,
          paddingVertical: metrics.spacing * 0.75,
        }}
      >
        <Formula symbol={symbol} top={item.top} bottom={item.bottom} />
      </ItemWrapper>
    );
  };

  return (
    <MainContainer showPreloader preloaderTime={1300}>
      <SectionList
        initialNumToRender={100}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: metrics.spacing * 0.8,
        }}
        keyExtractor={item => item.top}
        sections={data}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </MainContainer>
  );
};

export default Formulas;
