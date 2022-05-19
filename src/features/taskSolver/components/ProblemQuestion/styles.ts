import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { colors, metrics } from '../../../../styles';

export const Wrapper = styled.View`
  padding: ${metrics.spacing}px;
  background-color: ${colors.purple4A};
`;

export const Question = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.regular};
  color: ${colors.white};
  margin-bottom: ${metrics.spacing}px;
`;

export const Description = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  line-height: ${metrics.fontSize.regular * 1.2}px;
  font-size: ${metrics.fontSize.regular * 0.9};
  color: ${colors.pink1};
  margin-bottom: ${metrics.spacing}px;
`;

export const Answer = styled.View`
  flex-direction: row;
`;

export const Example = styled.View`
  flex-direction: row;
  align-self: baseline;
  margin-bottom: ${metrics.spacing * 1.5}px;
`;

export const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  buttonMargin: {
    marginRight: -metrics.spacing * 0.5,
  },
});
