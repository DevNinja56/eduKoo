import React, { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import variablesList from '../../../../json/quantities.json';
import {
  checkGivenString,
  setSelectedVariable,
} from '../../../../helpers/task-solver.serves';
import { SCREENS } from '../../../../navigation/constants';
import { ErrorBlock, Picker, SubText } from '../../../../components';
import { colors } from '../../../../styles';
import Field from '../../components/Field';
import { StackParamList } from '../../../../navigation/entities';
import FieldEnter from '../../components/FieldEnter';
import { ProblemGivenField, Quantity } from '../../entities';
import ProblemWrapper from '../../components/ProblemWrapper';
import { NextButton, Section, styles } from './styles';

type ProblemGivenRouteType = RouteProp<
  StackParamList,
  SCREENS.TASK_SOLVER_PROBLEM_GIVEN
>;

const ProblemGiven: React.FC = () => {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<ProblemGivenRouteType>();

  const { reaction, isSimple, substFormula } = route.params;

  const [pickerSelectedValue, setPickerSelectedValue] = useState<string>(
    variablesList[0].name[i18n.language],
  );
  const [currentVariable, setCurrentVariable] = useState<Quantity | null>(null);
  const [givenFields, setGivenFields] = useState<ProblemGivenField[]>([]);
  const [error, setError] = useState('');

  const nextButtonDisabled = useMemo(
    () => !givenFields.length || !!currentVariable,
    [currentVariable, givenFields.length],
  );

  useEffect(() => {
    // Close picker on android
    if (Platform.OS === 'android') {
      handleClosePicker();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerSelectedValue]);

  const handlePressNext = () => {
    navigation.navigate(SCREENS.TASK_SOLVER_PROBLEM_FIND, {
      reaction,
      isSimple,
      givenFields,
      substFormula,
    });
    setError('');
  };

  const handleClosePicker = () => {
    const nextVariable = variablesList.find(
      (it: any) => it.name[i18n.language] === pickerSelectedValue,
    );

    if (nextVariable.var !== 'select') {
      const res = setSelectedVariable({
        variablesList,
        givenFields,
        variable: nextVariable.var,
        lang: i18n.language,
        isSimple,
      });

      if (!res.error) {
        setCurrentVariable(nextVariable);
      }
      setPickerSelectedValue(variablesList[0].name[i18n.language]);
      setError(res.error);
    }
  };

  const handleSubmitFieldEnter = (params: {
    value: string;
    substance: { subst: string };
    measure: string;
  }) => {
    const fillingField = {
      measure: params.measure,
      subst: params.substance.subst,
      symbol: currentVariable!.symbol[i18n.language],
      value: params.value,
      var: currentVariable!.var,
      variable: currentVariable!.var,
    };
    const res = checkGivenString({
      givenFields,
      fillingField,
      variableValue: params.value,
      variableSubstance: params.substance.subst,
      isSimple,
    });

    if (!res.error) {
      setGivenFields([...givenFields, fillingField]);
      setCurrentVariable(null);
    }
    setError(res.error);
    setPickerSelectedValue(variablesList[0].name[i18n.language]);
  };

  const handleCloseFieldEnter = () => {
    setPickerSelectedValue(variablesList[0].name[i18n.language]);
    setCurrentVariable(null);
  };

  const handleDeleteField = (index: number) => () => {
    setGivenFields(givenFields.filter((el, i) => i !== index));
  };

  return (
    <ProblemWrapper
      title={t('taskSolver.given')}
      helpText={t('taskSolver.problemGivenHelpText')}
    >
      {givenFields.map(({ value, measure, symbol, subst }, index) => (
        <Section key={symbol + subst}>
          <Field
            text={`${symbol} ${
              subst ? '(' + subst + ')' : ''
            } = ${value} ${measure}`}
            onDelete={handleDeleteField(index)}
          />
        </Section>
      ))}

      {!currentVariable && (
        <Picker
          textStyle={styles.pickerText}
          bgColors={[colors.darkBlue, colors.darkBlue]}
          value={pickerSelectedValue}
          data={variablesList.map((it: any) => ({
            label: it.name[i18n.language],
            value: it.name[i18n.language],
          }))}
          onValueChange={setPickerSelectedValue}
          // Only ios
          onClose={handleClosePicker}
        />
      )}

      {currentVariable && (
        <Section>
          <FieldEnter
            type="fieldGiven"
            reactionObject={reaction.object}
            currentVariable={currentVariable}
            onSubmit={handleSubmitFieldEnter}
            onClose={handleCloseFieldEnter}
          />
        </Section>
      )}

      {!!error && (
        <ErrorBlock>
          <SubText style={styles.subText} text={error} />
        </ErrorBlock>
      )}

      <NextButton disabled={nextButtonDisabled} onPress={handlePressNext}>
        {t('taskSolver.next')}
      </NextButton>
    </ProblemWrapper>
  );
};

export default ProblemGiven;
