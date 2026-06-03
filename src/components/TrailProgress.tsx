import { Map } from "lucide-react";
import { stations } from "../data/gameData";
import { stationProgress } from "../data/gameEngine";

export default function TrailProgress({ stationId }: { stationId: string }) {
  const progress = stationProgress(stationId);
  const currentIndex = Math.max(0, stations.findIndex((station) => station.id === stationId));
  return (
    <section className="glass trail">
      <div className="trail-head">
        <span><Map size={18} /> Trail Marker {currentIndex + 1} of {stations.length}</span>
        <span>{Math.round(progress)}% through Module 1 trail</span>
      </div>
      <div className="trail-line">
        <i style={{ width: `${Math.max(progress, 3)}%` }} />
        {stations.map((station, index) => (
          <span
            key={station.id}
            className={station.id === stationId ? "active" : ""}
            style={{ left: `${stationProgress(station.id)}%` }}
            title={`Marker ${index + 1}: ${station.title}`}
          >
            {index + 1}
          </span>
        ))}
      </div>
      <div className="day-range">Follow the trail markers. Detours return you to the same marker.</div>
    </section>
  );
}
