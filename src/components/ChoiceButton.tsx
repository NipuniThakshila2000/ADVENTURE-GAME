import { ChevronRight } from "lucide-react";
import type { Choice } from "../types/game";

export default function ChoiceButton({ choice, displayLabel, onClick }: { choice: Choice; displayLabel?: string; onClick: () => void }) {
  return (
    <button className="choice-button" onClick={onClick}>
      <span>{displayLabel ?? choice.label}</span>
      <ChevronRight size={18} />
    </button>
  );
}
