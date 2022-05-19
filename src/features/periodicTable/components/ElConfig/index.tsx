import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CELL_STATES,
  ENERGY_LEVELS,
  EnergyLevel,
  LEVELS_EXP,
  ORBS_CELLS,
} from '../../constants';
import {
  Wrapper,
  Content,
  Text,
  LevelText,
  Row,
  Cell,
  Separator,
  ArrowText,
  OrbsWrapper,
  OrbTitleWrapper,
  OrbTitle,
} from './styles';
import { metrics } from '../../../../styles';

interface Props {
  elconf: string;
}

const ElConfig: React.FC<Props> = props => {
  const { elconf } = props;
  const { t } = useTranslation();
  const elconfData = useMemo(
    () =>
      elconf.split(' ').map(it => {
        const orb = it[1];
        const [level, sup] = it.split(LEVELS_EXP);

        return { level, orb, sup };
      }),
    [elconf],
  );

  const renderEnergyLevels = () => {
    return ENERGY_LEVELS.map((it: EnergyLevel) => {
      const { level, orbs } = it;

      return (
        <Row key={level}>
          <LevelText>{level}</LevelText>
          {orbs.map((orb: string, orbIndex) => {
            const { cols } = ORBS_CELLS[orb];
            const { sup } = elconfData.find(
              data => +data.level === level && data.orb === orb,
            ) || { sup: 0 };
            const CellsToRender = [...Array(cols)].map((_, index) => {
              const cellNumber = index + 1;
              const status =
                cellNumber <= sup
                  ? cellNumber + cols <= sup
                    ? CELL_STATES.full
                    : CELL_STATES.half
                  : CELL_STATES.none;

              return (
                <Cell key={orb + level + cellNumber} last={cellNumber === cols}>
                  <ArrowText>{status}</ArrowText>
                </Cell>
              );
            });

            return (
              <React.Fragment key={orb + level}>
                {CellsToRender}
                {!(orbIndex + 1 === orbs.length) && <Separator />}
              </React.Fragment>
            );
          })}
        </Row>
      );
    });
  };

  return (
    <Wrapper horizontal showsHorizontalScrollIndicator={false}>
      <Content>
        <Text>{t('periodicTable.eLevels')}</Text>
        {renderEnergyLevels()}
        <OrbsWrapper>
          <OrbTitleWrapper width={40} color={ORBS_CELLS.s.color}>
            <OrbTitle>s</OrbTitle>
          </OrbTitleWrapper>
          <OrbTitleWrapper width={80} color={ORBS_CELLS.p.color}>
            <OrbTitle>p</OrbTitle>
          </OrbTitleWrapper>
          <OrbTitleWrapper width={120} color={ORBS_CELLS.d.color}>
            <OrbTitle>d</OrbTitle>
          </OrbTitleWrapper>
          <OrbTitleWrapper width={160} color={ORBS_CELLS.f.color}>
            <OrbTitle>f</OrbTitle>
          </OrbTitleWrapper>
        </OrbsWrapper>
        <Text style={{ marginLeft: metrics.spacing }}>
          {t('periodicTable.orbs')}
        </Text>
      </Content>
    </Wrapper>
  );
};

export default ElConfig;
