import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { colors, metrics } from '../../../../styles';

export const Container = styled.TouchableOpacity`
  width: 80px;
  height: 100%;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
`;

export const CrystalIcon = styled.ImageBackground`
  top: 6px;
  width: 30px;
  height: 30px;
  align-self: center;
`;

export const BiohazardIcon = styled.ImageBackground`
  width: 25px;
  height: 25px;
  align-self: center;
`;

export const Text = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.regular * 0.7}px;
  color: ${colors.black};
  align-self: center;
`;

export const SkewableContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const styles = StyleSheet.create({
  skewableFirst: {
    padding: 0,
    margin: 0,
    width: '60%',
    marginRight: -3,
  },
  skewableSecond: {
    padding: 0,
    margin: 0,
    width: '40%',
  },
  skewableOne: {
    paddingLeft: 5,
    paddingRight: 5,
    margin: 0,
  },
});
