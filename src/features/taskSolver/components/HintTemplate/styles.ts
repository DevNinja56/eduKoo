import styled from 'styled-components/native';

import { colors, metrics } from '../../../../styles';

export const Wrapper = styled.View`
  padding: ${metrics.spacing * 1.4}px;
  flex-direction: row;
  background-color: ${colors.purple4A};
`;

export const Content = styled.View`
  flex: 1;
`;

export const Icon = styled.Image`
  height: 36px;
  width: 36px;
  resize-mode: contain;
  margin-right: ${metrics.spacing * 2}px;
`;
