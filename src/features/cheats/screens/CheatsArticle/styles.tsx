import styled from 'styled-components/native';

import { colors, metrics } from '../../../../styles';
import { Text } from '../../../../components';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  base: {
    color: colors.pink,
    fontFamily: metrics.fontFamily.ptSans,
    marginBottom: metrics.spacing * 5,
  },
  p: {
    marginVertical: metrics.spacing * 0.5,
  },
  b: {
    fontWeight: 'bold',
  },
  img: {
    alignSelf: 'center',
    maxWidth: '100%',
    resizeMode: 'contain',
  },
});

export const Wrapper = styled.ScrollView`
  padding: ${metrics.spacing}px;
`;

export const Header = styled(Text)`
  margin: ${metrics.spacing * 2}px 0;
  font-size: ${metrics.fontSize.large}px;
  color: ${colors.blue3};
  line-height: ${metrics.fontSize.large * 1.25}px;
`;
