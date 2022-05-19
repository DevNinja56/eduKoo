import styled from 'styled-components/native';

import { SubText } from '../../../../components';
import { metrics, colors } from '../../../../styles';

export const TitleWrapper = styled.View`
  margin-bottom: ${metrics.spacing * 1.2}px;
`;

export const Title = styled(SubText)`
  color: ${colors.white};
  font-size: ${metrics.fontSize.regular}px;
  font-family: ${metrics.fontFamily.univiaProItalic};
`;

export const TextStyled = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.regular * 0.9}px;
  line-height: ${metrics.fontSize.regular * 1.2}px;
  color: ${colors.pink1};
`;

export const SubTextStyled = styled(SubText)`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.regular * 0.9}px;
  line-height: ${metrics.fontSize.regular * 1.2}px;
  color: ${colors.pink1};
`;

export const Section = styled.View`
  margin-bottom: ${metrics.spacing * 1.2}px;
`;

export const TileElementsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const TileElementWrapper = styled.View`
  width: 60px;
  height: 60px;
  justify-content: flex-end;
  padding: ${metrics.spacing * 0.4}px;
  margin-right: ${metrics.spacing}px;
  margin-bottom: ${metrics.spacing * 1.2}px;
  background-color: ${colors.purple2};
`;

export const TileElement = styled.Text`
  color: ${colors.white};
  font-size: ${metrics.fontSize.large}px;
  margin-bottom: ${metrics.spacing * 0.25}px;
  font-weight: 700;
`;

export const TileElementMolarMass = styled.Text`
  width: 100%;
  color: ${colors.white};
  background-color: ${colors.red};
  font-size: ${metrics.fontSize.medium}px;
  text-align: center;
`;
