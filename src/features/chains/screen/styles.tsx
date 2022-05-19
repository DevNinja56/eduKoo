import styled from 'styled-components/native';
import { Platform, StyleSheet } from 'react-native';

import { colors, metrics } from '../../../styles';
import { Text } from '../../../components';

export const styles = StyleSheet.create({
  resultsSkew: {
    marginBottom: metrics.spacing * 0.5,
  },
  resultsChainSkew: {
    marginBottom: metrics.spacing,
  },
  resultContainer: {
    paddingHorizontal: metrics.spacing,
    paddingVertical: metrics.spacing * 0.75,
  },
  resultChainContainer: {
    flexDirection: 'row',
    paddingHorizontal: metrics.spacing,
    paddingVertical: metrics.spacing * 1.25,
  },
});

export const ResultText = styled(Text)`
  font-size: ${metrics.fontSize.regular}px;
  line-height: ${metrics.fontSize.regular}px;
  color: ${colors.pink1};
`;

export const ResultChainText = styled.Text`
  font-family: ${metrics.fontFamily.ptSansItalic};
  font-size: ${metrics.fontSize.regular * 1.1}px;
  color: ${colors.white};
`;

export const ArrowWrapper = styled.View`
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ArrowNumber = styled(ResultChainText)`
  position: absolute;
  left: ${metrics.spacing * 0.45}px;
  top: ${Platform.OS === 'ios' ? 0 : 1}px;
  font-size: ${metrics.fontSize.small}px;
  line-height: ${metrics.fontSize.small}px;
`;

export const ArrowText = styled(ResultChainText)`
  line-height: ${Platform.OS === 'ios'
    ? metrics.fontSize.regular * 1.5
    : metrics.fontSize.medium * 1.5}px;
`;
