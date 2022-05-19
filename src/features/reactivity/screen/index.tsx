import React from 'react';
import { Image, ScrollView } from 'react-native';

import arrowDown from '../../../assets/images/icons/arrow-down.png';
import tableColors from '../../../json/tableColors.json';
import activitiesElements from '../../../json/activitiesElements.json';
import { metrics } from '../../../styles';
import { MainContainer } from '../../../components';
import {
  ElementsWrapper,
  ArrowsWrapper,
  ArrowLineWrapper,
  ArrowLine,
  Element,
  ElementText,
} from './styles';

const Reactivity = () => {
  const renderElements = () => {
    return activitiesElements.map((elementName: string) => {
      const elementColors =
        elementName === '(H)'
          ? tableColors['Неметаллы']
          : tableColors['Металлы.Щелочные металлы'];

      return (
        <Element colors={elementColors} key={elementName}>
          <ElementText>{elementName}</ElementText>
        </Element>
      );
    });
  };

  const renderArrows = () => {
    return [...Array(5)].map((it, index, arr) => (
      <ArrowLineWrapper key={index} last={index === arr.length - 1}>
        <ArrowLine />
        <Image source={arrowDown} />
      </ArrowLineWrapper>
    ));
  };

  return (
    <MainContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: metrics.spacing * 2,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <ElementsWrapper>{renderElements()}</ElementsWrapper>
        <ArrowsWrapper>{renderArrows()}</ArrowsWrapper>
      </ScrollView>
    </MainContainer>
  );
};

export default Reactivity;
