import styled from 'styled-components/native';

import { SubText } from '../../../../components';
import { colors, metrics } from '../../../../styles';

export const Wrapper = styled.View`
  margin: ${metrics.spacing * 1.5}px;
`;

export const Background = styled.View`
  background-color: ${colors.purple4A};
`;

export const HelpText = styled.Text`
  font-size: ${metrics.fontSize.regular * 0.9}px;
  font-family: ${metrics.fontFamily.ptSans};
  color: ${colors.pink1};
  margin-bottom: ${metrics.spacing * 1.5}px;
`;

export const Title = styled.Text`
  font-size: ${metrics.fontSize.large * 1.2}px;
  font-family: ${metrics.fontFamily.univiaProItalic};
  color: ${colors.pink1};
  text-align: center;
  margin-bottom: ${metrics.spacing * 2}px;
`;

export const SubtitleWrapper = styled.View`
  margin-bottom: ${metrics.spacing}px;
  margin-left: ${metrics.spacing}px;
  padding-top: ${metrics.spacing}px;
`;

export const Subtitle = styled(SubText)`
  font-size: ${metrics.fontSize.regular * 0.9}px;
  font-family: ${metrics.fontFamily.ptSans};
  color: ${colors.pink1};
`;

export const VerticalLine = styled.View`
  position: absolute;
  height: 100%;
  width: 1px;
  background-color: ${colors.purple3A};
  right: 15%;
  z-index: 99;
`;

export const HorizontalLine = styled.View`
  position: absolute;
  width: 90%;
  height: 1px;
  background-color: ${colors.purple3A};
  top: ${metrics.fontSize.large * 1.2 + 60}px;
  right: 5%;
  z-index: 99;
`;

export const BorderWrapper = styled.View`
  margin-right: 18%;
  border-right-width: 1px;
`;

export const ContentWrapper = styled.View`
  padding: ${metrics.spacing * 1.5}px;
  padding-top: ${metrics.spacing * 0.5}px;
  margin-right: 15%;
`;

export const TopSection = styled.View`
  margin-bottom: ${metrics.spacing}px;
`;
