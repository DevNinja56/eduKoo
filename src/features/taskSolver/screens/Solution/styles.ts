import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { SubText } from '../../../../components';
import { colors, metrics } from '../../../../styles';
import { PaidFeature } from '../../../monetization';
import { BaseText, BaseWrapper } from '../styles';

interface CommonTextProps {
  isBold?: boolean;
}

interface SolutionStepProps {
  isLast: boolean;
}

interface FractionItemProps {
  fractionPosition: 'top' | 'bottom';
}

export const Wrapper = styled.ScrollView`
  padding: ${metrics.spacing}px;
`;

export const SolutionStep = styled(BaseWrapper)<SolutionStepProps>`
  padding: ${metrics.spacing * 1.5}px ${metrics.spacing}px;
  margin-top: 0px;
  margin-bottom: 0px;
  border-bottom-width: ${({ isLast }) => (isLast ? '0px' : '1px')};
  border-color: ${colors.purple6};
`;

export const SolutionText = styled(SubText)<CommonTextProps>`
  font-family: ${({ isBold }) =>
    isBold ? metrics.fontFamily.ptSansBold : metrics.fontFamily.ptSans};
  font-size: ${({ isBold }) =>
    isBold
      ? `${metrics.fontSize.regular}px`
      : `${metrics.fontSize.regular * 0.9}px`};
  color: ${colors.pink1};
`;

export const ShowMoreText = styled(BaseText)`
  padding: ${metrics.spacing * 0.3}px ${metrics.spacing * 0.5}px;
  font-family: ${metrics.fontFamily.univiaProItalic};
  color: ${colors.white};
`;

export const ReactionTableWrapper = styled.View`
  background-color: ${colors.purple4A};
  margin: 0px ${metrics.spacing}px;
  padding: ${metrics.spacing * 1.5}px ${metrics.spacing * 1.2}px;
  border-bottom-width: 1px;
  border-color: ${colors.purple6};
`;

export const ReactionTable = styled.ScrollView`
  flex-direction: row;
`;

export const ReactionColumn = styled.View``;

export const ReactionText = styled(BaseText)`
  margin-right: ${metrics.spacing * 0.5}px;
  font-family: ${metrics.fontFamily.ptSans};
`;

export const Fraction = styled.View`
  display: flex;
  align-items: center;
`;

export const FractionItem = styled.View<FractionItemProps>`
  width: 100%;
  align-items: center;
  border-bottom-width: ${({ fractionPosition }) =>
    fractionPosition === 'top' ? '1px' : '0px'};
  border-color: ${colors.pink1};
  padding: 0px ${metrics.spacing * 0.5}px;
`;

export const ShortAnswer = styled(BaseWrapper)`
  align-items: flex-start;
  padding: ${metrics.spacing * 1.5}px ${metrics.spacing * 1.2}px;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${metrics.spacing * 2.5}px;
`;

export const StrongText = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.regular * 0.9}px;
  color: ${colors.pink1};
  font-weight: 900;
`;

export const ShortAnswerTextWrapper = styled.View`
  margin-bottom: ${metrics.spacing * 0.3}px;
`;

export const ShortAnswerText = styled(SubText)`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.regular * 0.9}px;
  color: ${colors.pink1};
`;

export const Measure = styled(BaseWrapper)`
  margin-bottom: 0px;
  border-bottom-width: 1px;
  border-color: ${colors.purple6};
`;

export const Error = styled(BaseWrapper)`
  margin-top: 0px;
  margin-bottom: ${metrics.spacing}px;
  border-bottom-width: 1px;
  border-color: ${colors.purple6};
`;

export const ErrorSection = styled.View`
  flex-direction: row;
  margin-bottom: ${metrics.spacing}px;
`;

export const ErrorDescriptionText = styled(SubText)`
  font-family: ${metrics.fontFamily.ptSansBold};
  font-size: ${metrics.fontSize.regular}px;
  color: ${colors.pink1};
`;

export const WarningIcon = styled.Image`
  width: 16px;
  height: 14px;
  margin-right: ${metrics.spacing * 0.5}px;
`;

export const PaidFeatureStyled = styled(PaidFeature)`
  margin: 0 ${metrics.spacing}px;
`;

export const styles = StyleSheet.create({
  solutionStetSkewable: {
    alignSelf: 'flex-start',
    marginVertical: metrics.spacing * 0.5,
  },
  solutionStetSkewablContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing * 0.8,
    paddingVertical: metrics.spacing * 0.5,
  },
  showMoreSkewable: {
    alignSelf: 'flex-start',
  },
});
