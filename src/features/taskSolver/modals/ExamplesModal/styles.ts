import styled from 'styled-components/native';

import { colors, metrics } from '../../../../styles';

interface ExampleProps {
  isLast: boolean;
}

export const Wrapper = styled.View`
  margin-top: 50px;
  margin-left: ${metrics.spacing * 0.5}px;
  margin-right: ${metrics.spacing * 0.5}px;
  background-color: rgba(43, 15, 99, 0.9);
`;

export const Header = styled.View`
  padding: ${metrics.spacing}px;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-color: ${colors.purple6};
`;

export const Body = styled.View`
  padding: ${metrics.spacing}px;
`;

export const Footer = styled.View`
  padding: ${metrics.spacing}px;
  flex-direction: row;
  justify-content: flex-end;
  border-top-width: 1px;
  border-color: ${colors.purple6};
`;

export const Example = styled.View<ExampleProps>`
  border-bottom-width: ${({ isLast }) => (isLast ? '0px' : '1px')};
  border-color: ${colors.purple6};
  margin-bottom: ${metrics.spacing}px;
  padding-bottom: ${({ isLast }) =>
    isLast ? '0px' : `${metrics.spacing}px`}; ;
`;

export const CloseIcon = styled.Image`
  width: 14px;
  height: 14px;
`;

export const Title = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  font-size: ${metrics.fontSize.large * 0.9};
  color: ${colors.white};
`;

export const Condition = styled.Text`
  font-family: ${metrics.fontFamily.univiaProItalic};
  line-height: ${metrics.fontSize.regular * 1.2}px;
  font-size: ${metrics.fontSize.regular * 0.9};
  color: ${colors.pink};
  margin-bottom: ${metrics.spacing}px;
`;

export const ReactionWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${metrics.spacing}px;
`;

export const ReactionText = styled.Text`
  font-family: ${metrics.fontFamily.ptSans};
  font-size: ${metrics.fontSize.regular * 0.9};
  color: ${colors.pink};
`;
