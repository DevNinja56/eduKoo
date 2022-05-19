import React, { useMemo, useState } from 'react';
import { Text, Linking, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import find from 'lodash/find';

import crystalIcon from '../../../../assets/images/icons/crystal.png';
import closeIcon from '../../../../assets/images/icons/close.png';
import { PreloaderModal, SkewableView } from '../../../../components';
import CrystalImg from '../../components/CrystalImg';
import { colors } from '../../../../styles';
import { useStateContext } from '../../../../context';
import { SUBSCRIPTION_ID } from '../../../../helpers/monetization/qonversion.constants';
import { REFILL_GEMS_BUTTONS_INFO } from '../../constants';
import StatusModal, { StatusDataType } from '../StatusModal';
import {
  BuyGemsContainer,
  RefillTitleContainer,
  RefillTitleText,
  BuyGemsCloseIcon,
  CountCrystalsContainer,
  CountCrystalsText,
  CrystallIcon,
  ProductsContainer,
  SkewableViewContainer,
  ProductTextContainer,
  ProductImgContainer,
  LargeText,
  SmallText,
  ProDescriptionContainer,
  ProDescriptionText,
  ProDescriptionLinks,
  Separator,
  styles,
} from './styles';

interface Props {
  onClose: () => void;
}

const RefillGemsModal: React.FC<Props> = props => {
  const { onClose } = props;
  const { t, i18n } = useTranslation();
  const language = i18n.language as 'en' | 'ru';
  const { state, buyProduct } = useStateContext();
  const {
    products,
    diamondsAmount,
    remoteConfig: {
      screens: { refillGems },
    },
  } = state;
  const [statusModal, setStatusModal] = useState<StatusDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBuyProduct = (productId: string) => async () => {
    setLoading(true);
    try {
      await buyProduct(productId);
      setLoading(false);

      if (productId === SUBSCRIPTION_ID) {
        setStatusModal({
          title: t('success'),
          text: t('monetization.youGotProVer'),
        });
      } else {
        setStatusModal({
          title: t('success'),
          text: t('monetization.successGems', {
            amount: REFILL_GEMS_BUTTONS_INFO[productId].amount,
          }),
        });
      }
    } catch (e) {
      setLoading(false);
      setStatusModal({
        title: t('error'),
        text: t('monetization.errorPurchase'),
        isError: true,
      });
    }
  };

  const Buttons = useMemo(() => {
    return refillGems.buttons.map(it => {
      const { offering, title } = it;
      const isSubscription = offering === SUBSCRIPTION_ID;
      const buttonColors = isSubscription
        ? [colors.crystalRed1, colors.crystalRed2]
        : [colors.productItemPurple, colors.productItemPurple];
      const buttonInfo = REFILL_GEMS_BUTTONS_INFO[offering];
      const product = find(products, { productId: offering });
      return (
        <TouchableOpacity key={offering} onPress={handleBuyProduct(offering)}>
          <SkewableView colors={buttonColors} style={styles.skewableView}>
            <SkewableViewContainer>
              <ProductTextContainer>
                <LargeText buttonTextColor={isSubscription ? "#26155a" : "white"}>{title[language]}</LargeText>
                <SmallText>
                  {isSubscription
                    ? it.subtitle![language]
                    : `${product?.price}$`}
                </SmallText>
              </ProductTextContainer>
              <ProductImgContainer>
                <CrystalImg
                  isWhite={isSubscription}
                  title={
                    isSubscription && buttonInfo ? buttonInfo.amount : buttonInfo ? `X${buttonInfo.amount}` : '-'
                  }
                />
              </ProductImgContainer>
            </SkewableViewContainer>
          </SkewableView>
        </TouchableOpacity>
      );
    });
  }, []);

  return (
    <Modal>
      <BuyGemsContainer>
        <RefillTitleContainer>
          <RefillTitleText>{refillGems.title[language]}</RefillTitleText>
          <TouchableOpacity onPress={onClose}>
            <BuyGemsCloseIcon source={closeIcon} />
          </TouchableOpacity>
        </RefillTitleContainer>
        <Separator />
        <CountCrystalsContainer>
          <CountCrystalsText>{diamondsAmount}</CountCrystalsText>
          <CrystallIcon source={crystalIcon} />
        </CountCrystalsContainer>
        <ProductsContainer>{Buttons}</ProductsContainer>
        <ProDescriptionContainer>
          <ProDescriptionText>
            {refillGems.disclaimer[language]}
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
      </BuyGemsContainer>
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

export default RefillGemsModal;
