import React from 'react';
import { TextProps } from 'react-native';

import { Wrapper } from './styles';

interface Props extends TextProps {
  style?: any;
}

const Text: React.FC<Props> = props => {
  const { children, style } = props;

  return <Wrapper style={style}>{children}</Wrapper>;
};

export default Text;
