import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { Input, SubText } from '../../../../components';
import { colors, metrics } from '../../../../styles';

export const Wrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

export const DeleteIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: ${metrics.spacing}px;
`;

export const SymbolText = styled(SubText)`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.regular * 0.9}px;
  color: ${colors.pink1};
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
  picker: {
    marginRight: metrics.spacing,
  },
});

export const VariableInput = styled(Input)`
  flex: none;
  width: 80;
  height: 30;
  margin: 0 ${metrics.spacing * 0.5}px;
`;
