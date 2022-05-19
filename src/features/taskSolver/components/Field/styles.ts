import styled from 'styled-components/native';

import { SubText } from '../../../../components';
import { colors, metrics } from '../../../../styles';

export const Wrapper = styled.View`
  flex-direction: row;
`;

export const FieldText = styled(SubText)`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.regular * 0.9}px;
  color: ${colors.pink1};
`;

export const DeleteIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: ${metrics.spacing}px;
`;
