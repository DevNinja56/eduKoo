import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { colors, metrics } from '../../../../styles';
import { GemsButtonProps } from '../../entities';

export const BuyGemsContainer = styled.ScrollView`
  height: 100%;
  padding: ${metrics.spacing * 4}px ${metrics.spacing}px;
  background-color: ${colors.purple1A};
`;

export const RefillTitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const RefillTitleText = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.large}px;
  color: white;
`;

export const BuyGemsCloseIcon = styled.Image`
  height: 16px;
  width: 16px;
`;

export const CountCrystalsContainer = styled.View`
  padding: 20px 0 15px 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const CountCrystalsText = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.xLarge * 1.3}px;
  color: white;
  margin-right: ${metrics.spacing}px;
`;

export const CrystallIcon = styled.ImageBackground`
  height: 55px;
  width: 55px;
`;

export const ProductsContainer = styled.View`
  margin: 10px 0 0px 0;
`;

export const SkewableViewContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ProductTextContainer = styled.View`
  width: 88%;
`;

export const ProductImgContainer = styled.View`
  width: 12%;
`;

export const LargeText = styled.Text<GemsButtonProps>`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.large}px;
  color: ${props => props.buttonTextColor || "white"};
  margin-bottom: ${metrics.spacing * 0.5}px;
`;

export const SmallText = styled.Text`
  font-family: ${metrics.fontFamily.ptSansItalic};
  color: whitesmoke;
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

export const Separator = styled.View`
  width: 110%;
  left: -10px;
  margin-top: 15px;
  border-width: 1px;
  border-color: ${colors.productItemPurple};
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
