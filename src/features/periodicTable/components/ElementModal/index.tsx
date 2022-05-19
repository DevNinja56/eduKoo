import React, { useMemo } from 'react';
import { Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import map from 'lodash/map';
import split from 'lodash/split';
import join from 'lodash/join';

import { PaidFeature } from '../../../monetization';
import closeIcon from '../../../../assets/images/icons/close.png';
import { ElementData } from '../../../../entities';
import { metrics } from '../../../../styles';
import { LEVELS_EXP } from '../../constants';
import InfoBlock from '../InfoBlock';
import { ENERGY_LEVELS } from '../../../monetization/constants';
import {
  Backdrop,
  Content,
  Header,
  HeaderTitle,
  HeaderElementName,
  HeaderNumber,
  InfoWrapper,
  CloseIconTouchable,
  CloseIcon,
} from './styles';
import ElConfig from '../ElConfig';

interface Props {
  elementData: ElementData;
  colors: string[];
  onClosePress: () => void;
}

const ElementModal: React.FC<Props> = props => {
  const { elementData, colors, onClosePress } = props;
  const { i18n, t } = useTranslation();
  const {
    id,
    element,
    name,
    period,
    group,
    atomMass,
    class: elementClass,
    subclass,
    val,
    crystalStruct,
    physColor,
    tempMelting,
    tempBoiling,
    elconf,
    elnegativity,
    discoverer,
  } = elementData;
  const isLanthan =
    subclass?.ru === 'Лантаноиды' || subclass?.ru === 'Актиноиды';
  const valJoined = val.join(', ');
  const elconfSup = useMemo(() => {
    const splitted = split(elconf, ' ');
    const mapped = map(splitted, it => {
      const orb = it[1];
      const [level, sup] = it.split(LEVELS_EXP);

      return `${level}${orb}<sup>${sup}</sup>`;
    });

    return join(mapped, ' ');
  }, [elconf]);

  return (
    <Modal transparent animationType="fade">
      <Backdrop>
        <Content>
          <CloseIconTouchable onPress={onClosePress}>
            <CloseIcon source={closeIcon} />
          </CloseIconTouchable>
          <Header colors={colors}>
            <HeaderNumber isWhite={isLanthan}>{id}</HeaderNumber>
            <HeaderTitle isWhite={isLanthan}>{element}</HeaderTitle>
            <HeaderElementName isWhite={isLanthan}>
              {name[i18n.language]}
            </HeaderElementName>
          </Header>
          <InfoWrapper
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: metrics.spacing }}
          >
            <InfoBlock title={t('periodicTable.period')} info={period} />
            <InfoBlock title={t('periodicTable.group')} info={group} />
            <InfoBlock title={t('periodicTable.atomMass')} info={atomMass} />
            <InfoBlock
              title={t('periodicTable.elementClass')}
              info={elementClass[i18n.language]}
            />
            {!!subclass && (
              <InfoBlock
                title={t('periodicTable.subclass')}
                info={subclass[i18n.language]}
              />
            )}
            <InfoBlock title={t('periodicTable.val')} info={valJoined} />
            {!!crystalStruct && (
              <InfoBlock
                title={t('periodicTable.crystalStruct')}
                info={crystalStruct[i18n.language]}
              />
            )}
            {!!physColor && (
              <InfoBlock
                title={t('periodicTable.physColor')}
                info={physColor[i18n.language]}
              />
            )}
            <InfoBlock
              title={t('periodicTable.tempMelting')}
              info={tempMelting}
            />
            <InfoBlock
              title={t('periodicTable.tempBoiling')}
              info={tempBoiling}
            />
            {!!elconf && (
              <InfoBlock title={t('periodicTable.elconf')} info={elconfSup}>
                <PaidFeature featureKey={ENERGY_LEVELS}>
                  <ElConfig elconf={elconf || ''} />
                </PaidFeature>
              </InfoBlock>
            )}
            <InfoBlock
              title={t('periodicTable.elnegativity')}
              info={elnegativity}
            />
            {!!discoverer && (
              <InfoBlock
                title={t('periodicTable.discoverer')}
                info={discoverer[i18n.language]}
              />
            )}
          </InfoWrapper>
        </Content>
      </Backdrop>
    </Modal>
  );
};

export default React.memo(ElementModal);
