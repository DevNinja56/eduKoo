import styled from 'styled-components/native';
import { Platform } from 'react-native';

import { colors, metrics } from '../../../../styles';

export const Wrapper = styled.ScrollView``;

export const Content = styled.View`
  padding: ${metrics.spacing}px;
  margin-top: ${metrics.spacing}px;
`;

export const Text = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.small}px;
  color: ${colors.pink1};
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${metrics.spacing * 0.75}px;
`;

export const LevelText = styled(Text)`
  font-size: ${metrics.fontSize.regular * 0.9}px;
  margin-right: ${metrics.spacing * 0.75}px;
`;

export const Cell = styled.View<{ last?: boolean }>`
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: ${colors.purple3};
  margin-right: ${({ last }) => (last ? 0 : metrics.spacing * 0.15)}px;
`;

export const ArrowText = styled(Text)`
  font-family: ${metrics.fontFamily.ptSansBold};
  text-align: center;
  font-size: ${Platform.OS === 'ios'
    ? metrics.fontSize.small * 0.8
    : metrics.fontSize.regular}px;
  color: ${colors.white};
`;

export const Separator = styled.View`
  width: 20px;
  height: 1px;
  background-color: rgb(90, 52, 136);
`;

export const OrbsWrapper = styled(Row)`
  margin-left: ${metrics.spacing}px;
`;

export const OrbTitleWrapper = styled.View<{ width: number; color: string }>`
  width: ${({ width }) => width}px;
  border-top-width: 1px;
  border-top-color: ${({ color }) => color};
  align-items: center;
  justify-content: center;
  padding: ${metrics.spacing * 0.25}px;
  margin-right: ${metrics.spacing * 0.25}px;
`;

export const OrbTitle = styled(Text)`
  font-size: ${metrics.fontSize.regular * 0.9}px;
`;
