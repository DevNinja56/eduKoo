import { StyleSheet, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { colors, metrics } from '../../../../styles';

export const Container = styled.View`
  display: flex;
  width: ${Dimensions.get('screen').width}px;
  align-items: center;
`;

export const Img = styled.ImageBackground`
  width: ${Dimensions.get('window').width * 0.85}px;
  height: ${Dimensions.get('window').width * 0.55}px;

  justify-content: flex-end;
  padding: 0 0 30px 40px;
`;

export const ImgLable = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.large}px;
  color: ${colors.white};
`;

export const styles = StyleSheet.create({
  carousel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
