import React from 'react';
import { useTranslation } from 'react-i18next';

import { LOCALES } from '../../localization/constants';
import { Wrapper, LanguageText } from './styles';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { language } = i18n;
  const inactiveLocale = language === LOCALES.en ? LOCALES.ru : LOCALES.en;

  const handlePress = () => {
    i18n.changeLanguage(inactiveLocale);
  };

  return (
    <Wrapper onPress={handlePress}>
      <LanguageText selected>{language.toUpperCase()}</LanguageText>
      <LanguageText> / {inactiveLocale.toUpperCase()}</LanguageText>
    </Wrapper>
  );
};

export default LanguageSwitcher;
