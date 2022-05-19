import styled from 'styled-components/native';

import { colors, metrics } from '../../../styles';
import { Text } from '../../../components';

interface Props {
  isHidden?: boolean;
}

export const ElementTouchable = styled.TouchableOpacity<{
  withBorder?: boolean;
}>`
  flex: 1;
  padding: ${metrics.spacing * 0.6}px ${metrics.spacing * 0.35}px;
  border: ${({ withBorder }) => (withBorder ? '1px solid #411c8477' : 'none')};
`;

export const ElementTitle = styled(Text)<Props>`
  color: ${({ isHidden }) => (isHidden ? colors.pink : colors.darkBlue)};
  font-size: ${metrics.fontSize.regular * 1.1}px;
  line-height: ${metrics.fontSize.regular * 1.1}px;
  margin-bottom: ${metrics.spacing * 0.25}px;
`;

export const ElementHiddenTitle = styled.Text`
  color: ${colors.pink};
  font-size: ${metrics.fontSize.regular * 1.1}px;
  line-height: ${metrics.fontSize.regular * 1.1}px;
  font-family: ${metrics.fontFamily.ptSans};
`;

export const ElementNumber = styled.Text<Props>`
  position: absolute;
  color: ${({ isHidden }) => (isHidden ? colors.pink : colors.darkBlue)};
  top: ${metrics.spacing * 0.5}px;
  right: ${metrics.spacing * 0.5}px;
  font-size: ${metrics.fontSize.medium}px;
  line-height: ${metrics.fontSize.medium}px;
  font-family: ${metrics.fontFamily.ptSans};
`;

export const ElementInfo = styled.Text<Props>`
  color: ${({ isHidden }) => (isHidden ? colors.pink : colors.darkBlue)};
  font-size: ${metrics.fontSize.small}px;
  font-family: ${metrics.fontFamily.ptSans};
`;

export const HiddenElementsWrapper = styled.View<{ isLanthan?: boolean }>`
  position: absolute;
  flex-direction: row;
  width: 80%;
  height: 100px;
  left: ${metrics.spacing * 7}px;
  bottom: ${({ isLanthan }) =>
    isLanthan ? metrics.spacing * 10 : metrics.spacing * 2.5}px;
`;

export const CloseHiddenTouchable = styled.TouchableOpacity`
  z-index: 99;
  position: absolute;
  top: ${metrics.spacing * -3}px;
`;

export const CloseHidden = styled.Image`
  width: 36px;
  height: 36px;
`;
