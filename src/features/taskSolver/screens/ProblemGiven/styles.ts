import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { Button } from '../../../../components';

import { colors, metrics } from '../../../../styles';

export const NextButton = styled(Button)`
  width: 100%;
  margin-top: 80px;
`;

export const DeleteIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: ${metrics.spacing}px;
`;

export const Section = styled.View`
  margin-left: ${metrics.spacing}px;
  margin-bottom: ${metrics.spacing * 0.5}px;
`;

export const styles = StyleSheet.create({
  pickerText: {
    fontFamily: metrics.fontFamily.ptSans,
    fontSize: metrics.fontSize.regular * 0.9,
    lineHeight: metrics.fontSize.regular,
  },
  pickerSkewContainer: {
    height: 20,
  },
  subText: {
    color: colors.peach,
  },
});
