import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

import { colors, metrics } from '../../../../styles';

export const styles = StyleSheet.create({
  text: {
    fontFamily: metrics.fontFamily.ptSansItalic,
    fontSize: metrics.fontSize.regular * 1.2,
    color: colors.pink1,
    letterSpacing: 1,
  },
});

export const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Fraction = styled.View`
  flex-direction: column;
`;

export const FractionElement = styled.View`
  flex-direction: row;
  justify-content: center;
`;

export const Bottom = styled.View`
  padding: 0 ${metrics.spacing * 0.5}px;
  border-top-color: ${colors.pink1};
  border-top-width: 1px;
`;
