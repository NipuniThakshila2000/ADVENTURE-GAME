import { HelpCircle } from "lucide-react";
import type { QuizQuestion } from "../types/game";

export default function QuizCard({
  question,
  onAnswer,
  compact = false,
}: {
  question: QuizQuestion;
  onAnswer: (selectedIndex: number) => void;
  compact?: boolean;
}) {
  return (
    <article className={`${compact ? "" : "glass"} quiz-card ${compact ? "compact" : ""}`}>
      <p className="eyebrow"><HelpCircle size={16} /> Quiz Checkpoint</p>
      <h2>{question.question}</h2>
      <div className="choices">
        {question.options.map((option, index) => (
          <button key={option} className="choice-button" onClick={() => onAnswer(index)}>
            <span>{option}</span>
          </button>
        ))}
      </div>
    </article>
  );
}
