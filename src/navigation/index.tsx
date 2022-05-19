import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import background from '../assets/images/backgrounds/main.jpg';
import back from '../assets/images/icons/back.png';
import Home from '../features/home';
import TaskSolver from '../features/taskSolver';
import Cheats from '../features/cheats';
import Reactivity from '../features/reactivity';
import Formulas from '../features/formulas';
import PeriodicTable from '../features/periodicTable';
import SolubilityTable from '../features/solubilityTable';
import Reactions from '../features/reactions';
import Chains from '../features/chains';
import MolarMass from '../features/molarMass';
import CoefArrangement from '../features/coefArrangement';
import { LanguageSwitcher, PreloaderModal } from '../components';
import { colors } from '../styles';
import { getCheatsTitle, SCREENS } from './constants';
import CrystalButton from '../features/monetization/components/CrystalButton';
import styles from './styles';
import {
  ProModal,
  RefillGemsModal,
  StatusModal,
} from '../features/monetization';
import { useStateContext } from '../context';
import { StackParamList } from './entities';
import { StatusDataType } from '../features/monetization/modals/StatusModal';
import SplashScreen from 'react-native-splash-screen'

const Stack = createStackNavigator<StackParamList>();

const Navigation = () => {
  const { t } = useTranslation();
  const { state, setState } = useStateContext();
  const { diamondsAmount, hasSubscription, status } = state;
  const [proModal, setProModal] = useState(false);
  const [refillGemsModal, setRefillGemsModal] = useState(false);
  const [statusModal, setStatusModal] = useState<StatusDataType | null>(null);

  const openRefillGemsModal = () => {
    if (hasSubscription) {
      setStatusModal({
        title: t('monetization.youHaveProVer'),
        text: t('monetization.everythingAvailable'),
      });
    } else {
      setRefillGemsModal(true);
    }
  };

  const hideSplashScreen = () => {
    // setTimeout(() => {
    SplashScreen.hide();
    // await RNBootSplash.hide({ fade: Platform.OS === 'ios' });
    // }, 100);
  };

  useEffect(() => {
    hideSplashScreen();
    console.log('###', status);
    switch (status) {
      case 'SPENDING_ERROR':
        setRefillGemsModal(true);
        break;
      case 'INIT_ERROR':
        break
      case 'FIRST_INIT':
        setProModal(true);
        break;
      case 'CLOSE_ON_SUCCESS_SUBSCRIPTION':
        setProModal(false);
        setRefillGemsModal(false);
        break;
      case 'INIT_SUCCESS':
        setStatusModal({
          title: t('success'),
          text: t('initSuccess'),
        });
        break;
      case 'UNKNOWN_ERROR':
        setStatusModal({
          title: t('error'),
          text: t('unknownError'),
          isError: true,
        });
        break;
    }
  }, [status]);

  return (
    <NavigationContainer>
      <ImageBackground
        defaultSource={background}
        source={background}
        style={{ flex: 1, backgroundColor: colors.purple }}
      >
        {
          status === 'NONE' ? <PreloaderModal visible={true} />:
            <Stack.Navigator
              screenOptions={{
                headerStyle: styles.headerStyle,
                headerBackImage: () => (
                  <Image source={back} style={styles.headerBackStyle} />
                ),
                headerBackTitleVisible: false,
                headerTitleStyle: styles.headerTitleStyle,
                headerTitleAlign: 'center',
                cardStyle: {
                  backgroundColor: colors.none,
                },
                animationEnabled: false,
                headerRight: () => (
                  <CrystalButton
                    onPress={openRefillGemsModal}
                    isProActive={hasSubscription}
                    crystalAmount={diamondsAmount}
                  />
                ),
              }}
            >
              {
                status === 'FIRST_INIT' ?
                  <Stack.Screen
                    name={'ProModal'}
                    component={ProModal}
                  />
                  :
                  <>

                    <Stack.Screen
                      name={SCREENS.HOME}
                      component={Home}
                      options={{
                        title: t('home.title'),
                        headerLeft: LanguageSwitcher,
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.TASK_SOLVER_REACTION_QUESTION}
                      component={TaskSolver.ReactionQuestion}
                      // component={TaskSolver.Solution}
                      options={{
                        title: t('taskSolver.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.TASK_SOLVER_SUBSTANCE_QUESTION}
                      component={TaskSolver.SubstanceQuestion}
                      options={{
                        title: t('taskSolver.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.TASK_SOLVER_REACTION_FIND}
                      component={TaskSolver.ReactionFind}
                      options={{
                        title: t('taskSolver.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.TASK_SOLVER_REACTION_ENTER}
                      component={TaskSolver.ReactionEnter}
                      options={{
                        title: t('taskSolver.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.TASK_SOLVER_SUBSTANCE_ENTER}
                      component={TaskSolver.SubstanceEnter}
                      options={{
                        title: t('taskSolver.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.TASK_SOLVER_PROBLEM_GIVEN}
                      component={TaskSolver.ProblemGiven}
                      options={{
                        title: t('taskSolver.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.TASK_SOLVER_PROBLEM_FIND}
                      component={TaskSolver.ProblemFind}
                      options={{
                        title: t('taskSolver.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.TASK_SOLVER_SOLUTION}
                      component={TaskSolver.Solution}
                      options={{
                        title: t('taskSolver.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.REACTIVITY}
                      component={Reactivity}
                      options={{
                        title: t('reactivity.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.FORMULAS}
                      component={Formulas}
                      options={{
                        title: t('formulas.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.PERIODIC_TABLE}
                      component={PeriodicTable}
                      options={{
                        title: t('periodicTable.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.SOLUBILITY_TABLE}
                      component={SolubilityTable}
                      options={{
                        title: t('solubilityTable.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.REACTIONS}
                      component={Reactions}
                      options={{
                        title: t('reactions.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.CHAINS}
                      component={Chains}
                      options={{
                        title: t('chains.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.MOLAR_MASSES}
                      component={MolarMass}
                      options={{
                        title: t('molarMass.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.COEF_ARRANGEMENT}
                      component={CoefArrangement}
                      options={{
                        title: t('coefArrangement.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.CHEATS_MAIN}
                      component={Cheats.CheatsMain}
                      options={{
                        title: t('cheats.title'),
                      }}
                    />
                    <Stack.Screen
                      name={SCREENS.CHEATS_LIST}
                      component={Cheats.CheatsList}
                      options={({ route }) => ({
                        title: t(`cheats.${getCheatsTitle(route.params.section)}`),
                      })}
                    />
                    <Stack.Screen
                      name={SCREENS.CHEATS_ARTICLE}
                      component={Cheats.CheatsArticle}
                      options={({ route }) => ({
                        title: t(`cheats.${getCheatsTitle(route.params.section)}`),
                      })}
                    />
                  </>
              }
            </Stack.Navigator>
        }

      </ImageBackground>
      {proModal && (
        <ProModal
          onClose={() => {
            setProModal(false);
            setState({ ...state, status: 'CLOSE_ON_SUCCESS_SUBSCRIPTION' });
          }}
        />
      )}
      {refillGemsModal && (
        <RefillGemsModal
          onClose={() => {
            setRefillGemsModal(false);
            setState({ ...state, status: 'CLOSE_ON_SUCCESS_SUBSCRIPTION' });
          }}
        />
      )}
      {statusModal && (
        <StatusModal
          data={statusModal}
          onClose={() => {
            setStatusModal(null);
            setState({ ...state, status: 'CLOSE_ON_SUCCESS_SUBSCRIPTION' });
          }}
        />
      )}
    </NavigationContainer>
  );
};

export default Navigation;
