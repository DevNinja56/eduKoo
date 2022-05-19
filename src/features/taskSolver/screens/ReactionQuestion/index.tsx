import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { SCREENS } from '../../../../navigation/constants';
import Label from '../../components/Label';
import ProblemQuestion from '../../components/ProblemQuestion';
import ExamplesModal from '../../modals/ExamplesModal';
import { Wrapper } from './styles';
import { useMemo } from 'react';

const ReactionQuestion = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [opened, setOpened] = useState(false);

  const modalExamples = useMemo(
    () => [
      {
        condition: t('taskSolver.isReactionRunningFirstCondition'),
        reaction: t('taskSolver.isReactionRunningAnswer'),
        label: (
          <Label bgColors={['rgb(148, 218, 186)', 'rgb(53, 210, 174)']}>
            {t('taskSolver.yes')}
          </Label>
        ),
      },
      {
        condition: t('taskSolver.isReactionRunningSecondCondition'),
        reaction: t('taskSolver.isReactionRunningAnswer'),
        label: (
          <Label bgColors={['rgb(255, 88, 127)', 'rgb(222, 124, 124)']}>
            {t('taskSolver.no')}
          </Label>
        ),
      },
    ],
    [],
  );

  const handleOnCancel = useCallback(() => {
    navigation.navigate(SCREENS.TASK_SOLVER_SUBSTANCE_QUESTION);
  }, [navigation]);

  const handleOnSubmit = useCallback(() => {
    navigation.navigate(SCREENS.TASK_SOLVER_REACTION_FIND);
  }, [navigation]);

  const toggleOpened = useCallback(
    () => setOpened(prevState => !prevState),
    [],
  );

  return (
    <Wrapper>
      <ProblemQuestion
        question={t('taskSolver.reactionQuestion')}
        description={t('taskSolver.reactionDescription')}
        onPressExamples={toggleOpened}
        onCancel={handleOnCancel}
        onSubmit={handleOnSubmit}
      />
      {opened && (
        <ExamplesModal
          title={t('taskSolver.isReactionRunning')}
          examples={modalExamples}
          onClose={toggleOpened}
        />
      )}
    </Wrapper>
  );
};

export default ReactionQuestion;
