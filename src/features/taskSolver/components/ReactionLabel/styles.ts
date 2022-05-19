import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { colors, metrics } from '../../../../styles';

export const ReactionText = styled.Text`
  font-size: ${metrics.fontSize.medium}px;
  font-family: ${metrics.fontFamily.ptSansItalic};
  color: ${colors.pink1};
  margin: ${metrics.spacing * 0.2}px ${metrics.spacing * 0.4}px;
`;

export const styles = StyleSheet.create({
  wrapper: { alignSelf: 'flex-start' },
});
