import styled from 'styled-components/native';

import { colors, metrics } from '../../styles';
import SkewableView from '../SkewableView';

export const Wrapper = styled(SkewableView)`
  padding: 1px;
`;

export const ContentWrapper = styled(SkewableView)`
  padding: ${metrics.spacing * 0.75}px ${metrics.spacing}px;
`;

export const Text = styled.Text`
  font-family: ${metrics.fontFamily.ptSansItalic};
  color: ${colors.peach};
`;
