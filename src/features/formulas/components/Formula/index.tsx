import React from 'react';

import { SubText } from '../../../../components';
import { Bottom, Fraction, FractionElement, styles, Wrapper } from './styles';

interface Props {
  symbol: string | object;
  top: any[];
  bottom?: any[];
}

const Formula: React.FC<Props> = props => {
  const { symbol, top, bottom } = props;

  const renderFractionElement = (element: any[]) => {
    const elements = element.map((it, index, array) => {
      const isLast = index === array.length - 1;

      return (
        <SubText
          style={styles.text}
          key={index}
          text={isLast ? it : `${it} × `}
        />
      );
    });

    return <FractionElement>{elements}</FractionElement>;
  };

  return (
    <Wrapper>
      <SubText style={styles.text} text={`${symbol} = `} />
      <Fraction>
        {renderFractionElement(top)}
        {bottom && <Bottom>{renderFractionElement(bottom)}</Bottom>}
      </Fraction>
    </Wrapper>
  );
};

export default Formula;
