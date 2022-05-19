import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import flow from 'lodash/flow';

import {
  formatNmb,
  replaceOne,
  reverse,
  sub,
} from '../../../helpers/format-helpers';
import { alignment, NOD } from '../../../helpers/root.service';
import { ReactionsTemplate } from '../../../components';
import { metrics } from '../../../styles';
import { EXAMPLES, DEFAULT_EXAMPLE } from '../constants';
import { PaidFeature } from '../../monetization';
import { ELECTRONIC_BALANCE } from '../../monetization/constants';
import {
  Wrapper,
  EquationWrapper,
  EquationText,
  BalanceWrapper,
  BalanceTitle,
  BalanceText,
  BalanceTableWrapper,
  BalanceColumn,
  BalanceNumText,
  BalanceInfoWrapper,
  BalanceInfo,
} from './styles';

interface ResultInfo {
  subsL: string[];
  subsR: string[];
  coefs: number[];
  balance: {
    el: string;
    powerL: number;
    powerR: number;
    cl: number;
    cr: number;
    razn: number;
    process?: string[];
  }[];
  error?: string;
}

const Reactions = () => {
  const { t } = useTranslation();
  const [result, setResult] = useState<ResultInfo | undefined>();
  const [error, setError] = useState('');

  const arrangeCoefs = (searchValue: string) => {
    const data = alignment(searchValue);

    if (data.errors) {
      setError(data.errors.join(' '));
      setResult(undefined);
    } else {
      setResult(data as ResultInfo);
    }
  };

  const renderResult = () => {
    if (!result) {
      return null;
    }

    const { subsL, subsR, coefs, balance } = result;
    const razn0 = balance[0] ? balance[0].razn : 0;
    const razn1 = balance[1] ? balance[1].razn : 0;

    const formattedSubsL = subsL.map((it, index) => {
      const coef = coefs[index];

      return `${coef === 1 ? '' : coef}${sub(it)}`;
    });
    const formattedSubsR = subsR.map((it, index) => {
      const coef = coefs[subsL.length + index];

      return `${coef === 1 ? '' : coef}${sub(it)}`;
    });

    return (
      <Wrapper>
        <EquationWrapper>
          <EquationText
            subSize={metrics.fontSize.regular}
            text={`${formattedSubsL.join('+')} = ${formattedSubsR.join('+')}`}
          />
        </EquationWrapper>
        {balance.length === 2 && (
          <PaidFeature featureKey={ELECTRONIC_BALANCE}>
            <BalanceWrapper>
              <BalanceTitle>{t('coefArrangement.balanceTitle')}</BalanceTitle>
              {formattedSubsL.map((it, index) => {
                const { cr, cl, powerR, powerL, razn, el } = balance[index];
                const coef = replaceOne(cr.toString());
                const clFrmtd = replaceOne(cl.toString());
                const crFrmtd = replaceOne(cr.toString());
                const powerLFrmtd = flow([formatNmb, reverse])(powerL);
                const powerRFrmtd = flow([formatNmb, reverse])(powerR);
                const raznFrmtd = razn < 0 ? ` - ${-razn}` : ` + ${razn}`;
                const resultText =
                  `${coef}${el}<sub>${clFrmtd}</sub><sup>${powerLFrmtd}</sup>${raznFrmtd}e = ` +
                  `${clFrmtd}${el}<sub>${crFrmtd}</sub><sup>${powerRFrmtd}</sup>`;

                return <BalanceText text={resultText} key={resultText} />;
              })}
              <BalanceTableWrapper
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <BalanceColumn isFirst>
                  <BalanceNumText>{Math.abs(razn0)}</BalanceNumText>
                  <BalanceNumText>{Math.abs(razn1)}</BalanceNumText>
                </BalanceColumn>
                <BalanceColumn isMiddle>
                  <BalanceNumText>
                    {Math.abs((razn1 * razn0) / NOD(razn1, razn0))}
                  </BalanceNumText>
                </BalanceColumn>
                <BalanceColumn>
                  <BalanceNumText>
                    {Math.abs((razn1 * razn0) / NOD(razn1, razn0)) /
                      Math.abs(razn0)}
                  </BalanceNumText>
                  <BalanceNumText>
                    {Math.abs((razn1 * razn0) / NOD(razn1, razn0)) /
                      Math.abs(razn1)}
                  </BalanceNumText>
                </BalanceColumn>
                <BalanceInfoWrapper>
                  <BalanceInfo>
                    {balance[0].razn > 0 &&
                      t('coefArrangement.oxidisingProcess')}
                    {balance[0].razn < 0 &&
                      t('coefArrangement.deoxidantProcess')}
                  </BalanceInfo>
                  <BalanceInfo>
                    {balance[1].razn > 0 &&
                      t('coefArrangement.oxidisingProcess')}
                    {balance[1].razn < 0 &&
                      t('coefArrangement.deoxidantProcess')}
                  </BalanceInfo>
                </BalanceInfoWrapper>
              </BalanceTableWrapper>
            </BalanceWrapper>
          </PaidFeature>
        )}
      </Wrapper>
    );
  };

  return (
    <ReactionsTemplate
      defaultExample={DEFAULT_EXAMPLE}
      examples={EXAMPLES}
      renderResults={renderResult}
      contentStyle={{
        paddingVertical: metrics.spacing * 1.5,
        paddingHorizontal: metrics.spacing * 1.25,
      }}
      onFind={arrangeCoefs}
      error={error}
      showExamples={!result}
      searchText={t('coefArrangement.button')}
    />
  );
};

export default Reactions;
