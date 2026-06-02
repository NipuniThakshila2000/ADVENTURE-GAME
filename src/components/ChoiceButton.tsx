import { ChevronRight } from "lucide-react";
import type { Choice } from "../types/game";

export default function ChoiceButton({ choice, onClick }: { choice: Choice; onClick: () => void }) {
  return (
    <button className="choice-button" onClick={onClick}>
      <span>{choice.label}</span>
      <ChevronRight size={18} />
    </button>
  );
}
