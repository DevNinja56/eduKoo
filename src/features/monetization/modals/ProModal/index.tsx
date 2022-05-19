import React, { useEffect, useMemo, useState } from 'react';
import { Text, Linking, Modal, TouchableOpacityProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import find from 'lodash/find';

import { SUBSCRIPTION_ID } from '../../../../helpers/monetization/qonversion.constants';
import closeIcon from '../../../../assets/images/icons/close.png';
import gemsImg from '../../../../assets/images/pro/gems.png';
import problemsImg from '../../../../assets/images/pro/problems.png';
import protectionImg from '../../../../assets/images/pro/protect.png';
import { PreloaderModal, SkewableView } from '../../../../components';
import { proModelOpen, useStateContext } from '../../../../context';
import { colors } from '../../../../styles';
import { TouchableOpacity } from 'react-native';
import ProModalCarousel from '../../components/Carousel';
import {
  ModalContainer,
  Header,
  TitleText,
  CloseIcon,
  Separator,
  CarouselContainer,
  TextContainer,
  LargeText,
  SmallText,
  SkewableText,
  ProDescriptionContainer,
  ProDescriptionText,
  ProDescriptionLinks,
  styles,
} from './styles';
import StatusModal, { StatusDataType } from '../StatusModal';
import { storeData } from '../../../../helpers/storage.service';

interface Props extends TouchableOpacityProps {
  onClose: () => void;
}

const ProModal: React.FC<Props> = props => {
  const { onClose } = props;
  const { t, i18n } = useTranslation();
  const language = i18n.language as 'en' | 'ru';
  const { state, setState, buyProduct } = useStateContext();
  const {
    products,
    status,
    remoteConfig: {
      screens: { subscriptionLaunch },
    },
  } = state;
  const [statusModal, setStatusModal] = useState<StatusDataType | null>(null);
  const [loading, setLoading] = useState(false);

  const carouselData = useMemo(
    () => [
      { label: `${t('monetization.infGems')}`, image: gemsImg },
      { label: `${t('monetization.solOfTasks')}`, image: problemsImg },
      { label: `${t('monetization.protection')}`, image: protectionImg },
    ],
    [t],
  );

  const proSubscriptionProduct = useMemo(
    () => find(products, { productId: SUBSCRIPTION_ID }),
    [products],
  );

  const buySubscription = async () => {
    setLoading(true);
    try {
      await buyProduct(SUBSCRIPTION_ID);

      setLoading(false);
      setStatusModal({
        title: t('success'),
        text: t('monetization.youGotProVer'),
      });
      setState({ ...state, status: 'CLOSE_ON_SUCCESS_SUBSCRIPTION' });
    } catch (e) {
      setLoading(false);
      setStatusModal({
        title: t('error'),
        text: t('monetization.errorPurchase'),
        isError: true,
      });
    }
  };

  useEffect( () => {
      storeData(proModelOpen, true);
  }, []);

  useEffect(() => {
    if (status === 'INIT_ERROR') {
      setStatusModal({
        title: t('error'),
        text: t('networkError'),
        isError: true,
      });
    }
  }, [status]);

  return (
    <Modal>
      <ModalContainer>
        <Header>
          <TitleText>{t('monetization.proVersion')}</TitleText>
          <TouchableOpacity onPress={() =>{
              setState({ ...state, status: 'CLOSE_ON_SUCCESS_SUBSCRIPTION' });
          }}>
            <CloseIcon source={closeIcon} />
          </TouchableOpacity>
        </Header>
        <Separator />
        <CarouselContainer>
          <ProModalCarousel data={carouselData} />
        </CarouselContainer>
        <TextContainer>
          <LargeText>{t('monetization.freeDays')}</LargeText>
          <SmallText>
            {t('monetization.priceWeek', {
              price: proSubscriptionProduct?.price || '1.99',
            })}
          </SmallText>
        </TextContainer>
        <TouchableOpacity onPress={buySubscription}>
          <SkewableView
            colors={[colors.crystalRed1, colors.crystalRed2]}
            style={styles.skewableView}
          >
            <SkewableText>
              {subscriptionLaunch.button.text[language]}
            </SkewableText>
          </SkewableView>
        </TouchableOpacity>
        <ProDescriptionContainer>
          <ProDescriptionText>
            {subscriptionLaunch.disclaimer[language]}
          </ProDescriptionText>
          <ProDescriptionLinks>
            <Text
              style={styles.linkText}
              onPress={() =>
                Linking.openURL('http://appcrab.net/privacy-policy/')
              }
            >
              {t('monetization.privacyPolicy')}
            </Text>
            <Text style={styles.linkText}> | </Text>
            <Text
              style={styles.linkText}
              onPress={() =>
                Linking.openURL('http://appcrab.net/terms-of-use/')
              }
            >
              {t('monetization.useConditions')}
            </Text>
          </ProDescriptionLinks>
        </ProDescriptionContainer>
      </ModalContainer>
      {statusModal ? (
        <StatusModal
          data={statusModal}
          onClose={() => {
            setStatusModal(null);
          }}
        />
      ) : null}
      <PreloaderModal visible={loading} />
    </Modal>
  );
};

export default ProModal;
