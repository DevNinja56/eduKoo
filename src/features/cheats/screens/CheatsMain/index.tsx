import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import arrowIcon from '../../../../assets/images/icons/down.png';
import { colors } from '../../../../styles';
import { styles, Wrapper, Button } from './styles';
import { SCREENS } from '../../../../navigation/constants';
import { SectionsType } from '../../constants';

const CheatsMain = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleButtonPress = (section: SectionsType) => () => {
    navigation.navigate(SCREENS.CHEATS_LIST, {
      section,
    });
  };

  return (
    <Wrapper>
      <Button
        onPress={handleButtonPress('INORGANIC')}
        skewContainerStyle={styles.buttonContainer}
        textStyle={styles.buttonText}
        bgColors={[colors.purple1, colors.purple1]}
        icon={arrowIcon}
        iconStyle={styles.icon}
      >
        {t('cheats.main.inorganic')}
      </Button>
      <Button
        onPress={handleButtonPress('ORGANIC')}
        skewContainerStyle={styles.buttonContainer}
        textStyle={styles.buttonText}
        bgColors={[colors.purple1, colors.purple1]}
        icon={arrowIcon}
        iconStyle={styles.icon}
      >
        {t('cheats.main.organic')}
      </Button>
    </Wrapper>
  );
};

export default CheatsMain;
