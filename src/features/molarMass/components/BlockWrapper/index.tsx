import React from 'react';

import { BlockWrapperStyled } from './styles';

const BlockWrapper: React.FC = ({ children }) => {
  return <BlockWrapperStyled>{children}</BlockWrapperStyled>;
};

export default BlockWrapper;
