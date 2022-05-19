import styled from 'styled-components/native';

import { colors, metrics } from '../../styles';

interface Props {
  columnWidth?: number;
}

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
  position: relative;
`;

export const RowLineWrapper = styled.View<Props>`
  flex-direction: row;
  align-items: center;
  height: 30px;
  padding-left: ${({ columnWidth }) => columnWidth || 0}px;
  background-color: rgba(44, 29, 95, 0.85);
`;

export const ColumnLineWrapper = styled.View<Props>`
  position: absolute;
  top: 30px;
  bottom: 0;
  z-index: 99;
  width: ${({ columnWidth }) => `${columnWidth}px` || 'auto'};
  background-color: rgba(31, 15, 84, 0.85);
`;

export const LineText = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  color: ${colors.pink1};
`;

export const RowLineText = styled(LineText)`
  text-align: center;
  width: ${metrics.height / 8}px;
`;

export const ColumnLineTextWrapper = styled.View`
  flex: 1;
  align-items: center;
  padding-top: 25px;
`;

export const ContentWrapper = styled.View<Props>`
  flex: 1;
  padding-left: ${({ columnWidth }) => columnWidth || 0}px;
`;

export const ContentRow = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const ContentCell = styled.View`
  position: relative;
  width: ${metrics.height / 8}px;
  background-color: ${colors.none};
`;
