import { resourceLabels } from "../data/gameData";
import { difficultySettings } from "../data/gameData";
import type { DifficultyLevel, GameState, ResourceKey } from "../types/game";

const resourceOrder: ResourceKey[] = ["consistency", "clarity", "rest", "openness", "discernment", "compassion", "focus", "recall"];

export default function StatusPanel({ resources, difficulty }: { resources: GameState["resources"]; difficulty: DifficultyLevel }) {
  return (
    <section className="glass panel">
      <h2>Status</h2>
      <p className="difficulty-badge">{difficultySettings[difficulty].title}</p>
      <div className="resource-list">
        {resourceOrder.map((key) => (
          <div className="resource" key={key}>
            <span>
              {resourceLabels[key]} <strong>{resources[key]}</strong>
            </span>
            <div className="bar">
              <i style={{ width: `${resources[key]}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
