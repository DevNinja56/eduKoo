import React, { useMemo, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import variablesList from '../../../../json/quantities.json';
import {
  checkFindString,
  setSelectedFindVariable,
  solveProblem,
} from '../../../../helpers/task-solver.serves';
import { StackParamList } from '../../../../navigation/entities';
import { SCREENS } from '../../../../navigation/constants';
import { ErrorBlock, Picker, SubText } from '../../../../components';
import { colors } from '../../../../styles';
import Field from '../../components/Field';
import FieldEnter from '../../components/FieldEnter';
import { ProblemFindField, Quantity } from '../../entities';
import ProblemWrapper from '../../components/ProblemWrapper';
import { SolveButton, Section, styles } from './styles';

type ProblemFindRouteType = RouteProp<
  StackParamList,
  SCREENS.TASK_SOLVER_PROBLEM_FIND
>;

const ProblemFind: React.FC = () => {
  const route = useRoute<ProblemFindRouteType>();
  const navigation = useNavigation();
  const { i18n, t } = useTranslation();

  const { reaction, isSimple, givenFields, substFormula = '' } = route.params;

  const [pickerSelectedValue, setPickerSelectedValue] = useState<string>(
    variablesList[0].name[i18n.language],
  );
  const [currentVariable, setCurrentVariable] = useState<Quantity | null>(null);
  const [findFields, setFindFields] = useState<ProblemFindField[]>([]);
  const [error, setError] = useState('');

  const solveButtonDisabled = useMemo(
    () => !findFields.length || !!currentVariable,
    [currentVariable, findFields.length],
  );
  const subtitle = useMemo(() => {
    const lastGivenField = givenFields[givenFields.length - 1];
    return `${lastGivenField.symbol} = ${lastGivenField.value} ${lastGivenField.measure}`;
  }, [givenFields]);

  useEffect(() => {
    // Close picker on android
    if (Platform.OS === 'android') {
      handleClosePicker();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerSelectedValue]);

  const handleClosePicker = () => {
    const nextVariable: Quantity = variablesList.find(
      (it: Quantity) => it.name[i18n.language] === pickerSelectedValue,
    );

    if (nextVariable.var !== 'select') {
      const res = setSelectedFindVariable({
        variablesList,
        findFields,
        variable: nextVariable.var,
        lang: i18n.language,
        isSimple,
      });

      if (!res.error && !isSimple) {
        setCurrentVariable(nextVariable);
      }

      if (!res.error && isSimple) {
        const fillingFindField = {
          var: nextVariable!.var,
          name: nextVariable!.name[i18n.language],
          symbol: nextVariable!.symbol[i18n.language],
          subst: '',
        };

        setFindFields([...findFields, fillingFindField]);
      }
      setPickerSelectedValue(variablesList[0].name[i18n.language]);
      setError(res.error);
    }
  };

  const handleFieldEnterSubmit = (params: { substance: { subst: string } }) => {
    const { substance } = params;

    const fillingFindField = {
      var: currentVariable!.var,
      name: currentVariable!.name[i18n.language],
      symbol: currentVariable!.symbol[i18n.language],
      subst: substance.subst,
    };

    const res = checkFindString({
      subst: substance,
      findFields,
    });

    if (!res.error) {
      setFindFields([...findFields, fillingFindField]);
      setCurrentVariable(null);
    }

    setPickerSelectedValue(variablesList[0].name[i18n.language]);
    setError(res.error);
  };

  const handleFieldEnterClose = () => {
    setPickerSelectedValue(variablesList[0].name[i18n.language]);
    setCurrentVariable(null);
  };

  const handleDeleteField = (index: number) => () => {
    setFindFields(findFields.filter((el, i) => i !== index));
  };

  const handleSolve = () => {
    const res = solveProblem({
      isSimple,
      findFields,
      givenFields,
      reaction,
      variablesList,
      lang: i18n.language,
      substance: substFormula,
    });

    navigation.navigate(SCREENS.TASK_SOLVER_SOLUTION, {
      solution: res,
      substFormula,
    });
  };

  return (
    <ProblemWrapper
      title={t('taskSolver.find')}
      subtitle={subtitle}
      helpText={t('taskSolver.problemFindHelpText')}
      titlePosition="underLine"
    >
      {findFields.map(({ symbol, subst }, index) => (
        <Section key={symbol + subst}>
          <Field
            text={`${symbol} ${subst ? '(' + subst + ')' : ''} - ?`}
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

      {currentVariable && !isSimple && (
        <Section>
          <FieldEnter
            currentVariable={currentVariable}
            reactionObject={reaction.object}
            type="fieldFind"
            onSubmit={handleFieldEnterSubmit}
            onClose={handleFieldEnterClose}
          />
        </Section>
      )}

      {!!error && (
        <ErrorBlock>
          <SubText style={styles.subText} text={error} />
        </ErrorBlock>
      )}

      <SolveButton disabled={solveButtonDisabled} onPress={handleSolve}>
        {t('taskSolver.solve')}
      </SolveButton>
    </ProblemWrapper>
  );
};

export default ProblemFind;
