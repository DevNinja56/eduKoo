import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { SCREENS } from '../../../../navigation/constants';
import ExamplesModal from '../../modals/ExamplesModal';
import Label from '../../components/Label';
import ProblemQuestion from '../../components/ProblemQuestion';
import { Wrapper } from './styles';

const SubstanceQuestion = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [opened, setOpened] = useState(false);

  const modalExamples = useMemo(
    () => [
      {
        condition: t('taskSolver.substanceQuestionFirstCondition'),
        reaction: `${t('taskSolver.substanceQuestion')}: `,
        label: (
          <Label bgColors={['rgb(148, 218, 186)', 'rgb(53, 210, 174)']}>
            {t('taskSolver.yes')}
          </Label>
        ),
      },
      {
        condition: t('taskSolver.substanceQuestionSecondCondition'),
        reaction: `${t('taskSolver.substanceQuestion')}: `,
        label: (
          <Label bgColors={['rgb(148, 218, 186)', 'rgb(53, 210, 174)']}>
            {t('taskSolver.yes')}
          </Label>
        ),
      },
      {
        condition: t('taskSolver.substanceQuestionThirdCondition'),
        reaction: `${t('taskSolver.substanceQuestion')}: `,
        label: (
          <Label bgColors={['rgb(255, 88, 127)', 'rgb(222, 124, 124)']}>
            {t('taskSolver.no')}
          </Label>
        ),
      },
    ],
    [],
  );

  const handleSubmit = useCallback(() => {
    navigation.navigate(SCREENS.TASK_SOLVER_SUBSTANCE_ENTER);
  }, [navigation]);

  const handleCancel = useCallback(() => {
    navigation.navigate(SCREENS.TASK_SOLVER_PROBLEM_GIVEN, {
      isSimple: true,
      reaction: { object: [], record: '' },
    });
  }, [navigation]);

  const toggleOpened = useCallback(
    () => setOpened(prevState => !prevState),
    [],
  );

  return (
    <Wrapper>
      <ProblemQuestion
        question={`${t('taskSolver.substanceQuestion')}?`}
        description={t('taskSolver.substanceDescription')}
        onPressExamples={toggleOpened}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
      {opened && (
        <ExamplesModal
          title={`${t('taskSolver.substanceQuestion')}?`}
          examples={modalExamples}
          onClose={toggleOpened}
        />
      )}
    </Wrapper>
  );
};

export default SubstanceQuestion;
