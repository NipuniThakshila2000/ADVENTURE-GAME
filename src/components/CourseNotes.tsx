import type { CourseNote, GameState } from "../types/game";

export default function CourseNotes({ notes, gameState }: { notes: CourseNote[]; gameState: GameState }) {
  return (
    <main className="content-page">
      <section className="page-heading glass">
        <p className="eyebrow">Course Notes</p>
        <h1>Unlocked Lesson Summaries</h1>
        <p>Review key terms, memory phrases, reflection questions, and quiz history from the journey.</p>
      </section>
      <section className="notes-grid">
        {notes.map((note) => {
          const unlocked = gameState.unlockedNotes.includes(note.id);
          return (
            <article className={`glass note-card ${unlocked ? "" : "locked"}`} key={note.id}>
              <p className="eyebrow">{unlocked ? "Unlocked" : "Locked"}</p>
              <h2>{note.title}</h2>
              {unlocked ? (
                <>
                  <p><strong>Key concept:</strong> {note.keyConcept}</p>
                  <p>{note.plainExplanation}</p>
                  <p className="memory">“{note.memoryPhrase}”</p>
                  <p><strong>Reflection:</strong> {note.reflectionQuestion}</p>
                </>
              ) : (
                <p>Reach this station to unlock the summary.</p>
              )}
            </article>
          );
        })}
      </section>
      <section className="glass panel quiz-history">
        <h2>Quiz History</h2>
        {gameState.quizHistory.length === 0 ? (
          <p>No quiz checkpoints completed yet.</p>
        ) : (
          gameState.quizHistory.map((item, index) => (
            <p key={`${item.question}-${index}`}>
              <strong>{item.correct ? "Remembered" : "Review"}:</strong> {item.question}
            </p>
          ))
        )}
      </section>
    </main>
  );
}
