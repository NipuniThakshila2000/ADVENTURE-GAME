import { useEffect, useMemo, useState } from "react";
import { BookOpen, Images, LogOut, Play, RotateCcw } from "lucide-react";
import { courseNotes, createInitialGameState, endings, getStation, initialGameState } from "./data/gameData";
import { clearSavedGame, getSavedGame, normalizeGameState, saveGame } from "./data/gameEngine";
import type { DifficultyLevel, GameState } from "./types/game";
import MainMenu from "./components/MainMenu";
import GameLayout from "./components/GameLayout";
import CourseNotes from "./components/CourseNotes";
import Gallery from "./components/Gallery";
import EndingScreen from "./components/EndingScreen";
import AmbientSound from "./components/AmbientSound";
import AuthScreen from "./components/AuthScreen";
import {
  AuthUser,
  clearAuthToken,
  clearRemoteGame,
  getAuthToken,
  getCurrentUser,
  getRemoteSave,
  saveRemoteGame,
} from "./api/auth";

type Screen = "menu" | "game" | "notes" | "gallery" | "ending";
export type TutorialStep = "difficulty" | "start" | "choice" | "resources" | "recap" | "log";

const introSeenKey = "cms-redux-intro-seen";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(getAuthToken()));
  const [saveHydrated, setSaveHydrated] = useState(false);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [screen, setScreen] = useState<Screen>("menu");
  const [showIntro, setShowIntro] = useState(() => localStorage.getItem(introSeenKey) !== "true");
  const [tutorialStep, setTutorialStep] = useState<TutorialStep | null>(null);
  const [hasRemoteSave, setHasRemoteSave] = useState(false);
  const hasSave = useMemo(() => hasRemoteSave || Boolean(gameState.completedStations.length) || gameState.stationId !== initialGameState.stationId, [gameState, hasRemoteSave]);

  useEffect(() => {
    if (!getAuthToken()) {
      setIsAuthLoading(false);
      return;
    }

    let isMounted = true;
    Promise.all([getCurrentUser(), getRemoteSave()])
      .then(([currentUser, remoteSave]) => {
        if (!isMounted) return;
        setUser(currentUser);
        setGameState(remoteSave ? normalizeGameState(remoteSave) : initialGameState);
        setHasRemoteSave(Boolean(remoteSave));
        if (remoteSave?.endingId) setScreen("ending");
      })
      .catch(() => {
        clearAuthToken();
        if (!isMounted) return;
        setUser(null);
      })
      .finally(() => {
        if (!isMounted) return;
        setSaveHydrated(true);
        setIsAuthLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user || !saveHydrated) return;
    saveGame(gameState);
    setHasRemoteSave(true);
    void saveRemoteGame(gameState);
    if (gameState.endingId) setScreen("ending");
  }, [gameState, saveHydrated, user]);

  const handleAuthenticated = async (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    setIsAuthLoading(true);
    try {
      const remoteSave = await getRemoteSave();
      const localSave = getSavedGame();
      const nextSave = remoteSave ?? localSave ?? initialGameState;
      setGameState(normalizeGameState(nextSave));
      setHasRemoteSave(Boolean(remoteSave ?? localSave));
      if (!remoteSave && localSave) await saveRemoteGame(localSave);
      if (nextSave.endingId) setScreen("ending");
      else setScreen("menu");
    } finally {
      setSaveHydrated(true);
      setIsAuthLoading(false);
    }
  };

  const startNew = (difficulty: DifficultyLevel = "gentle") => {
    clearSavedGame();
    void clearRemoteGame();
    setHasRemoteSave(false);
    setGameState(createInitialGameState(difficulty));
    setScreen("game");
    if (tutorialStep === "start") setTutorialStep("choice");
  };

  const resetGame = () => {
    if (confirm("Reset the journey and clear the saved game?")) startNew(gameState.difficulty);
  };

  const closeIntro = () => {
    localStorage.setItem(introSeenKey, "true");
    setShowIntro(false);
  };

  const startTutorial = () => {
    closeIntro();
    setScreen("menu");
    setTutorialStep("difficulty");
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    setSaveHydrated(false);
    setHasRemoteSave(false);
    setGameState(initialGameState);
    setScreen("menu");
  };

  const ending = endings.find((item) => item.id === gameState.endingId);
  const currentStation = getStation(gameState.stationId);

  if (isAuthLoading) {
    return (
      <div className="app-shell">
        <div className="stars" />
        <main className="loading-panel glass">Loading your account...</main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-shell">
        <div className="stars" />
        <AuthScreen onAuthenticated={handleAuthenticated} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="stars" />
      <header className="topbar">
        <button className="brand" onClick={() => setScreen("menu")}>
          <img className="brand-logo" src="/images/cms-redux-logo.png" alt="CMS Redux" />
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
          <button onClick={logout}>
            <LogOut size={16} /> Sign Out
          </button>
        </nav>
      </header>
      <p className="user-chip">Signed in as {user.name}</p>
      <AmbientSound stationId={currentStation.id} />

      {screen === "menu" && (
        <MainMenu
          hasSave={hasSave}
          stationTitle={currentStation.title}
          onStart={startNew}
          onContinue={() => setScreen(gameState.endingId ? "ending" : "game")}
          onNotes={() => setScreen("notes")}
          onGallery={() => setScreen("gallery")}
          onShowIntro={() => setShowIntro(true)}
          onStartTutorial={startTutorial}
          tutorialStep={tutorialStep}
          setTutorialStep={setTutorialStep}
        />
      )}
      {screen === "game" && (
        <GameLayout
          gameState={gameState}
          setGameState={setGameState}
          tutorialStep={tutorialStep}
          setTutorialStep={setTutorialStep}
        />
      )}
      {screen === "notes" && <CourseNotes notes={courseNotes} gameState={gameState} />}
      {screen === "gallery" && <Gallery />}
      {screen === "ending" && ending && <EndingScreen gameState={gameState} ending={ending} onRestart={() => startNew(gameState.difficulty)} />}

      {showIntro && (
        <div className="intro-overlay" role="dialog" aria-modal="true" aria-labelledby="intro-title">
          <section className="intro-modal glass">
            <img className="intro-logo" src="/images/cms-redux-logo.png" alt="CMS Redux" />
            <p className="eyebrow">Introduction</p>
            <h2 id="intro-title">Welcome to CMS Redux Trail</h2>
            <p className="intro-warning">Please do not share this with anyone who has not subscribed to CMS Redux.</p>
            <p>
              This experience has been especially designed for those who have completed the last 11 sessions. It is not
              your average "choose your own adventure" game. Much like Tohu Wa Bohu, this is a journey that might be hard
              to define - hidden from those who do not seek, but filled with familiar signs and symbols for those who have
              walked the path.
            </p>
            <p>
              There are multiple endings to this journey, and none of them should be seen as simply "wrong." The goal - if
              there ever was one - is to stop clutching, grabbing, reacting, and acting from wrath. Instead, the journey
              invites you to notice, release, and return with a different kind of awareness.
            </p>
            <p>
              This was designed as a fun experiment for those who have been following CMS Redux - a new way to jog your
              memory, revisit familiar lessons, and experience the material in a more playful, interactive form.
            </p>
            <p>
              As you play, you may recognize certain elements from the sessions, woven into the story in a way that invites
              reflection, discovery, and deeper perception.
            </p>
            <p>
              Also, please remember that this is the first time we are creating something like this, so there may still be
              a few errors or rough edges. Thank you for approaching it with grace, curiosity, and the same spirit of
              exploration that brought you this far.
            </p>
            <div className="intro-actions">
              <button className="primary action" onClick={startTutorial}>
                Start Tutorial Mission
              </button>
              <button className="action" onClick={closeIntro}>
                Enter Without Tutorial
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
