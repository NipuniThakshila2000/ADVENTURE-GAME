import { BookOpen, HelpCircle, Images, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import { difficultySettings } from "../data/gameData";
import type { TutorialStep } from "../App";
import type { DifficultyLevel } from "../types/game";
import TutorialCallout from "./TutorialCallout";

type Props = {
  hasSave: boolean;
  stationTitle: string;
  onStart: (difficulty: DifficultyLevel) => void;
  onContinue: () => void;
  onNotes: () => void;
  onGallery: () => void;
  onShowIntro: () => void;
  onStartTutorial: () => void;
  tutorialStep: TutorialStep | null;
  setTutorialStep: (step: TutorialStep | null) => void;
};

export default function MainMenu({
  hasSave,
  stationTitle,
  onStart,
  onContinue,
  onNotes,
  onGallery,
  onShowIntro,
  onStartTutorial,
  tutorialStep,
  setTutorialStep,
}: Props) {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("gentle");

  const chooseDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
    if (tutorialStep === "difficulty") setTutorialStep("start");
  };

  return (
    <main className="menu hero-panel">
      <section className="hero-copy">
        <img className="hero-logo" src="/images/cms-redux-logo.png" alt="CMS Redux" />
        <p className="eyebrow">90 days · 20 minutes daily · course recall</p>
        <h1>CMS Redux Trail: The Tohu Journey</h1>
        <p>
          A contemplative choose-your-adventure learning companion for Module 1 recall. Move through stations, protect your
          coordinates, practice non-reaction, and review the concepts that Kirby emphasizes.
        </p>
        <p className="disclaimer">This game is a learning companion for course recall, not medical, psychological, or spiritual direction.</p>
      </section>
      <section className="menu-card glass">
        <div className={`difficulty-picker tour-target ${tutorialStep === "difficulty" ? "active" : ""}`}>
          {(Object.keys(difficultySettings) as DifficultyLevel[]).map((level) => (
            <button
              key={level}
              className={difficulty === level ? "selected" : ""}
              onClick={() => chooseDifficulty(level)}
            >
              <strong>{difficultySettings[level].title}</strong>
              <span>{difficultySettings[level].description}</span>
            </button>
          ))}
          {tutorialStep === "difficulty" && (
            <TutorialCallout
              title="Mission 1: choose your path"
              body="Pick the difficulty that matches how much challenge you want. Gentle Recall is the best first run."
              position="left"
            />
          )}
        </div>
        <div className={`tour-target ${tutorialStep === "start" ? "active" : ""}`}>
          <button className="primary action" onClick={() => onStart(difficulty)}>
            <Play size={18} /> Start New Journey
          </button>
          {tutorialStep === "start" && (
            <TutorialCallout
              title="Mission 2: begin"
              body="Start the journey. The next screen will show your first station and the choices that move the story forward."
              position="left"
            />
          )}
        </div>
        <button className="action" onClick={onContinue} disabled={!hasSave}>
          <RotateCcw size={18} /> Continue Journey
        </button>
        {hasSave && <p className="save-note">Saved at: {stationTitle}</p>}
        <button className="action" onClick={onShowIntro}>
          <HelpCircle size={18} /> Introduction
        </button>
        <button className="action" onClick={onStartTutorial}>
          <HelpCircle size={18} /> Tutorial Mission
        </button>
        <button className="action" onClick={onNotes}>
          <BookOpen size={18} /> Course Notes
        </button>
        <button className="action" onClick={onGallery}>
          <Images size={18} /> Image Gallery / Scene Gallery
        </button>
      </section>
    </main>
  );
}
