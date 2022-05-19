import React from 'react';

import { SubText } from '../../../../components';
import { colors, metrics } from '../../../../styles';
import { Wrapper, Title } from './styles';

interface Props {
  title: string;
  info?: string;
}

const InfoBlock: React.FC<Props> = props => {
  const { children, title, info } = props;

  if (!info) {
    return null;
  }

  return (
    <Wrapper>
      <Title>{title}</Title>
      <SubText
        text={info}
        style={{
          fontFamily: metrics.fontFamily.ptSans,
          fontSize: metrics.fontSize.regular * 0.9,
          lineHeight: metrics.fontSize.regular * 1.3,
          color: colors.pink1,
        }}
      />
      {children}
    </Wrapper>
  );
};

export default InfoBlock;
