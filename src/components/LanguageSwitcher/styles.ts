import styled from 'styled-components/native';

import { colors, metrics } from '../../styles';
import Text from '../Text';

export const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: ${metrics.spacing}px;
`;

export const LanguageText = styled(Text)<{ selected?: boolean }>`
  color: ${({ selected }) => (selected ? colors.white : colors.pink)};
  padding-top: 1px;
`;
