import { useEffect, useMemo, useState } from "react";
import { BookOpen, Images, Play, RotateCcw } from "lucide-react";
import { courseNotes, endings, getStation, initialGameState } from "./data/gameData";
import { clearSavedGame, getSavedGame, saveGame } from "./data/gameEngine";
import type { GameState } from "./types/game";
import MainMenu from "./components/MainMenu";
import GameLayout from "./components/GameLayout";
import CourseNotes from "./components/CourseNotes";
import Gallery from "./components/Gallery";
import EndingScreen from "./components/EndingScreen";

type Screen = "menu" | "game" | "notes" | "gallery" | "ending";

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => getSavedGame() ?? initialGameState);
  const [screen, setScreen] = useState<Screen>("menu");
  const hasSave = useMemo(() => Boolean(getSavedGame()), [gameState]);

  useEffect(() => {
    saveGame(gameState);
    if (gameState.endingId) setScreen("ending");
  }, [gameState]);

  const startNew = () => {
    clearSavedGame();
    setGameState({ ...initialGameState, resources: { ...initialGameState.resources }, log: [...initialGameState.log] });
    setScreen("game");
  };

  const resetGame = () => {
    if (confirm("Reset the journey and clear the saved game?")) startNew();
  };

  const ending = endings.find((item) => item.id === gameState.endingId);
  const currentStation = getStation(gameState.stationId);

  return (
    <div className="app-shell">
      <div className="stars" />
      <header className="topbar">
        <button className="brand" onClick={() => setScreen("menu")}>
          <span className="brand-mark">CMS</span>
          <span>Redux Trail</span>
        </button>
        <nav>
          <button onClick={() => setScreen("game")} disabled={!hasSave && screen !== "game"}>
            <Play size={16} /> Journey
          </button>
          <button onClick={() => setScreen("notes")}>
            <BookOpen size={16} /> Notes
          </button>
          <button onClick={() => setScreen("gallery")}>
            <Images size={16} /> Gallery
          </button>
          <button onClick={resetGame}>
            <RotateCcw size={16} /> Reset
          </button>
        </nav>
      </header>

      {screen === "menu" && (
        <MainMenu
          hasSave={hasSave}
          stationTitle={currentStation.title}
          onStart={startNew}
          onContinue={() => setScreen(gameState.endingId ? "ending" : "game")}
          onNotes={() => setScreen("notes")}
          onGallery={() => setScreen("gallery")}
        />
      )}
      {screen === "game" && <GameLayout gameState={gameState} setGameState={setGameState} />}
      {screen === "notes" && <CourseNotes notes={courseNotes} gameState={gameState} />}
      {screen === "gallery" && <Gallery />}
      {screen === "ending" && ending && <EndingScreen gameState={gameState} ending={ending} onRestart={startNew} />}
    </div>
  );
}
