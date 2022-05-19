import styled from 'styled-components/native';

import { colors, metrics } from '../../../styles';
import { SubText, Text } from '../../../components';

export const Wrapper = styled.View``;

export const EquationWrapper = styled.View`
  align-items: center;
  width: 100%;
  padding: ${metrics.spacing * 3}px ${metrics.spacing}px;
  background-color: ${colors.purple5A};
`;

export const EquationText = styled(SubText)`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.large * 1.1}px;
  color: ${colors.white};
  text-align: center;
`;

export const BalanceWrapper = styled.View`
  width: 100%;
  padding: ${metrics.spacing * 1.5}px;
  margin-top: ${metrics.spacing * 1.5}px;
  background-color: ${colors.purple4A};
`;

export const BalanceTitle = styled(Text)`
  margin-bottom: ${metrics.spacing * 1.5}px;
`;

export const BalanceText = styled(SubText)`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.medium * 1.1}px;
  color: ${colors.pink1};
  margin-bottom: ${metrics.spacing * 0.3}px;
`;

export const BalanceTableWrapper = styled.ScrollView`
  flex-direction: row;
  margin-top: ${metrics.spacing}px;
`;

export const BalanceColumn = styled.View<{
  isMiddle?: boolean;
  isFirst?: boolean;
}>`
  justify-content: ${({ isMiddle }) => (isMiddle ? 'center' : 'space-between')};
  padding: ${metrics.spacing * 0.75}px ${metrics.spacing * 0.4}px;
  height: 90px;
  border-color: ${colors.blue3};
  border-right-width: 1px;
  border-left-width: ${({ isFirst }) => (isFirst ? 1 : 0)}px;
`;

export const BalanceNumText = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.regular}px;
  color: ${colors.pink1};
`;

export const BalanceInfoWrapper = styled.View`
  flex-direction: column;
  justify-content: space-between;
  margin-left: ${metrics.spacing * 0.7}px;
`;

export const BalanceInfo = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.regular}px;
  color: ${colors.pink1};
`;
