import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { ErrorBlock } from '../../../../components';
import { metrics } from '../../../../styles';

export const HintTextWrapper = styled.View`
  margin-top: ${metrics.spacing}px;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const ErrorBlockStyled = styled(ErrorBlock)`
  margin-bottom: ${metrics.spacing}px;
`;

export const styles = StyleSheet.create({
  textBold: {
    fontWeight: '900',
  },
});
