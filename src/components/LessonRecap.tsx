import { courseNotes, getNoteForStation } from "../data/gameData";
import type { Station } from "../types/game";

export default function LessonRecap({ station, unlockedNotes }: { station: Station; unlockedNotes: string[] }) {
  const note = getNoteForStation(station.id);
  const unlockedCount = courseNotes.filter((item) => unlockedNotes.includes(item.id)).length;
  return (
    <section className="glass panel">
      <h2>Lesson Recap</h2>
      {note ? (
        <>
          <p className="note-title">{note.keyConcept}</p>
          <p>{note.plainExplanation}</p>
          <p className="memory">“{note.memoryPhrase}”</p>
        </>
      ) : (
        <p>Choose a station action to unlock a recap.</p>
      )}
      <p className="small">{unlockedCount} of {courseNotes.length} notes unlocked</p>
    </section>
  );
}
