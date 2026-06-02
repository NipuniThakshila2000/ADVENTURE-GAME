export default function JourneyLog({ log }: { log: string[] }) {
  return (
    <section className="glass panel log-panel">
      <h2>Journey Log</h2>
      <ol>
        {log.map((entry, index) => (
          <li key={`${entry}-${index}`}>{entry}</li>
        ))}
      </ol>
    </section>
  );
}
