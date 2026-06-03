import { BookOpen, Images, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import { difficultySettings } from "../data/gameData";
import type { DifficultyLevel } from "../types/game";

type Props = {
  hasSave: boolean;
  stationTitle: string;
  onStart: (difficulty: DifficultyLevel) => void;
  onContinue: () => void;
  onNotes: () => void;
  onGallery: () => void;
};

export default function MainMenu({ hasSave, stationTitle, onStart, onContinue, onNotes, onGallery }: Props) {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("gentle");

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
        <div className="difficulty-picker">
          {(Object.keys(difficultySettings) as DifficultyLevel[]).map((level) => (
            <button
              key={level}
              className={difficulty === level ? "selected" : ""}
              onClick={() => setDifficulty(level)}
            >
              <strong>{difficultySettings[level].title}</strong>
              <span>{difficultySettings[level].description}</span>
            </button>
          ))}
        </div>
        <button className="primary action" onClick={() => onStart(difficulty)}>
          <Play size={18} /> Start New Journey
        </button>
        <button className="action" onClick={onContinue} disabled={!hasSave}>
          <RotateCcw size={18} /> Continue Journey
        </button>
        {hasSave && <p className="save-note">Saved at: {stationTitle}</p>}
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
