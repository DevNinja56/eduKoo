import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from './navigation';
import StateProvider from './context';
import { colors } from './styles';
import './localization';

const App = () => {
  return (
    <StateProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.purple} />
        <Navigation />
      </SafeAreaProvider>
    </StateProvider>
  );
};

export default App;
