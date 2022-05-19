import React, { useMemo, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import exclamationTriangleIcon from '../../../../assets/images/icons/exclamation-triangle.png';
import { SkewableView, Button } from '../../../../components';
import { SCREENS } from '../../../../navigation/constants';
import { StackParamList } from '../../../../navigation/entities';
import { colors } from '../../../../styles';
import {
  Wrapper,
  ReactionTableWrapper,
  ReactionTable,
  ReactionColumn,
  ReactionText,
  SolutionStep,
  SolutionText,
  Fraction,
  FractionItem,
  ShowMoreText,
  ShortAnswer,
  ShortAnswerTextWrapper,
  ShortAnswerText,
  StrongText,
  Error,
  ErrorSection,
  WarningIcon,
  Measure,
  PaidFeatureStyled,
  styles,
} from './styles';
import { TASK_SOLUTION } from '../../../monetization/constants';

type SolutionRouteType = RouteProp<
  StackParamList,
  SCREENS.TASK_SOLVER_SOLUTION
>;

export const Solution: React.FC = () => {
  const route = useRoute<SolutionRouteType>();
  const navigation = useNavigation();
  const { i18n, t } = useTranslation();

  const { solution, substFormula } = route.params;

  const {
    isSimple,
    reaction,
    answers,
    answerSol,
    convertedMeasures,
    reactRemarks,
    shortAnswers,
  } = solution;

  const [stepIndexOpened, setStepIndexOpened] = useState(-1);

  const solutionSteps = useMemo(() => {
    const res = isSimple ? answers[0] : answerSol;
    return res || [];
  }, [isSimple, answers, answerSol]);

  const solutionStepPressHandle = (index: number) => () =>
    setStepIndexOpened(curr => (curr === index ? -1 : index));

  const ErrorPressHandle = () => {
    navigation.navigate(SCREENS.FORMULAS);
  };
  return (
    <Wrapper>
      <PaidFeatureStyled featureKey={TASK_SOLUTION}>
        {!!convertedMeasures.length && (
          <Measure>
            {convertedMeasures.map(item => {
              const { symbol, value, measure, value2, measure2, subst } = item;
              const substance = isSimple ? substFormula : subst;
              const substanceInText = substance ? ` (${substance})` : '';
              const textFirstPart = symbol + substanceInText;
              const textSecondPart = ` = ${value} ${measure} = ${value2} ${measure2}`;

              return <SolutionText text={textFirstPart + textSecondPart} />;
            })}
          </Measure>
        )}

        {!isSimple && (
          <ReactionTableWrapper>
            <ReactionTable
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {solution.reaction.object.map((substance, index) => {
                const { coef, subst, side } = substance;
                const { object } = reaction;
                const remarkTop = reactRemarks.top[index] || '';
                const remarkBottom = reactRemarks.bottom[index] || '';

                const plusSeparator =
                  side === object[index + 1]?.side &&
                  object.indexOf(substance) < object.length - 1
                    ? ' + '
                    : '';

                const equalSeparator =
                  side !== object[index + 1]?.side &&
                  object.indexOf(substance) < object.length - 1
                    ? ' = '
                    : '';

                return (
                  <ReactionColumn key={coef + subst}>
                    <ReactionText>
                      {remarkTop ? `${remarkTop} моль` : ''}
                    </ReactionText>
                    <ReactionText>
                      {`${coef > 1 ? coef : ''}${subst}`}
                      {plusSeparator}
                      {equalSeparator}
                    </ReactionText>
                    <ReactionText>
                      {remarkBottom ? `${remarkBottom} моль` : ''}
                    </ReactionText>
                  </ReactionColumn>
                );
              })}
            </ReactionTable>
          </ReactionTableWrapper>
        )}

        {solutionSteps.map((step, index) => {
          const recordData = step.recordData || [];
          const explanationData = step.explanationData || [];
          const showMore = stepIndexOpened === index;
          const stepData = !showMore ? recordData : explanationData;

          return (
            <TouchableWithoutFeedback
              onPress={solutionStepPressHandle(index)}
              key={index}
            >
              <SolutionStep isLast={solution.answerSol.length - 1 === index}>
                {stepData.map(({ type, data }, index) => {
                  const isFormula = type === 'formula';
                  const isFormulaAndShowMore = isFormula && showMore;
                  return (
                    <SkewableView
                      key={index}
                      colors={
                        isFormulaAndShowMore
                          ? [colors.purple2, colors.purple2]
                          : [colors.none, colors.none]
                      }
                      style={
                        isFormulaAndShowMore ? styles.solutionStetSkewable : {}
                      }
                      containerStyle={styles.solutionStetSkewablContainer}
                    >
                      {data.map(item => {
                        if (!Array.isArray(item)) {
                          return (
                            <SolutionText
                              key={item}
                              text={item}
                              isBold={isFormulaAndShowMore}
                            />
                          );
                        } else {
                          return (
                            <Fraction key={item[0] + item[1]}>
                              <FractionItem fractionPosition="top">
                                <SolutionText
                                  text={item[0]}
                                  isBold={isFormulaAndShowMore}
                                />
                              </FractionItem>
                              <FractionItem fractionPosition="bottom">
                                <SolutionText
                                  text={item[1]}
                                  isBold={isFormulaAndShowMore}
                                />
                              </FractionItem>
                            </Fraction>
                          );
                        }
                      })}
                    </SkewableView>
                  );
                })}
                {!showMore && (
                  <SkewableView
                    style={styles.showMoreSkewable}
                    colors={[colors.purple2, colors.purple2]}
                  >
                    <ShowMoreText>{t('taskSolver.detailed')}</ShowMoreText>
                  </SkewableView>
                )}
              </SolutionStep>
            </TouchableWithoutFeedback>
          );
        })}
      </PaidFeatureStyled>

      {!!shortAnswers.length && (
        <ShortAnswer>
          <StrongText>{t('taskSolver.answer') + ' '}</StrongText>
          {shortAnswers.map((shortAnswer, index) => {
            const { symbol, measures, value, subst } = shortAnswer;
            const isLast = solution.shortAnswers.length - 1 === index;
            const comma = isLast ? '' : ', ';
            const substInText = !solution.isSimple && subst ? `(${subst})` : '';
            const text = `${symbol[i18n.language]}${substInText} = ${value} ${
              measures[i18n.language][0]
            }${comma}`;

            return (
              <ShortAnswerTextWrapper key={text}>
                <ShortAnswerText key={index} text={text} />
              </ShortAnswerTextWrapper>
            );
          })}
        </ShortAnswer>
      )}

      {solution.solutionErrors.map(error => {
        const headerText = error.headerData
          .map(item => item.data.join(''))
          .join('');

        const descriptionText = error.descriptionData
          .map(item => item.data.join(''))
          .join('');

        return (
          <Error key={headerText + descriptionText}>
            <ErrorSection>
              <WarningIcon source={exclamationTriangleIcon} />
              <SolutionText text={headerText} isBold={true} />
            </ErrorSection>
            <ErrorSection>
              <SolutionText text={descriptionText} />
            </ErrorSection>
            <Button
              bgColors={[colors.purple2, colors.purple2]}
              onPress={ErrorPressHandle}
            >
              {t('taskSolver.formulasForSolution')}
            </Button>
          </Error>
        );
      })}
    </Wrapper>
  );
};

export default Solution;
