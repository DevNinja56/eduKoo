import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { getSubstanceInfo } from '../../../helpers/molar-mass-helper';
import { colors } from '../../../styles';
import { ErrorBlock } from '../../../components';
import BlockWrapper from '../components/BlockWrapper';
import MolarMassInfo from '../components/MolarMassInfo';
import { DEFAULT_EXAMPLE, MEASURES } from '../constants';
import {
  Wrapper,
  FormulaSearchTitle,
  FormulaSearchInput,
  FormulaSearchButton,
  ResultWrapper,
  MassTextWrapper,
  MeasurePicker,
} from './styles';

const MolarMass = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [info, setInfo] = useState<
    { mass: number; substance: string; parsed: any[] } | undefined
  >();
  const [measure, setMeasure] = useState(MEASURES.g.toString());
  const [error, setError] = useState('');
  const measureMass = useMemo(() => {
    if (!info) {
      return;
    }

    const val = info.mass * +measure;

    return measure === MEASURES.kg.toString() ? val.toFixed(3) : val;
  }, [measure, info]);

  const handleSearchPress = () => {
    const substance = search.trim() || DEFAULT_EXAMPLE;
    const substanceInfo = getSubstanceInfo(substance);

    // @ts-ignore
    if (substanceInfo.parsed.err) {
      // @ts-ignore
      const { err } = substanceInfo.parsed;

      setError(err.join(' '));
      setInfo(undefined);
      return;
    }

    setInfo(substanceInfo);
    setSearch(substance);
    setError('');
  };

  const handleMeasureChange = (newMeasure: string) => {
    setMeasure(newMeasure);
  };

  return (
    <ScrollView>
      <Wrapper>
        <BlockWrapper>
          <FormulaSearchTitle>{t('molarMass.searchTitle')}</FormulaSearchTitle>
          <FormulaSearchInput
            bgColors={[colors.darkBlue1, colors.darkBlue1]}
            placeholder={`${t('example')} ${DEFAULT_EXAMPLE}`}
            onChangeText={setSearch}
            onSubmitEditing={handleSearchPress}
            value={search}
          />
          <FormulaSearchButton onPress={handleSearchPress}>
            {t('molarMass.searchButton')}
          </FormulaSearchButton>
          {!!info && (
            <ResultWrapper>
              <MassTextWrapper>{measureMass}</MassTextWrapper>
              <MeasurePicker
                bgColors={[colors.darkBlue1, colors.darkBlue1]}
                value={measure}
                onValueChange={handleMeasureChange}
                data={[
                  {
                    label: `${t('mg')}/${t('mole')}`,
                    value: MEASURES.mg.toString(),
                  },
                  {
                    label: `${t('g')}/${t('mole')}`,
                    value: MEASURES.g.toString(),
                  },
                  {
                    label: `${t('kg')}/${t('mole')}`,
                    value: MEASURES.kg.toString(),
                  },
                ]}
              />
            </ResultWrapper>
          )}
        </BlockWrapper>

        {!!error && <ErrorBlock>{error}</ErrorBlock>}

        {!!info && (
          <MolarMassInfo
            substance={info.substance}
            mass={info.mass}
            elements={info.parsed}
          />
        )}
      </Wrapper>
    </ScrollView>
  );
};

export default MolarMass;
