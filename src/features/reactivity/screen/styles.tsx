import styled from 'styled-components/native';

import { colors, metrics } from '../../../styles';
import {
  ColorElement as UnstyledColorElement,
  Text,
} from '../../../components';

export const ElementsWrapper = styled.View`
  margin-left: ${metrics.spacing * 2.5}px;
`;

export const ArrowsWrapper = styled.View`
  padding-top: ${metrics.spacing * 0.5}px;
`;

export const ArrowLineWrapper = styled.View<{ last: boolean }>`
  opacity: 0.4;
  margin-bottom: ${({ last }) => (last ? 0 : metrics.spacing * 5.5)}px;
  margin-left: ${metrics.spacing * 0.5}px;
  margin-right: ${metrics.spacing * 0.5}px;
`;

export const ArrowLine = styled.View`
  height: 178px;
  width: 2px;
  margin-left: 11px;
  opacity: 0.67;
  background-color: ${colors.pink};
`;

export const Element = styled(UnstyledColorElement)`
  height: 50px;
  width: 50px;
  justify-content: center;
  align-items: center;
`;

export const ElementText = styled(Text)`
  font-size: ${metrics.fontSize.medium}px;
  color: ${colors.darkBlue};
`;
