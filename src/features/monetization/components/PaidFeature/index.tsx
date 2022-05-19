import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import { PAID_FEATURES } from '../../constants';
import { SkewableView } from '../../../../components';
import { colors } from '../../../../styles';
import lockBackground from '../../../../assets/images/backgrounds/lock.png';
import crystalIcon from '../../../../assets/images/icons/crystal.png';
import { useStateContext } from '../../../../context';

import {
  Container,
  Header,
  Footer,
  BackgroundHeader,
  OpacityLayer,
  BackgroundFooter,
  LabelBlocked,
  LabelMain,
  SubLabel,
  CrystalIcon,
  ButtonViewFirst,
  ButtonViewSecond,
  styles,
} from './styles';
import { SUBSCRIPTION_ID } from '../../../../helpers/monetization/qonversion.constants';
import StatusModal, { StatusDataType } from '../../modals/StatusModal';

interface Props {
  featureKey: string;
  style?: any;
}

const PaidFeature: React.FC<Props> = props => {
  const { featureKey, style } = props;
  const { t } = useTranslation();
  const { state, buyFeature, buyProduct } = useStateContext();
  const { hasSubscription } = state;
  const [isBought, setIsBought] = useState(hasSubscription);
  const [statusModal, setStatusModal] = useState<StatusDataType | null>(null);

  const handleBuyFeature = async () => {
    try {
      await buyFeature(featureKey);

      setIsBought(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleBuySubscription = async () => {
    try {
      await buyProduct(SUBSCRIPTION_ID);

      setIsBought(true);
    } catch (e) {
      setStatusModal({
        title: t('error'),
        text: t('monetization.errorPurchase'),
        isError: true,
      });
    }
  };

  return (
    <React.Fragment>
      {isBought ? (
        <Container>{props.children}</Container>
      ) : (
        <Container style={style}>
          <Header>
            <BackgroundHeader source={PAID_FEATURES[featureKey].background}>
              <OpacityLayer>
                <LabelMain>
                  {t(`monetization.${PAID_FEATURES[featureKey].title}`)}
                </LabelMain>
                <LabelBlocked>{t('monetization.blocked')}</LabelBlocked>
              </OpacityLayer>
            </BackgroundHeader>
          </Header>
          <Footer>
            <BackgroundFooter source={lockBackground} resizeMode="repeat">
              <TouchableOpacity onPress={handleBuyFeature}>
                <SkewableView
                  colors={[
                    'rgba(120, 82, 230, 0.48)',
                    'rgba(120, 82, 230, 0.48)',
                  ]}
                  style={styles.skewableViewFirst}
                >
                  <ButtonViewFirst>
                    <LabelMain>
                      {t('monetization.openedFor')}{' '}
                      {`${PAID_FEATURES[featureKey].cost}`}{' '}
                    </LabelMain>
                    <CrystalIcon source={crystalIcon} />
                  </ButtonViewFirst>
                </SkewableView>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleBuySubscription}>
                <SkewableView
                  colors={[colors.crystalRed1, colors.crystalRed2]}
                  style={styles.skewableViewSecond}
                >
                  <ButtonViewSecond>
                    <LabelMain>{t('monetization.turnOffBlocking')}</LabelMain>
                    <SubLabel>{t('monetization.threeDays')}</SubLabel>
                  </ButtonViewSecond>
                </SkewableView>
              </TouchableOpacity>
            </BackgroundFooter>
          </Footer>
        </Container>
      )}
      {statusModal ? (
        <StatusModal
          data={statusModal}
          onClose={() => {
            setStatusModal(null);
          }}
        />
      ) : null}
    </React.Fragment>
  );
};

export default PaidFeature;
