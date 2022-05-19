import React, {
  useRef,
  ElementRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import {
  Button,
  ErrorBlock,
  ReactionsTemplate,
  SkewableView,
} from '../../../../components';
import { reactParser } from '../../../../helpers/task-solver.serves';
import { SCREENS } from '../../../../navigation/constants';
import { reactSearch } from '../../../../helpers/task-solver.serves';
import ExamplesModal from '../../modals/ExamplesModal';
import HintTemplate from '../../components/HintTemplate';
import ReactionLabel from '../../components/ReactionLabel';
import { REACTION_FIND_DEFAULT_EXAMPLE } from '../../constants';
import { HintText, HintTextDecorate } from '../styles';
import { ReactionText, ReactionWrapper, FullReaction, styles } from './styles';

const ReactionFind = () => {
  const { t } = useTranslation();
  const [reactions, setReactions] = useState<{ reaction: string }[]>([]);
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const ref = useRef<ElementRef<typeof ReactionsTemplate>>(null);

  const handlePressReactionLabel = useCallback(
    (reaction: string) => {
      ref.current?.searchFromOutside(reaction);
      setOpened(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref.current?.searchFromOutside],
  );

  const modalExamples = useMemo(
    () => [
      {
        condition: t('taskSolver.reactionFindFirstCondition'),
        reaction: t('taskSolver.entering'),
        label: (
          <ReactionLabel
            reaction="K + H2O"
            onPress={handlePressReactionLabel}
          />
        ),
      },
      {
        condition: t('taskSolver.reactionFindSecondCondition'),
        reaction: t('taskSolver.entering'),
        label: (
          <ReactionLabel
            reaction="BaO2 + H2SO4 = BaSO4"
            onPress={handlePressReactionLabel}
          />
        ),
      },
      {
        condition: t('taskSolver.reactionFindThirdCondition'),
        reaction: t('taskSolver.entering'),
        label: (
          <ReactionLabel
            reaction="HCl + Zn"
            onPress={handlePressReactionLabel}
          />
        ),
      },
      {
        condition: t('taskSolver.reactionFindFourthCondition'),
        reaction: t('taskSolver.entering'),
        label: (
          <ReactionLabel
            reaction="HCl = CaCl2"
            onPress={handlePressReactionLabel}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handlePressReactionLabel],
  );

  const toggleOpened = useCallback(
    () => setOpened(prevState => !prevState),
    [],
  );

  const handleNavigate = (screen: string) => () => {
    navigation.navigate(screen);
  };

  const handleOnFind = (searchValue: string) => {
    setIsLoading(true);
    setTimeout(() => {
      reactSearch.search(searchValue).then(res => {
        setReactions(res.list.data);
        setError(res.error.text);
        setIsLoading(false);
      });
    }, 0);
  };

  const handlePressReaction = (value: string) => () => {
    const object = reactParser.createObject(value);
    navigation.navigate(SCREENS.TASK_SOLVER_PROBLEM_GIVEN, {
      reaction: {
        record: value,
        object,
      },
      isSimple: false,
    });
  };

  const renderFullReaction = () => (
    <FullReaction>
      <HintText>{t('taskSolver.reactionFindHintText')}</HintText>
      <Button
        bgColors={['rgba(120, 82, 230, 0.48)', 'rgba(120, 82, 230, 0.48)']}
        style={styles.fullReactionButton}
        onPress={handleNavigate(SCREENS.TASK_SOLVER_REACTION_ENTER)}
      >
        {t('taskSolver.enterReactionManually')}
      </Button>
    </FullReaction>
  );

  const renderHint = () => (
    <>
      <HintTemplate>
        <HintText>
          {t('taskSolver.reactionFindUseSearch')}
          {'\n'}
        </HintText>
        <HintText>{t('taskSolver.reactionFindExample')}</HintText>
        <ReactionLabel reaction="H2 + O2" onPress={handlePressReactionLabel} />
        <TouchableOpacity onPress={toggleOpened}>
          <HintTextDecorate>
            {t('taskSolver.reactionFindAnotherExample')}
          </HintTextDecorate>
        </TouchableOpacity>
      </HintTemplate>
      {opened && (
        <ExamplesModal
          title={t('taskSolver.reactionFindExamples')}
          examples={modalExamples}
          onClose={toggleOpened}
        />
      )}
    </>
  );

  const renderResults = () => {
    if (!reactions.length) {
      return (
        <>
          {!error ? renderHint() : <ErrorBlock>{error}</ErrorBlock>}
          {renderFullReaction()}
        </>
      );
    }

    return (
      <>
        {reactions.map((item, index) => (
          <ReactionWrapper
            key={index}
            onPress={handlePressReaction(item.reaction)}
          >
            <SkewableView
              containerStyle={styles.reactionContainer}
              colors={['rgb(64,24,137)', 'rgb(79,21,151)']}
            >
              <ReactionText>{item.reaction}</ReactionText>
              <Button
                bgColors={[
                  'rgba(120, 82, 230, 0.48)',
                  'rgba(120, 82, 230, 0.48)',
                ]}
                textStyle={styles.reactionButtonText}
                skewContainerStyle={styles.reactionButtonSkewContainer}
                onPress={handlePressReaction(item.reaction)}
              >
                {t('taskSolver.select')}
              </Button>
            </SkewableView>
          </ReactionWrapper>
        ))}
        {renderFullReaction()}
      </>
    );
  };

  return (
    <ReactionsTemplate
      isLoading={isLoading}
      examples={[]}
      defaultExample={REACTION_FIND_DEFAULT_EXAMPLE}
      onFind={handleOnFind}
      renderResults={renderResults}
      ref={ref}
    />
  );
};

export default ReactionFind;
