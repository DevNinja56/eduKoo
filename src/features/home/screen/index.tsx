import React, { useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListRenderItem, FlatList } from 'react-native';
import filter from 'lodash/filter';
import { WebView } from 'react-native-webview';

import { MainContainer } from '../../../components';
import { colors, metrics } from '../../../styles';
import MenuButton from '../components/MenuButton';
import { MenuButtonType, MENU_BUTTONS } from '../constants';
import { useStateContext } from '../../../context';
import { LOCALES } from '../../../localization/constants';
import { UserIDWrapper, UserID } from './styles';
import { SCREENS } from '../../../navigation/constants';
import remoteConfig from '@react-native-firebase/remote-config';
import PopUp from './RatePopUp'
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import InAppReview from 'react-native-in-app-review';
import { getData, storeData } from './storage';

const Never_Show = 'Never_Show';
const isFirst = 'isFirst';

const Home = (props: any) => {
  const { getItem, setItem } = useAsyncStorage('in_App_Review');
  const { t, i18n } = useTranslation();
  const { state } = useStateContext();
  const [isVisible, setVisible] = useState(false)
  const [isEnable, setEnable] = useState(false)
  const menuButtons = useMemo(() => {
    if (i18n.language === LOCALES.en) {
      return filter<MenuButtonType>(
        MENU_BUTTONS,
        it => it.route !== SCREENS.CHEATS_MAIN,
      );
    }

    return MENU_BUTTONS;
  }, [i18n.language]);


  const renderMenuButton: ListRenderItem<MenuButtonType> = ({ item }) => {
    return <MenuButton data={item} />;
  };


  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      checkIsFirst()
    });
    return unsubscribe;
  }, []);

  const checkIsFirst = async () => {
    const value = await getData(isFirst)
    if (value === "1") {
      checkNeverShow()
    } else {
      await storeData(isFirst, "1")
    }
  }

  const checkNeverShow = async () => {
    const value = await getData(Never_Show)
    if (value !== 'never') {
      console.log('Inside in null status 2')
      apiCall()
    }
  }

  const apiCall = async () => {
    await remoteConfig().fetchAndActivate();
    const configString = remoteConfig().getValue('config').asString();
    const config = JSON.parse(configString);
    if (config.rateApp.enabled) {
      console.log('Inside in rate app enabled')
      onReview()
    }
  }

  const onReview = async () => {
    const lastDateAppReviewed = await getItem();
    if (lastDateAppReviewed !== null) {
      console.log('Inside in onReview 1')
      let Today = new Date();
      const leftTime = Math.abs(Today - Date.parse(lastDateAppReviewed));
      let leftDays = Math.ceil(leftTime / (1000 * 60 * 60 * 24));

      if (leftDays > 15) {
        console.log('Inside in onReview 2')
        await setItem(new Date().toString());
        setVisible(true)
      }
    } else {
      console.log('Inside in onReview 3')
      await setItem(new Date().toString());
      setVisible(true)
    }
  };

  const _storeData = async (value: String) => {
    await storeData(Never_Show, value)
    await setVisible(false)
    InAppReview.isAvailable();
    InAppReview.RequestInAppReview().then((hasFlowFinishedSuccessfully) => {
      console.log('InAppReview in android', hasFlowFinishedSuccessfully);
      // when return true in ios it means review flow lanuched to user.
      console.log(
        'InAppReview in ios has launched successfully',
        hasFlowFinishedSuccessfully,
      )
    })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <MainContainer showPreloader>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: metrics.spacing }}
        keyExtractor={it => it.title}
        data={menuButtons}
        renderItem={renderMenuButton}
        numColumns={2}
        ListFooterComponent={
          state.uid ? (
            <UserIDWrapper>
              {t('home.id')}
              <UserID>{state.uid}</UserID>
            </UserIDWrapper>
          ) : null
        }
      />
      {isVisible &&
        <PopUp
          isVisible={isVisible}
          onCloseClick={() => setVisible(false)}
          title={t('home.rateUs')}
          description={t('home.likeApp')}
          onDownClick={() => {
            _storeData('never')
          }}
          onUpClick={() => {
            _storeData('never')
          }}
        />
      }
    </MainContainer>
  );
};

export default Home;
