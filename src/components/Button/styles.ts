import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

import { colors, metrics } from '../../styles';
import UnstyledText from '../Text';

export const styles = StyleSheet.create({
  skewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    paddingHorizontal: metrics.spacing,
  },
  disabled: {
    opacity: 0.6,
  },
});

interface TouchableProps {
  active?: boolean | null | undefined;
}

export const Touchable = styled.TouchableOpacity<TouchableProps>`
  align-self: flex-start;
  color: ${colors.white};
  font-size: ${metrics.fontSize.regular}px;
  font-family: ${metrics.fontFamily.univiaProItalic};

  ${({ active }) => (!active ? 'opacity: 0.6;' : '')}
`;

export const Text = styled(UnstyledText)`
  line-height: ${metrics.fontSize.regular}px;
`;
