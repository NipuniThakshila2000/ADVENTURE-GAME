import type { Choice, Station } from "../types/game";
import ChoiceButton from "./ChoiceButton";

type StationLike = Pick<Station, "title" | "story"> & { subtitle?: string; lesson?: string; choices: Choice[] };

export default function StationCard({
  stationLike,
  imageKey,
  isEvent = false,
  onChoice,
}: {
  stationLike: StationLike;
  imageKey: string;
  isEvent?: boolean;
  onChoice: (choiceId: string) => void;
}) {
  return (
    <article className="glass station-card">
      <div className="scene" style={{ backgroundImage: `url(/images/${imageKey}.png)` }}>
        <div className="scene-fallback">
          <span>{isEvent ? "Trail Event" : stationLike.title}</span>
        </div>
      </div>
      <div className="station-content">
        <p className="eyebrow">{isEvent ? "Random Event" : stationLike.subtitle}</p>
        <h2>{stationLike.title}</h2>
        <p>{stationLike.story}</p>
        {!isEvent && <p className="lesson-line">{stationLike.lesson}</p>}
        <div className="choices">
          {stationLike.choices.map((choice) => (
            <ChoiceButton key={choice.id} choice={choice} onClick={() => onChoice(choice.id)} />
          ))}
        </div>
      </div>
    </article>
  );
}
