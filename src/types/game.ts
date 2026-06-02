export type ResourceKey =
  | "consistency"
  | "clarity"
  | "rest"
  | "openness"
  | "discernment"
  | "compassion"
  | "focus"
  | "recall";

export type Choice = {
  id: string;
  label: string;
  resultText: string;
  effects: Partial<Record<ResourceKey, number>>;
  nextStationId?: string;
  unlockNoteId?: string;
  miniStorylineId?: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  effectsCorrect: Partial<Record<ResourceKey, number>>;
  effectsWrong: Partial<Record<ResourceKey, number>>;
};

export type Station = {
  id: string;
  dayRange: [number, number];
  title: string;
  subtitle: string;
  imageKey: string;
  story: string;
  lesson: string;
  choices: Choice[];
  quiz?: QuizQuestion[];
};

export type CourseNote = {
  id: string;
  stationId: string;
  title: string;
  keyConcept: string;
  plainExplanation: string;
  memoryPhrase: string;
  reflectionQuestion: string;
};

export type RandomEvent = {
  id: string;
  title: string;
  story: string;
  choices: Choice[];
};

export type Ending = {
  id: string;
  title: string;
  message: string;
  revise: ResourceKey[];
  remembered: ResourceKey[];
};

export type QuizHistoryEntry = {
  question: string;
  selected: string;
  correct: boolean;
  stationId: string;
};

export type GameState = {
  day: number;
  stationId: string;
  resources: Record<ResourceKey, number>;
  log: string[];
  unlockedNotes: string[];
  completedStations: string[];
  quizHistory: QuizHistoryEntry[];
  endingId?: string;
};
