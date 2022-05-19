import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

import SkewableView from '../SkewableView';
import { colors, metrics } from '../../styles';

export const styles = StyleSheet.create({
  skewContainer: {
    justifyContent: 'center',
    height: 34,
    paddingHorizontal: metrics.spacing,
  },
});

export const Wrapper = styled(SkewableView)`
  flex: 1;
  margin-right: ${metrics.spacing * -0.25}px;
`;

export const TextInput = styled.TextInput`
  height: 100%;
  padding: 0;
  margin: 0;
  color: ${colors.white};
  font-family: ${metrics.fontFamily.ptSansItalic};
`;
