import React from 'react';

import tips from '../../../../assets/images/icons/tips.png';
import { Wrapper, Content, Icon } from './styles';

const HintTemplate: React.FC = ({ children }) => {
  return (
    <Wrapper>
      <Icon source={tips} />
      <Content>{children}</Content>
    </Wrapper>
  );
};

export default HintTemplate;
