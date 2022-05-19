import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { colors, metrics } from '../../../../styles';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProVersionModal = styled.Modal``;

export const ModalContainer = styled(SafeAreaView)`
  height: 100%;
  padding: 10px;
  background-color: ${colors.purple1A};
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const TitleText = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.large}px;
  color: white;
`;

export const CloseIcon = styled.ImageBackground`
  height: 16px;
  width: 16px;
`;

export const Separator = styled.View`
  width: 110%;
  left: -5%;
  margin-top: 15px;
  border: 0.75px;
  border-color: ${colors.productItemPurple};
`;

export const CarouselContainer = styled.View`
  padding-top: 20px;
  width: 100%;
`;

export const TextContainer = styled.View`
  top: -10px;
`;

export const LargeText = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.medium * 1.3}px;
  line-height: ${metrics.fontSize.medium * 2}px;
  color: white;
  align-self: center;
`;

export const SmallText = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.medium * 1.3}px;
  color: ${colors.proDescription};
  align-self: center;
  margin-bottom: 10px;
`;

export const SkewableText = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.large * 1.3}px;
  color: #26155a;
  align-self: center;
`;

export const ProDescriptionContainer = styled.View``;

export const ProDescriptionText = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.small * 0.9}px;
  text-align: center;
  color: ${colors.proDescription};
`;

export const ProDescriptionLinks = styled.View`
  flex-direction: row;
  justify-content: center;
`;

export const styles = StyleSheet.create({
  skewableView: {
    padding: 10,
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 10,
  },
  linkText: {
    fontFamily: metrics.fontFamily.ptSans,
    fontSize: metrics.fontSize.small,
    textAlign: 'center',
    color: colors.refillGemsLink,
  },
});
