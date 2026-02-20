export interface StudentProgress {
  topicsSearched: string[];
  questionsAsked: number;
  correctAnswers: number;
  wrongAnswers: number;
  weakTopics: string[];
  masteryLevel: number;
}

export const defaultProgress: StudentProgress = {
  topicsSearched: [],
  questionsAsked: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  weakTopics: [],
  masteryLevel: 0,
};
