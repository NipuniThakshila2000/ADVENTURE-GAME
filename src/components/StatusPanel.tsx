import { resourceLabels } from "../data/gameData";
import type { GameState, ResourceKey } from "../types/game";

const resourceOrder: ResourceKey[] = ["consistency", "clarity", "rest", "openness", "discernment", "compassion", "focus", "recall"];

export default function StatusPanel({ resources }: { resources: GameState["resources"] }) {
  return (
    <section className="glass panel">
      <h2>Status</h2>
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
