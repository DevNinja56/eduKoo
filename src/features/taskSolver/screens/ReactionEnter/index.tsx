import React, { ElementRef, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { reactEntering } from '../../../../helpers/task-solver.serves';
import { ReactionsTemplate } from '../../../../components';
import { SCREENS } from '../../../../navigation/constants';
import {
  REACTION_ENTER_DEFAULT_EXAMPLE,
  REACTION_ENTER_EXAMPLES,
} from '../../constants';
import ReactionLabel from '../../components/ReactionLabel';
import HintTemplate from '../../components/HintTemplate';
import { HintText } from '../styles';
import { HintTextWrapper, ErrorBlockStyled, styles } from './styles';

const ReactionEnter = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [error, setError] = useState('');

  const ref = useRef<ElementRef<typeof ReactionsTemplate>>(null);

  const handleOnFind = (searchValue: string) => {
    const { reaction, error: reactEnteringError } = reactEntering.enter(
      searchValue,
    );

    if (!reactEnteringError.text) {
      navigation.navigate(SCREENS.TASK_SOLVER_PROBLEM_GIVEN, {
        reaction,
        isSimple: false,
      });
    } else {
      setError(reactEnteringError.text);
    }
  };

  const renderResults = () => {
    return (
      <>
        {!!error && <ErrorBlockStyled>{error}</ErrorBlockStyled>}
        <HintTemplate>
          <HintText>{t('taskSolver.enterFullReaction')}</HintText>
          <HintTextWrapper>
            <HintText style={styles.textBold}>
              {t('taskSolver.forExample')}
            </HintText>
            {REACTION_ENTER_EXAMPLES.map(example => (
              <ReactionLabel
                reaction={example}
                onPress={reaction => {
                  ref.current?.searchFromOutside(reaction);
                }}
              />
            ))}
          </HintTextWrapper>
        </HintTemplate>
      </>
    );
  };

  return (
    <ReactionsTemplate
      examples={[]}
      defaultExample={REACTION_ENTER_DEFAULT_EXAMPLE}
      onFind={handleOnFind}
      renderResults={renderResults}
      ref={ref}
    />
  );
};

export default ReactionEnter;
