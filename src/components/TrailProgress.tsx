import { Map } from "lucide-react";
import { stations } from "../data/gameData";
import { stationProgress } from "../data/gameEngine";

export default function TrailProgress({ stationId, day }: { stationId: string; day: number }) {
  const progress = stationProgress(stationId);
  return (
    <section className="glass trail">
      <div className="trail-head">
        <span><Map size={18} /> Day {day} of 90</span>
        <span>{Math.round(progress)}% through Module 1 trail</span>
      </div>
      <div className="trail-line">
        <i style={{ width: `${Math.max(progress, 3)}%` }} />
        {stations.map((station) => (
          <span
            key={station.id}
            className={station.id === stationId ? "active" : ""}
            style={{ left: `${stationProgress(station.id)}%` }}
            title={station.title}
          />
        ))}
      </div>
      <div className="day-range">Day 1 to Day 90</div>
    </section>
  );
}
