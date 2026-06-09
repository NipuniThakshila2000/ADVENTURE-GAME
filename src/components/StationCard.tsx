import type { Choice, Station } from "../types/game";
import type { DifficultyLevel } from "../types/game";
import { getChoiceDisplayLabel } from "../data/gameEngine";
import ChoiceButton from "./ChoiceButton";

type StationLike = Pick<Station, "title" | "story"> & { subtitle?: string; lesson?: string; choices: Choice[] };

export default function StationCard({
  stationLike,
  imageKey,
  isEvent = false,
  difficulty,
  onChoice,
}: {
  stationLike: StationLike;
  imageKey: string;
  isEvent?: boolean;
  difficulty: DifficultyLevel;
  onChoice: (choiceId: string) => void;
}) {
  return (
    <article className="glass station-card">
      <div className="scene" style={{ backgroundImage: `url(/images/${imageKey}.png)` }} />
      <div className="station-content">
        <p className="eyebrow">{isEvent ? "Random Event" : stationLike.subtitle}</p>
        <h2>{stationLike.title}</h2>
        <p>{stationLike.story}</p>
        {!isEvent && <p className="lesson-line">{stationLike.lesson}</p>}
        <div className="choices">
          {stationLike.choices.map((choice, index) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              displayLabel={getChoiceDisplayLabel(choice, difficulty, index)}
              onClick={() => onChoice(choice.id)}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
