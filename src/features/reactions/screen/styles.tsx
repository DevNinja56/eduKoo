import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

import { colors, metrics } from '../../../styles';
import { Text } from '../../../components';

export const styles = StyleSheet.create({
  resultsSkew: {
    marginBottom: metrics.spacing * 0.5,
  },
  resultContainer: {
    paddingHorizontal: metrics.spacing,
    paddingVertical: metrics.spacing * 0.75,
  },
});

export const ResultText = styled(Text)`
  font-size: ${metrics.fontSize.regular}px;
  line-height: ${metrics.fontSize.regular}px;
  color: ${colors.pink1};
`;
