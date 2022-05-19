import styled from 'styled-components/native';

import { colors, metrics } from '../../../styles';

export const UserIDWrapper = styled.Text`
  text-align: center;
  font-family: PT Sans;
  font-size: ${metrics.fontSize.medium}px;
  margin-top: ${metrics.spacing * 0.75}px;
  margin-bottom: ${metrics.spacing}px;
  color: ${colors.pink};
`;

export const UserID = styled(UserIDWrapper)`
  font-weight: bold;
`;
