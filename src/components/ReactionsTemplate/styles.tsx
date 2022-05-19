import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

import { colors, metrics } from '../../styles';
import Text from '../Text';
import UnstyledPreloader from '../Preloader';

export const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: metrics.spacing * 2,
    paddingHorizontal: metrics.spacing,
  },
  exampleContainer: {
    paddingHorizontal: metrics.spacing * 0.5,
    paddingVertical: metrics.spacing * 0.25,
  },
});

export const SearchWrapper = styled.View`
  flex-direction: row;
  padding: ${metrics.spacing}px;
  background-color: ${colors.blue2A};
`;

export const ExamplesTitle = styled.Text`
  margin: ${metrics.spacing}px 0;
  font-family: ${metrics.fontFamily.ptSansBold};
  font-size: ${metrics.fontSize.regular * 0.9}px;
  line-height: ${metrics.fontSize.regular * 0.9}px;
  color: ${colors.pink1};
`;

export const Example = styled.TouchableOpacity`
  align-self: flex-start;
  margin-bottom: ${metrics.spacing * 0.25}px;
`;

export const ExampleText = styled(Text)`
  font-size: ${metrics.fontSize.medium * 0.9}px;
  line-height: ${metrics.fontSize.medium * 0.9}px;
  color: ${colors.pink1};
`;

export const Preloader = styled(UnstyledPreloader)`
  align-self: center;
  margin-top: ${metrics.spacing * 4}px;
`;
