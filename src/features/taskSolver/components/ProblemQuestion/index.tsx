import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../../components';
import {
  Wrapper,
  Question,
  Description,
  Answer,
  Example,
  styles,
} from './styles';

interface ProblemQuestionProps {
  question: string;
  description: string;
  onPressExamples: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ProblemQuestion: React.FC<ProblemQuestionProps> = props => {
  const { question, description, onPressExamples, onSubmit, onCancel } = props;
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Question>{question}</Question>
      <Description>{description}</Description>
      <Example>
        <Button
          bgColors={['rgba(120, 82, 230, 0.48)', 'rgba(120, 82, 230, 0.48)']}
          onPress={onPressExamples}
        >
          {t('taskSolver.examples')}
        </Button>
      </Example>
      <Answer>
        <Button
          style={[styles.button, styles.buttonMargin]}
          bgColors={['rgb(148, 218, 186)', 'rgb(53, 210, 174)']}
          onPress={onSubmit}
        >
          {t('taskSolver.yes')}
        </Button>
        <Button
          style={styles.button}
          bgColors={['rgb(255, 88, 127)', 'rgb(222, 124, 124)']}
          onPress={onCancel}
        >
          {t('taskSolver.no')}
        </Button>
      </Answer>
    </Wrapper>
  );
};

export default ProblemQuestion;
