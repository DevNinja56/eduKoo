import styled from 'styled-components/native';

import { ColorElement, Text } from '../../../../components';
import { colors, metrics } from '../../../../styles';

interface Props {
  isWhite?: boolean;
}

export const Backdrop = styled.View`
  flex: 1;
  position: relative;
  background-color: rgba(13, 0, 43, 0.55);
`;

export const Content = styled.View`
  flex: 1;
  position: absolute;
  height: ${metrics.height * 0.75}px;
  bottom: ${metrics.spacing * 4}px;
  left: ${metrics.spacing * 3}px;
  right: ${metrics.spacing * 3}px;
`;

export const Header = styled(ColorElement)`
  position: relative;
  max-height: 115px;
  justify-content: center;
  padding: ${metrics.spacing}px;
`;

export const HeaderNumber = styled(Text)<Props>`
  position: absolute;
  color: ${({ isWhite }) => (isWhite ? colors.white : colors.blue1)};
  top: ${metrics.spacing}px;
  right: ${metrics.spacing}px;
  font-size: ${metrics.fontSize.large * 1.3}px;
  line-height: ${metrics.fontSize.large * 1.3}px;
`;

export const HeaderTitle = styled(Text)<Props>`
  color: ${({ isWhite }) => (isWhite ? colors.white : colors.blue1)};
  font-size: ${metrics.fontSize.xLarge}px;
  line-height: ${metrics.fontSize.xLarge}px;
  margin-bottom: ${metrics.spacing * 0.25}px;
`;

export const HeaderElementName = styled(Text)<Props>`
  color: ${({ isWhite }) => (isWhite ? colors.white : colors.blue1)};
  font-size: ${metrics.fontSize.large}px;
  line-height: ${metrics.fontSize.large}px;
`;

export const InfoWrapper = styled.ScrollView`
  flex: 1;
  background-color: rgba(43, 15, 99, 0.9);
`;

export const CloseIconTouchable = styled.TouchableOpacity`
  z-index: 99;
  position: absolute;
  top: ${metrics.spacing * -3}px;
  right: ${metrics.spacing * -2.5}px;
`;

export const CloseIcon = styled.Image`
  width: 36px;
  height: 36px;
`;
