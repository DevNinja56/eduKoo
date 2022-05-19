import React from 'react';
import { TextProps } from 'react-native';

import { Wrapper } from './styles';

interface Props extends TextProps {
  style?: any;
  colors: string[];
}

const ColorElement: React.FC<Props> = props => {
  const { children, style, colors } = props;

  return (
    <Wrapper style={style} colors={colors} useAngle angle={302}>
      {children}
    </Wrapper>
  );
};

export default ColorElement;
