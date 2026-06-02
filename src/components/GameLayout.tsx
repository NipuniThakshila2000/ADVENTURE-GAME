import { useMemo, useState } from "react";
import { getStation } from "../data/gameData";
import { applyChoice, applyQuizAnswer, pickRandomEvent, saveGame, shouldTriggerRandomEvent } from "../data/gameEngine";
import type { GameState, RandomEvent } from "../types/game";
import StatusPanel from "./StatusPanel";
import TrailProgress from "./TrailProgress";
import StationCard from "./StationCard";
import JourneyLog from "./JourneyLog";
import LessonRecap from "./LessonRecap";
import QuizCard from "./QuizCard";

type Props = {
  gameState: GameState;
  setGameState: (state: GameState) => void;
};

export default function GameLayout({ gameState, setGameState }: Props) {
  const [event, setEvent] = useState<RandomEvent | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const station = getStation(gameState.stationId);
  const quiz = station.quiz?.[quizIndex];

  const handledQuizQuestions = useMemo(
    () => new Set(gameState.quizHistory.filter((item) => item.stationId === station.id).map((item) => item.question)),
    [gameState.quizHistory, station.id],
  );
  const needsQuiz = quiz && !handledQuizQuestions.has(quiz.question);

  const commitState = (next: GameState) => {
    setGameState(next);
    saveGame(next);
  };

  const onChoice = (choiceId: string) => {
    if (event) {
      const choice = event.choices.find((item) => item.id === choiceId);
      if (!choice) return;
      commitState(applyChoice(gameState, choice, true));
      setEvent(null);
      return;
    }
    const choice = station.choices.find((item) => item.id === choiceId);
    if (!choice) return;
    const next = applyChoice(gameState, choice);
    commitState(next);
    setQuizIndex(0);
    if (!next.endingId && shouldTriggerRandomEvent(next)) setEvent(pickRandomEvent(next));
  };

  const onQuizAnswer = (selectedIndex: number) => {
    if (!quiz) return;
    const next = applyQuizAnswer(gameState, quiz, selectedIndex);
    commitState(next);
    setQuizIndex((value) => value + 1);
  };

  return (
    <main className="game-grid">
      <section className="game-main">
        <TrailProgress stationId={station.id} day={gameState.day} />
        {event ? (
          <StationCard stationLike={event} imageKey="cover" isEvent onChoice={onChoice} />
        ) : needsQuiz ? (
          <QuizCard question={quiz} onAnswer={onQuizAnswer} />
        ) : (
          <StationCard stationLike={station} imageKey={station.imageKey} onChoice={onChoice} />
        )}
      </section>
      <aside className="side-stack">
        <StatusPanel resources={gameState.resources} />
        <LessonRecap station={station} unlockedNotes={gameState.unlockedNotes} />
        <JourneyLog log={gameState.log} />
      </aside>
    </main>
  );
}
