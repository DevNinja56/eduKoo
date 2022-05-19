import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

import { MainContainer } from '../../../../components';
import { colors, metrics } from '../../../../styles';
import { Button as UnstyledButton } from '../../../../components';

export const Wrapper = styled(MainContainer)`
  padding: ${metrics.spacing}px;
`;

export const Button = styled(UnstyledButton)`
  width: 100%;
  margin-top: ${metrics.spacing * 0.5}px;
`;

export const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontFamily: metrics.fontFamily.ptSansItalic,
    fontSize: metrics.fontSize.regular * 0.9,
    color: colors.pink1,
  },
  icon: {
    width: 10,
    height: 10,
    transform: [{ rotateZ: '-90deg' }],
    opacity: 0.6,
  },
});
