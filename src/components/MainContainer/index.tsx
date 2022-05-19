import React, { useEffect, useState } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ViewProps,
  ViewStyle,
  StyleProp,
  View,
} from 'react-native';

import PreloaderModal from '../PreloaderModal';

const styles = StyleSheet.create({
  container: { flex: 1 },
});

interface Props extends ViewProps {
  style?: StyleProp<ViewStyle>;
  showPreloader?: boolean;
  preloaderTime?: number;
}

const MainContainer: React.FC<Props> = props => {
  const { children, style, showPreloader, preloaderTime = 500 } = props;
  const [preloaderModal, setPreloaderModal] = useState(showPreloader);
  const [hidden, setHidden] = useState(showPreloader);

  // May be changed
  useEffect(() => {
    if (showPreloader) {
      setTimeout(() => setPreloaderModal(false), preloaderTime);
    }
  }, [showPreloader, preloaderTime]);

  // Lazy loading for navigation
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setHidden(false);
    });
  }, []);

  return (
    <View style={[style, styles.container]}>
      {hidden ? null : children}
      <PreloaderModal visible={!!preloaderModal} />
    </View>
  );
};

export default MainContainer;
