import styled from 'styled-components/native';

import { SkewableView } from '../../../../components';
import { colors, metrics } from '../../../../styles';

export const Wrapper = styled(SkewableView)`
  height: 24px;
  padding: 0 12px;
`;

export const LabelText = styled.Text`
  font-size: ${metrics.fontSize.regular * 0.9}px;
  font-family: ${metrics.fontFamily.ptSans};
  color: ${colors.white};
`;
