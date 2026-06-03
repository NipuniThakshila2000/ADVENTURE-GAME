import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  body: string;
  position?: "left" | "right" | "top" | "bottom";
  onNext?: () => void;
  nextLabel?: string;
};

export default function TutorialCallout({ title, body, position = "right", onNext, nextLabel = "Next" }: Props) {
  return (
    <div className={`tutorial-callout ${position}`}>
      <span className="tutorial-arrow" aria-hidden="true">
        <ArrowRight size={28} />
      </span>
      <strong>{title}</strong>
      <p>{body}</p>
      {onNext && (
        <button className="tutorial-next" onClick={onNext}>
          {nextLabel}
        </button>
      )}
    </div>
  );
}
