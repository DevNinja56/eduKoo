import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import table from '../../../../json/table.json';
import { colors } from '../../../../styles';
import BlockWrapper from '../BlockWrapper';
import { PaidFeature } from '../../../monetization';
import { MOLAR_MASS } from '../../../monetization/constants';
import {
  Title,
  Section,
  TitleWrapper,
  TextStyled,
  SubTextStyled,
  TileElementsRow,
  TileElement,
  TileElementWrapper,
  TileElementMolarMass,
} from './styles';
import { sub } from '../../../../helpers/format-helpers';

interface MolarMassInfoProps {
  mass: number;
  elements: any[];
  substance: string;
}

const MolarMassInfo: React.FC<MolarMassInfoProps> = props => {
  const { mass, substance, elements } = props;

  const isMoreThanOneElement = elements.length > 1;

  const { t } = useTranslation();

  const substanceFormatted = useMemo(() => sub(substance), [substance]);

  const equation = useMemo(() => {
    const sumOfElements = elements
      .map(
        ({ elements: elementIndex, coef }) =>
          `M(${coef > 1 ? coef : ''}${table[elementIndex].element})`,
      )
      .join(' + ');

    const sumOfMolarMass = elements
      .map(
        ({ elements: elementIndex, coef }) =>
          `${coef > 1 ? `${coef}×` : ''}${Math.round(
            table[elementIndex].atomMass,
          )}`,
      )
      .join(' + ');

    const partOfEquation = isMoreThanOneElement
      ? `${sumOfElements} = ${sumOfMolarMass} = `
      : '';

    return (
      `M(${substanceFormatted}) = ` +
      partOfEquation +
      `${mass} (${t('molarMass.infoDimension')})`
    );
  }, [elements, isMoreThanOneElement, mass, substanceFormatted, t]);

  const tileElementRender = (elementIndex: number) => {
    const { element, atomMass } = table[elementIndex];

    return (
      <TileElementWrapper key={elementIndex}>
        <TileElement>{element}</TileElement>
        <TileElementMolarMass>{atomMass}</TileElementMolarMass>
      </TileElementWrapper>
    );
  };

  return (
    <>
      <BlockWrapper>
        <PaidFeature featureKey={MOLAR_MASS}>
          <TitleWrapper>
            <Title text={t('molarMass.infoTitle', { substanceFormatted })} />
          </TitleWrapper>

          <Section>
            {isMoreThanOneElement ? (
              <SubTextStyled
                text={t('molarMass.infoPart1', { substanceFormatted })}
              />
            ) : (
              <SubTextStyled
                text={t('molarMass.infoPart1_2', { substanceFormatted })}
              />
            )}
          </Section>

          <TileElementsRow>
            {elements.map(el => tileElementRender(el.elements))}
          </TileElementsRow>

          <Section>
            <TextStyled>
              {t('molarMass.infoPart2')}
              <TextStyled
                style={{
                  backgroundColor: colors.red,
                  color: colors.white,
                }}
              >
                {t('molarMass.infoPart3')}
              </TextStyled>
              {t('molarMass.infoPart4')}
            </TextStyled>
          </Section>

          {isMoreThanOneElement && (
            <>
              <TextStyled>
                {elements.map(({ elements: elementIndex }) => {
                  const { element, atomMass } = table[elementIndex];
                  return `M(${element}) = ${Math.round(atomMass)} ${t(
                    'molarMass.infoDimension',
                  )}\n`;
                })}
              </TextStyled>
              <Section>
                <SubTextStyled
                  text={t('molarMass.infoPart5', {
                    substanceFormatted,
                    elements: elements
                      .map(({ elements: elementIndex }) => {
                        const { element } = table[elementIndex];
                        return `${element}`;
                      })
                      .join(', '),
                  })}
                />
              </Section>
              <Section>
                <SubTextStyled
                  text={t('molarMass.infoPart6', { substanceFormatted })}
                />
              </Section>
            </>
          )}

          <Section>
            <SubTextStyled text={equation} />
          </Section>
        </PaidFeature>
      </BlockWrapper>

      <BlockWrapper>
        <TitleWrapper>
          <Title text={t('molarMass.infoTitle2', { substanceFormatted })} />
        </TitleWrapper>

        {elements.map(({ elements: elementIndex, coef }) => {
          const { element, atomMass } = table[elementIndex];

          const percent =
            elements.length === 1
              ? 100
              : Math.round((atomMass * 100 * coef) / mass);

          return (
            <TextStyled key={elementIndex}>
              {`${element} : ${percent}%`}
            </TextStyled>
          );
        })}
      </BlockWrapper>
    </>
  );
};

export default MolarMassInfo;
