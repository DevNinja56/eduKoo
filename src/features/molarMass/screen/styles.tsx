import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

import {
  MainContainer,
  Button,
  Input,
  Text,
  Picker,
} from '../../../components';
import { colors, metrics } from '../../../styles';

export const styles = StyleSheet.create({
  pickerItem: {
    color: colors.white,
    fontFamily: metrics.fontFamily.univiaProItalic,
  },
});

export const Wrapper = styled(MainContainer)`
  padding: ${metrics.spacing * 1.25}px;
`;

export const FormulaSearchTitle = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.regular * 0.9}px;
  line-height: ${metrics.fontSize.regular * 0.9}px;
  margin-top: ${metrics.spacing}px;
  color: ${colors.pink1};
`;

export const FormulaSearchInput = styled(Input)`
  flex: auto;
  margin-top: ${metrics.spacing * 0.75}px;
  margin-bottom: ${metrics.spacing}px;
`;

export const FormulaSearchButton = styled(Button)`
  width: 100%;
`;

export const ResultWrapper = styled.View`
  align-items: center;
  margin-top: ${metrics.spacing * 1.25}px;
  border-top-width: 1px;
  border-top-color: #5c32a2;
`;

export const MassTextWrapper = styled(Text)`
  font-size: ${metrics.fontSize.xLarge * 0.6}px;
  margin-top: ${metrics.spacing * 2}px;
  margin-bottom: ${metrics.spacing}px;
`;

export const MeasurePicker = styled(Picker)`
  width: 100%;
`;
