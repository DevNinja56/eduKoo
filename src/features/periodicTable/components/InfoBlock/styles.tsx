import styled from 'styled-components/native';

import { colors, metrics } from '../../../../styles';

export const Wrapper = styled.View`
  padding: ${metrics.spacing}px;
  border-bottom-width: 1px;
  border-bottom-color: #432777;
`;

export const Title = styled.Text`
  margin-bottom: ${metrics.spacing * 0.75}px;
  font-family: ${metrics.fontFamily.ptSansBold};
  font-size: ${metrics.fontSize.regular}px;
  color: ${colors.pink};
`;
