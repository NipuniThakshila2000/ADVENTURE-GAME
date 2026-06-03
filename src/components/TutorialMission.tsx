import { useState } from "react";
import { ArrowRight, CheckCircle, HelpCircle, Map, RotateCcw } from "lucide-react";

const tutorialSteps = [
  {
    eyebrow: "Tutorial Mission",
    title: "How this journey works",
    body:
      "This is a choose-your-own-adventure learning trail. Read the scene, choose an action, and notice how the journey responds.",
    choices: ["Show me a sample station"],
  },
  {
    eyebrow: "Sample Station",
    title: "The Practice Gate",
    body:
      "A station gives you a short story, a lesson reminder, and several choices. In the real journey, steady choices move you forward.",
    choices: ["Choose the steady path", "Try a sample detour"],
  },
  {
    eyebrow: "Sample De Tour",
    title: "When a choice leaves the trail",
    body:
      "Some choices do not lead toward stillness or the dazzling darkness. They pause the journey and ask you to review the lesson.",
    choices: ["Continue to a practice checkpoint"],
  },
  {
    eyebrow: "Practice Checkpoint",
    title: "Mock review question",
    body:
      "Tutorial questions are only practice. Any answer here moves the tutorial forward, so you can learn the flow without changing your real progress.",
    choices: ["Return gently to the lesson", "Rush ahead", "Make the detour the whole story"],
  },
  {
    eyebrow: "Trail Tools",
    title: "What to watch while playing",
    body:
      "The real game includes trail markers, resources, lesson recaps, and a journey log. These help you remember what happened and why.",
    choices: ["Finish tutorial"],
  },
  {
    eyebrow: "Tutorial Complete",
    title: "You are ready to enter the trail",
    body:
      "The tutorial did not affect your saved game. Start the real journey when you are ready, and return with attention.",
    choices: [],
  },
];

export default function TutorialMission({ onExit }: { onExit: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = tutorialSteps[stepIndex];
  const complete = stepIndex === tutorialSteps.length - 1;

  const advance = () => {
    setStepIndex((value) => Math.min(value + 1, tutorialSteps.length - 1));
  };

  return (
    <main className="tutorial-page">
      <section className="glass tutorial-stage">
        <div className="tutorial-scene" style={{ backgroundImage: "url(/images/cover.png)" }}>
          <div>
            <p className="eyebrow">
              <Map size={15} /> Mock Mission
            </p>
            <h1>CMS Redux Trail Tutorial</h1>
          </div>
        </div>
        <div className="tutorial-body">
          <p className="eyebrow">
            {complete ? <CheckCircle size={15} /> : <HelpCircle size={15} />}
            {step.eyebrow}
          </p>
          <h2>{step.title}</h2>
          <p>{step.body}</p>
          <div className="tutorial-progress" aria-label={`Tutorial step ${stepIndex + 1} of ${tutorialSteps.length}`}>
            {tutorialSteps.map((item, index) => (
              <span key={item.title} className={index <= stepIndex ? "active" : ""} />
            ))}
          </div>
          {step.choices.length > 0 ? (
            <div className="choices">
              {step.choices.map((choice) => (
                <button key={choice} className="choice-button" onClick={advance}>
                  <span>{choice}</span>
                  <ArrowRight size={18} />
                </button>
              ))}
            </div>
          ) : (
            <div className="tutorial-actions">
              <button className="primary action" onClick={onExit}>
                Return to Main Menu
              </button>
              <button className="action" onClick={() => setStepIndex(0)}>
                <RotateCcw size={18} /> Replay Tutorial
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
