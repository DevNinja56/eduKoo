import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';

import bg from '../../../../assets/images/icons/icon-menu-button-bg.png';
import { MenuButtonType } from '../../constants';
import { Wrapper, Background, Icon, Title } from './styles';

interface Props {
  data: MenuButtonType;
}

const MenuButton: React.FC<Props> = props => {
  const { data } = props;
  const { title, icon, route } = data;
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(route);
  };

  return (
    <Wrapper onPress={handlePress}>
      <Background source={bg} />
      <Icon source={icon} />
      <Title>{t(title)}</Title>
    </Wrapper>
  );
};

export default MenuButton;
