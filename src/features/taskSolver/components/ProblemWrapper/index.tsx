import React from 'react';

import {
  Wrapper,
  Background,
  ContentWrapper,
  HelpText,
  Title,
  VerticalLine,
  HorizontalLine,
  TopSection,
  Subtitle,
  SubtitleWrapper,
} from './styles';

interface ProblemWrapperProps {
  title: string;
  subtitle?: string;
  helpText: string;
  titlePosition?: 'underLine' | 'aboveLine';
}

const ProblemWrapper: React.FC<ProblemWrapperProps> = props => {
  const {
    title,
    subtitle = '',
    helpText,
    titlePosition = 'aboveLine',
    children,
  } = props;

  return (
    <Wrapper>
      <HelpText>{helpText}</HelpText>
      <HorizontalLine />
      <Background>
        <VerticalLine />
        <ContentWrapper>
          <TopSection>
            {titlePosition === 'aboveLine' ? (
              <Title>{title}</Title>
            ) : (
              <SubtitleWrapper>
                <Subtitle text={subtitle} />
              </SubtitleWrapper>
            )}
          </TopSection>
          {titlePosition === 'underLine' && <Title>{title}</Title>}
          {children}
        </ContentWrapper>
      </Background>
    </Wrapper>
  );
};

export default ProblemWrapper;
