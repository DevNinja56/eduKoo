import styled from 'styled-components/native';

import { ErrorBlock } from '../../../../components';
import { colors, metrics } from '../../../../styles';
import { BaseText, TitleText } from '../styles';

export const Title = styled(TitleText)`
  margin-bottom: ${metrics.spacing}px;
`;

export const Text = styled(BaseText)``;

export const IncorrectSubstance = styled(BaseText)`
  color: ${colors.red1};
`;

export const CorrectSubstance = styled(BaseText)`
  color: ${colors.green};
`;

export const SubstanceWrapper = styled.View`
  flex-direction: row;
  margin-top: ${metrics.spacing}px;
`;

export const SubstanceEnterError = styled(ErrorBlock)`
  margin: ${metrics.spacing}px;
`;
