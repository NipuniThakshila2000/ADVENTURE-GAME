import {
  difficultySettings,
  endings,
  getNoteForStation,
  getStation,
  narrowChoiceLabels,
  nextStationId,
  randomEvents,
  stationIndex,
  stations,
  tohuChoiceLabels,
} from "./gameData";
import type { Choice, DifficultyLevel, Ending, GameState, QuizQuestion, ResourceKey } from "../types/game";

export const STORAGE_KEY = "cms-redux-tohu-journey-save";

export function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function normalizeGameState(state: GameState): GameState {
  return {
    ...state,
    difficulty: state.difficulty ?? "gentle",
  };
}

function scaleEffect(value: number, difficulty: DifficultyLevel) {
  const settings = difficultySettings[difficulty];
  const multiplier = value >= 0 ? settings.positiveMultiplier : settings.negativeMultiplier;
  return value === 0 ? 0 : Math.trunc(value * multiplier);
}

export function applyEffects(resources: GameState["resources"], effects: Choice["effects"], difficulty: DifficultyLevel = "gentle") {
  const next = { ...resources };
  (Object.keys(effects) as ResourceKey[]).forEach((key) => {
    next[key] = clamp(next[key] + scaleEffect(effects[key] ?? 0, difficulty));
  });
  return next;
}

export function chooseEnding(resources: GameState["resources"], difficulty: DifficultyLevel = "gentle"): Ending {
  const hard = difficulty === "tohu" ? 8 : difficulty === "narrow" ? 4 : 0;
  if (resources.openness <= 25 + hard) return endings.find((ending) => ending.id === "clutching-loop") ?? endings[0];
  if (resources.consistency <= 42 + hard && resources.focus <= 42 + hard) return endings.find((ending) => ending.id === "calendar-return") ?? endings[0];
  if (resources.rest <= 38 + hard && resources.consistency >= 55) return endings.find((ending) => ending.id === "gentle-reset") ?? endings[0];
  if (resources.discernment >= 70 + hard && resources.consistency < 68 + hard) return endings.find((ending) => ending.id === "witness-awakens") ?? endings[0];
  if (
    resources.consistency >= 68 + hard &&
    resources.discernment >= 68 + hard &&
    resources.recall >= 62 + hard &&
    resources.openness >= 62 + hard
  ) {
    return endings.find((ending) => ending.id === "ready-next-module") ?? endings[0];
  }
  return endings.find((ending) => ending.id === "witness-awakens") ?? endings[0];
}

