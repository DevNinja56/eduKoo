import React from 'react';

import { SkewableView } from '../../../../components';
import { LabelText, Wrapper } from './styles';

interface LabelProps {
  bgColors: string[];
}

const Label: React.FC<LabelProps> = props => {
  const { bgColors, children } = props;

  return (
    <Wrapper colors={bgColors}>
      <LabelText>{children}</LabelText>
    </Wrapper>
  );
};

export default Label;
