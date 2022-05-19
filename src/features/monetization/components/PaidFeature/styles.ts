import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { metrics } from '../../../../styles';

export const Container = styled.View`
  display: flex;
  margin-top: 10px;
`;

export const BackgroundHeader = styled.ImageBackground``;

export const OpacityLayer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 18px 12px;
  background-color: rgba(58, 12, 134, 0.48);
`;

export const LabelMain = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  color: white;
`;

export const LabelBlocked = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  color: #ea599e;
`;

export const CrystalIcon = styled.Image`
  width: 20px;
  height: 20px;
`;

export const SubLabel = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  color: #610c2c;
`;

export const BackgroundFooter = styled.ImageBackground`
  display: flex;

  padding: 18px 12px;
`;

export const Header = styled.View`
  background-color: red;
`;

export const Footer = styled.View`
  background-color: rgb(79, 21, 151);
`;

export const ButtonViewFirst = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const ButtonViewSecond = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const styles = StyleSheet.create({
  skewableViewFirst: {
    marginTop: 5,
    padding: 5,
    width: '100%',
  },
  skewableViewSecond: {
    marginTop: 5,
    padding: 5,
  },
});
