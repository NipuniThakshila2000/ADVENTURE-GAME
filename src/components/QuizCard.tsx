import { HelpCircle } from "lucide-react";
import type { QuizQuestion } from "../types/game";

export default function QuizCard({ question, onAnswer }: { question: QuizQuestion; onAnswer: (selectedIndex: number) => void }) {
  return (
    <article className="glass quiz-card">
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
