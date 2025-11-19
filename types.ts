export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ChapterContent {
  theory: string;
  assignment: {
    title: string;
    description: string;
    starterCode: string; // A snippet of code to get started
    expectedOutput: string;
  };
  quiz: QuizQuestion[];
}

export interface Chapter {
  id: number;
  title: string;
  shortDescription: string;
  isCompleted: boolean;
  content?: ChapterContent | null; // Content might be loaded lazily
  isLoading?: boolean;
}

export interface CourseState {
  syllabus: Chapter[];
  currentChapterId: number | null;
  isGeneratingSyllabus: boolean;
  error: string | null;
}

export enum TabView {
  THEORY = 'THEORY',
  LAB = 'LAB',
  QUIZ = 'QUIZ'
}