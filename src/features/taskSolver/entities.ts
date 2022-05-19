import { Reaction, LangData } from '../../entities';

export interface Quantity {
  var: string;
  symbol: LangData;
  name: LangData;
  measures: LangData<string[]> & { multipliers: number[] };
}

export interface ProblemGivenField {
  measure: string;
  subst: string;
  symbol: string;
  value: string;
  var: string;
  variable: string;
}

export interface ProblemFindField {
  var: string;
  subst: string;
  name: string;
  symbol: string;
}

interface SolutionData {
  type: 'text' | 'formula';
  data: (string | string[])[];
}
interface Answer {
  variable: string;
  value: string;
  recordData: SolutionData[];
  explanationData: SolutionData[];
}

interface ShortAnswer {
  value: number;
  subst: string;
  symbol: LangData;
  measures: LangData<string[]> & { multipliers: number[] };
}

interface ConvertedMeasure {
  var: string;
  symbol: string;
  measure: string;
  measure2: string;
  multiplier: number;
  value: string;
  value2: number;
  subst: string;
}

interface SolutionError {
  headerData: SolutionData[];
  descriptionData: SolutionData[];
}

export interface Solution {
  isSimple: boolean;
  reaction: Reaction;
  answers: Answer[][];
  answerSol: Answer[];
  shortAnswers: ShortAnswer[];
  convertedMeasures: ConvertedMeasure[];
  reactRemarks: {
    top: string[];
    bottom: string[];
  };
  solutionErrors: SolutionError[];
}
