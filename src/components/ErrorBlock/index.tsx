import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { colors } from '../../styles';
import { Wrapper, ContentWrapper, Text } from './styles';

interface Props extends TouchableOpacityProps {
  style?: any;
}

const ErrorBlock: React.FC<Props> = props => {
  const { children, style } = props;

  return (
    <Wrapper style={style} colors={[colors.peach, colors.peach]}>
      <ContentWrapper colors={[colors.purple3, colors.purple3]}>
        <Text>{children}</Text>
      </ContentWrapper>
    </Wrapper>
  );
};

export default ErrorBlock;
