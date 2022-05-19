import { StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';
import { colors, metrics } from '../../../../styles';

export const CrystalContainer = styled.View`
  flex-direction: column;
`;

export const CrystalIcon = styled.ImageBackground`
  position: relative;
  top: 6px;
  left: 2px;
  width: 32px;
  height: 32px;
  align-self: center;
`;

export const CrystalText = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.regular * 0.7}px;
  color: ${colors.black};
  align-self: center;
`;

export const CrystalTextWhite = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.regular * 0.7}px;
  color: ${colors.white};
  align-self: center;
`;

export const CrystalSkewableContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const styles = StyleSheet.create({
  crystalSkewable: {
    padding: 0,
    margin: 0,
    width: '100%',
    marginRight: -3,
  },
});
