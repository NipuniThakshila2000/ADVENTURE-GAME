import { finalScore } from "../data/gameEngine";
import { resourceLabels } from "../data/gameData";
import type { Ending, GameState } from "../types/game";

export default function EndingScreen({ gameState, ending, onRestart }: { gameState: GameState; ending: Ending; onRestart: () => void }) {
  const score = finalScore(gameState.resources, gameState.quizHistory);
  return (
    <main className="ending-page glass">
      <p className="eyebrow">Day {gameState.day} · Ending</p>
      <h1>{ending.title}</h1>
      <p>{ending.message}</p>
      <div className="score">{score}</div>
      <p className="small">Final score</p>
      <div className="ending-lists">
        <section>
          <h2>Remembered Well</h2>
          {ending.remembered.map((key) => <p key={key}>{resourceLabels[key]}: {gameState.resources[key]}</p>)}
        </section>
        <section>
          <h2>Revise Next</h2>
          {ending.revise.map((key) => <p key={key}>{resourceLabels[key]}: {gameState.resources[key]}</p>)}
        </section>
      </div>
      <button className="primary action" onClick={onRestart}>Start Again</button>
    </main>
  );
}
