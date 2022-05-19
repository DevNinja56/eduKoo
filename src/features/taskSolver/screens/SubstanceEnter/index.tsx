import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { SCREENS } from '../../../../navigation/constants';
import { Button, Input } from '../../../../components';
import { checkSubstFormula } from '../../../../helpers/task-solver.serves';
import { colors } from '../../../../styles';
import { BaseWrapper } from '../styles';
import {
  Title,
  Text,
  CorrectSubstance,
  IncorrectSubstance,
  SubstanceWrapper,
  SubstanceEnterError,
} from './styles';

const SubstanceEnter = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [substance, setSubstance] = useState('');
  const [error, setError] = useState('');

  const handlePress = () => {
    const { subst, errors } = checkSubstFormula(substance);

    setError(errors.join(' '));

    if (!errors.length) {
      navigation.navigate(SCREENS.TASK_SOLVER_PROBLEM_GIVEN, {
        reaction: {
          object: [],
          record: '',
        },
        isSimple: true,
        substFormula: subst,
      });
    }
  };

  return (
    <>
      <BaseWrapper>
        <Title>{t('taskSolver.enterSubstanceFormula')}</Title>
        <Text>
          {t('taskSolver.correctEntry')}
          <CorrectSubstance>NaCl</CorrectSubstance>
        </Text>
        <Text>
          {t('taskSolver.incorrectEntry')}
          <IncorrectSubstance>
            nacl, {t('taskSolver.incorrectExampleSodiumChloride')}
          </IncorrectSubstance>
        </Text>
        <SubstanceWrapper>
          <Input
            value={substance}
            onChangeText={setSubstance}
            placeholder={t('taskSolver.substanceExample')}
            bgColors={[colors.darkBlue1, colors.darkBlue1]}
          />
          <Button onPress={handlePress}>OK</Button>
        </SubstanceWrapper>
      </BaseWrapper>

      {!!error && <SubstanceEnterError>{error}</SubstanceEnterError>}
    </>
  );
};

export default SubstanceEnter;
