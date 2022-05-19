import styled from 'styled-components/native';

import { colors, metrics } from '../../../styles';

export const TitleText = styled.Text`
  color: ${colors.white};
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.regular}px;
`;

export const BaseText = styled.Text`
  font-size: ${metrics.fontSize.regular * 0.9}px;
  font-family: ${metrics.fontFamily.ptSans};
  color: ${colors.pink1};
`;

export const BaseWrapper = styled.View`
  margin: ${metrics.spacing}px;
  padding: ${metrics.spacing * 1.2}px;
  background-color: ${colors.purple4A};
`;

export const HintText = styled(BaseText)`
  padding-right: ${metrics.spacing}px;
  margin-bottom: ${metrics.spacing * 0.4}px;
`;

export const HintTextDecorate = styled(HintText)`
  text-align: right;
`;
