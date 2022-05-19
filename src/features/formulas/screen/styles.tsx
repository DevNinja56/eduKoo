import styled from 'styled-components/native';

import { SkewableView } from '../../../components';
import { metrics } from '../../../styles';

export const HeaderWrapper = styled(SkewableView)`
  margin-top: ${metrics.spacing * 1.5}px;
`;

export const MeasureWrapper = styled(SkewableView)`
  padding: 0 ${metrics.spacing * 0.7}px;
  margin-left: ${metrics.spacing * 0.5}px;
`;

export const ItemWrapper = styled(SkewableView)`
  margin-top: ${metrics.spacing * 0.4}px;
`;

export const SymbolMeasureWrapper = styled.View`
  height: ${metrics.spacing * 2}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
