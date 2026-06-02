import { endings, getNoteForStation, getStation, nextStationId, randomEvents, stationIndex, stations } from "./gameData";
import type { Choice, Ending, GameState, QuizQuestion, ResourceKey } from "../types/game";

export const STORAGE_KEY = "cms-redux-tohu-journey-save";

export function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function applyEffects(resources: GameState["resources"], effects: Choice["effects"]) {
  const next = { ...resources };
  (Object.keys(effects) as ResourceKey[]).forEach((key) => {
    next[key] = clamp(next[key] + (effects[key] ?? 0));
  });
  return next;
}

export function chooseEnding(resources: GameState["resources"]): Ending {
  if (resources.openness <= 25) return endings.find((ending) => ending.id === "clutching-loop") ?? endings[0];
  if (resources.consistency <= 42 && resources.focus <= 42) return endings.find((ending) => ending.id === "calendar-return") ?? endings[0];
  if (resources.rest <= 38 && resources.consistency >= 55) return endings.find((ending) => ending.id === "gentle-reset") ?? endings[0];
  if (resources.discernment >= 70 && resources.consistency < 68) return endings.find((ending) => ending.id === "witness-awakens") ?? endings[0];
  if (resources.consistency >= 68 && resources.discernment >= 68 && resources.recall >= 62 && resources.openness >= 62) {
    return endings.find((ending) => ending.id === "ready-next-module") ?? endings[0];
  }
  return endings.find((ending) => ending.id === "witness-awakens") ?? endings[0];
}

export function getSavedGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GameState) : null;
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
  const seed = state.day + state.completedStations.length * 11 + state.log.length * 3;
  return seed % 3 === 0 && state.day < 88;
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

export function applyChoice(state: GameState, choice: Choice, fromRandomEvent = false): GameState {
  const station = getStation(state.stationId);
  const note = getNoteForStation(station.id);
  const resources = applyEffects(state.resources, choice.effects);
  const completedStations = fromRandomEvent
    ? state.completedStations
    : Array.from(new Set([...state.completedStations, station.id]));
  const unlockedNotes = note ? Array.from(new Set([...state.unlockedNotes, note.id, choice.unlockNoteId].filter(Boolean) as string[])) : state.unlockedNotes;
  const day = fromRandomEvent ? state.day : advanceDays(state.day, station.id, choice.id);
  const redirected = redirectForMiniStoryline(choice);
  const nextId = fromRandomEvent ? state.stationId : choice.nextStationId ?? redirected ?? nextStationId(station.id);
  const reachedEnd = day >= 90 || station.id === "inner-temple-threshold";
  const ending = reachedEnd ? chooseEnding(resources) : undefined;
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
  const resources = applyEffects(state.resources, correct ? question.effectsCorrect : question.effectsWrong);
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