export function getSavedGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeGameState(JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearSavedGame() {
  localStorage.removeItem(STORAGE_KEY);
}

export function shouldTriggerRandomEvent(state: GameState) {
  const settings = difficultySettings[state.difficulty];
  if (settings.eventMod === 1) return state.day < 88;
  const seed = state.day + state.completedStations.length * 11 + state.log.length * 3;
  return seed % settings.eventMod === 0 && state.day < 88;
}

export function pickRandomEvent(state: GameState) {
  const index = Math.abs((state.day * 7 + state.log.length * 13 + state.completedStations.length) % randomEvents.length);
  return randomEvents[index];
}

export function advanceDays(currentDay: number, stationId: string, choiceId: string) {
  const amount = 3 + Math.abs((currentDay + stationId.length + choiceId.length) % 5);
  return clampDay(currentDay + amount);
}

export function clampDay(day: number) {
  return Math.max(1, Math.min(90, day));
}

export function redirectForMiniStoryline(choice: Choice) {
  switch (choice.miniStorylineId) {
    case "clutching-loop":
    case "over-forcing-path":
      return "first-stillness";
    case "spectacle-path":
      return "field-of-openness";
    case "no-calendar-drift":
    case "comparison-road":
      return "calendar-table";
    default:
      return undefined;
  }
}

export function isDetourChoice(choice: Choice) {
  const totalEffect = Object.values(choice.effects).reduce((sum, value) => sum + (value ?? 0), 0);
  return Boolean(choice.miniStorylineId) || totalEffect < 0;
}

export function getDetourQuiz(stationId: string): QuizQuestion[] {
  const station = getStation(stationId);
  const steadyChoices = station.choices.filter((choice) => !isDetourChoice(choice));
  const detourChoices = station.choices.filter(isDetourChoice);
  const firstSteady = steadyChoices[0]?.label ?? "Return to the lesson with steadiness";
  const firstDetour = detourChoices[0]?.label ?? "React too quickly";

  return [
    {
      question: `At ${station.title}, what posture brings you back toward stillness?`,
      options: [firstSteady, firstDetour, "Rush ahead for a dramatic result"],
      correctIndex: 0,
      explanation: `The station lesson points back to this posture: ${station.lesson}`,
      effectsCorrect: { recall: 4, clarity: 3 },
      effectsWrong: { recall: 1, rest: -2 },
    },
    {
      question: "What usually creates the detour here?",
      options: ["Clutching, forcing, reacting, or demanding certainty", "Returning gently to the lesson", "Reviewing the station before moving"],
      correctIndex: 0,
      explanation: "A detour forms when the participant grabs, reacts, forces, or turns the lesson into spectacle.",
      effectsCorrect: { discernment: 4, openness: 3 },
      effectsWrong: { clarity: -2, focus: -2 },
    },
    {
      question: `What should you remember before returning to ${station.title}?`,
      options: [station.lesson, "The wrong turn should become the whole story", "The trail only continues through intensity"],
      correctIndex: 0,
      explanation: "The way back is to remember the lesson and return without making the mistake into a verdict.",
      effectsCorrect: { recall: 5, consistency: 2 },
      effectsWrong: { recall: 1, openness: -2 },
    },
  ];
}

export function applyChoice(state: GameState, choice: Choice, fromRandomEvent = false): GameState {
  const station = getStation(state.stationId);
  const note = getNoteForStation(station.id);
  const resources = applyEffects(state.resources, choice.effects, state.difficulty);
  const completedStations = fromRandomEvent
    ? state.completedStations
    : Array.from(new Set([...state.completedStations, station.id]));
  const unlockedNotes = note ? Array.from(new Set([...state.unlockedNotes, note.id, choice.unlockNoteId].filter(Boolean) as string[])) : state.unlockedNotes;
  const day = fromRandomEvent ? state.day : clampDay(advanceDays(state.day, station.id, choice.id) + difficultySettings[state.difficulty].dayBonus);
  const redirected = redirectForMiniStoryline(choice);
  const nextId = fromRandomEvent ? state.stationId : choice.nextStationId ?? redirected ?? nextStationId(station.id);
  const reachedEnd = day >= 90 || station.id === "inner-temple-threshold";
  const ending = reachedEnd ? chooseEnding(resources, state.difficulty) : undefined;
  const miniLine = redirected ? ` The detour becomes a learning dead end, and you are redirected to ${getStation(redirected).title}.` : "";

  return {
    ...state,
    day,
    stationId: reachedEnd ? station.id : nextId,
    resources,
    completedStations,
    unlockedNotes,
    endingId: ending?.id,
    log: [`Day ${day}: ${choice.resultText}${miniLine}`, ...state.log].slice(0, 18),
  };
}

export function applyQuizAnswer(state: GameState, question: QuizQuestion, selectedIndex: number): GameState {
  const correct = selectedIndex === question.correctIndex;
  const resources = applyEffects(state.resources, correct ? question.effectsCorrect : question.effectsWrong, state.difficulty);
  return {
    ...state,
    resources,
    quizHistory: [
      {
        question: question.question,
        selected: question.options[selectedIndex],
        correct,
        stationId: state.stationId,
      },
      ...state.quizHistory,
    ],
    log: [`Day ${state.day}: Quiz ${correct ? "remembered" : "reviewed"} - ${question.explanation}`, ...state.log].slice(0, 18),
  };
}

export function stationProgress(stationId: string) {
  if (stations.length <= 1) return 0;
  return (stationIndex(stationId) / (stations.length - 1)) * 100;
}

export function finalScore(resources: GameState["resources"], quizHistory: GameState["quizHistory"]) {
  const resourceAverage = Object.values(resources).reduce((sum, value) => sum + value, 0) / Object.values(resources).length;
  const quizScore = quizHistory.length ? (quizHistory.filter((item) => item.correct).length / quizHistory.length) * 100 : 0;
  return Math.round(resourceAverage * 0.75 + quizScore * 0.25);
}

export function getChoiceDisplayLabel(choice: Choice, difficulty: DifficultyLevel, index: number) {
  if (isDetourChoice(choice)) return "De Tour";
  if (difficulty === "gentle") return choice.label;
  if (difficulty === "narrow") return narrowChoiceLabels[choice.id] ?? choice.label;
  const fallback = ["The first movement", "The second movement", "The third movement", "The fourth movement"];
  return tohuChoiceLabels[choice.id] ?? fallback[index] ?? choice.label;
}
