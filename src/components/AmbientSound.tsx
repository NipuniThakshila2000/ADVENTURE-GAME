import { useEffect, useMemo, useRef, useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";

type Mood = "peaceful" | "dark";

type Track = {
  title: string;
  src: string;
  mood: Mood;
};

const musicEnabledKey = "cms-redux-music-enabled";

const tracks: Track[] = [
  { title: "Alonia", src: "/sounds/alonia.mp3", mood: "peaceful" },
  { title: "Calming Crystals", src: "/sounds/calming-crystals.mp3", mood: "peaceful" },
  { title: "Edge of Ocean Reefs", src: "/sounds/edge-ocean-reefs.mp3", mood: "peaceful" },
  { title: "Margin", src: "/sounds/margin.mp3", mood: "peaceful" },
  { title: "Woodwind Reviere", src: "/sounds/woodwind-reviere.mp3", mood: "peaceful" },
  { title: "Dark Secrets", src: "/sounds/dark-secrets.mp3", mood: "dark" },
  { title: "How Did We Get Here", src: "/sounds/how-did-we-get-here.mp3", mood: "dark" },
];

const stationMood: Record<string, Mood> = {
  "gate-of-commitment": "peaceful",
  "ninety-day-road": "peaceful",
  "calendar-table": "peaceful",
  "first-stillness": "peaceful",
  "circus-witness": "dark",
  "mirror-room": "dark",
  "field-of-openness": "peaceful",
  "feathered-border": "peaceful",
  "wobble-bubble": "dark",
  "movement-of-heart": "dark",
  "matter-is-mind": "dark",
  "inner-temple-threshold": "peaceful",
};

function selectTrack(mood: Mood, stationId: string) {
  const choices = tracks.filter((track) => track.mood === mood);
  const index = Math.abs(stationId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % choices.length;
  return choices[index];
}

function fadeAudio(audio: HTMLAudioElement, target: number, duration = 1800, onDone?: () => void) {
  const start = audio.volume;
  const startTime = performance.now();
  const tick = () => {
    const progress = Math.min((performance.now() - startTime) / duration, 1);
    audio.volume = start + (target - start) * progress;
    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }
    onDone?.();
  };
  requestAnimationFrame(tick);
}

export default function AmbientSound({ stationId }: { stationId: string }) {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(musicEnabledKey) === "true");
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const [currentTitle, setCurrentTitle] = useState("Music ready");
  const audioARef = useRef<HTMLAudioElement>(null);
  const audioBRef = useRef<HTMLAudioElement>(null);

  const mood = stationMood[stationId] ?? "peaceful";
  const track = useMemo(() => selectTrack(mood, stationId), [mood, stationId]);

  useEffect(() => {
    localStorage.setItem(musicEnabledKey, String(enabled));
    if (!enabled) {
      [audioARef, audioBRef].forEach((ref) => {
        if (!ref.current) return;
        fadeAudio(ref.current, 0, 500, () => ref.current?.pause());
      });
      setCurrentTitle("Music off");
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const nextSlot = activeSlot === 0 ? 1 : 0;
    const current = activeSlot === 0 ? audioARef.current : audioBRef.current;
    const next = nextSlot === 0 ? audioARef.current : audioBRef.current;
    if (!next) return;

    next.src = track.src;
    next.loop = true;
    next.volume = 0;

    next
      .play()
      .then(() => {
        fadeAudio(next, 0.42);
        if (current) fadeAudio(current, 0, 1800, () => current.pause());
        setActiveSlot(nextSlot);
        setCurrentTitle(track.title);
      })
      .catch(() => {
        setEnabled(false);
        setCurrentTitle("Click to start music");
      });
  }, [track, enabled]);

  const toggleMusic = () => {
    setEnabled((value) => !value);
  };

  return (
    <div className="ambient-player" aria-label="Ambient music player">
      <audio ref={audioARef} preload="auto" />
      <audio ref={audioBRef} preload="auto" />
      <button className={enabled ? "enabled" : ""} onClick={toggleMusic}>
        {enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        <span>{enabled ? "Music On" : "Music Off"}</span>
      </button>
      <span className={`mood-pill ${mood}`}>
        <Music size={14} />
        {mood === "peaceful" ? "Peaceful" : "Dark"} - {currentTitle}
      </span>
    </div>
  );
}
