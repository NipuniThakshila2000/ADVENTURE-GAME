import { useMemo, useState } from "react";
import { getStation } from "../data/gameData";
import { applyChoice, applyQuizAnswer, pickRandomEvent, saveGame, shouldTriggerRandomEvent } from "../data/gameEngine";
import type { TutorialStep } from "../App";
import type { GameState, RandomEvent } from "../types/game";
import StatusPanel from "./StatusPanel";
import TrailProgress from "./TrailProgress";
import StationCard from "./StationCard";
import JourneyLog from "./JourneyLog";
import LessonRecap from "./LessonRecap";
import QuizCard from "./QuizCard";
import TutorialCallout from "./TutorialCallout";

type Props = {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  tutorialStep: TutorialStep | null;
  setTutorialStep: (step: TutorialStep | null) => void;
};

export default function GameLayout({ gameState, setGameState, tutorialStep, setTutorialStep }: Props) {
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
    if (tutorialStep === "choice") setTutorialStep("resources");
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
        <div className={`tour-target ${tutorialStep === "choice" ? "active" : ""}`}>
          {event ? (
            <StationCard stationLike={event} imageKey="cover" isEvent difficulty={gameState.difficulty} onChoice={onChoice} />
          ) : needsQuiz ? (
            <QuizCard question={quiz} onAnswer={onQuizAnswer} />
          ) : (
            <StationCard stationLike={station} imageKey={station.imageKey} difficulty={gameState.difficulty} onChoice={onChoice} />
          )}
          {tutorialStep === "choice" && (
            <TutorialCallout
              title="Mission 3: choose an action"
              body="Read the station, then click one choice. Choices change your resources, unlock notes, and move the journey forward."
              position="top"
            />
          )}
        </div>
      </section>
      <aside className="side-stack">
        <div className={`tour-target ${tutorialStep === "resources" ? "active" : ""}`}>
          <StatusPanel resources={gameState.resources} difficulty={gameState.difficulty} />
          {tutorialStep === "resources" && (
            <TutorialCallout
              title="Mission 4: watch your resources"
              body="These bars show the condition of your journey. Notice how each choice affects focus, openness, rest, recall, and discernment."
              position="left"
              onNext={() => setTutorialStep("recap")}
            />
          )}
        </div>
        <div className={`tour-target ${tutorialStep === "recap" ? "active" : ""}`}>
          <LessonRecap station={station} unlockedNotes={gameState.unlockedNotes} />
          {tutorialStep === "recap" && (
            <TutorialCallout
              title="Mission 5: collect the lesson"
              body="After stations unlock, this recap helps you remember the key course idea before you continue."
              position="left"
              onNext={() => setTutorialStep("log")}
            />
          )}
        </div>
        <div className={`tour-target ${tutorialStep === "log" ? "active" : ""}`}>
          <JourneyLog log={gameState.log} />
          {tutorialStep === "log" && (
            <TutorialCallout
              title="Mission complete"
              body="Your log records what happened. Keep choosing, reviewing, and returning until you reach one of the endings."
              position="left"
              onNext={() => setTutorialStep(null)}
              nextLabel="Finish"
            />
          )}
        </div>
      </aside>
    </main>
  );
}
