import type { Choice, CourseNote, Ending, GameState, RandomEvent, ResourceKey, Station } from "../types/game";

export const resourceLabels: Record<ResourceKey, string> = {
  consistency: "Consistency",
  clarity: "Clarity",
  rest: "Rest",
  openness: "Openness",
  discernment: "Discernment",
  compassion: "Compassion",
  focus: "Focus",
  recall: "Recall",
};

export const initialResources: GameState["resources"] = {
  consistency: 60,
  clarity: 50,
  rest: 55,
  openness: 45,
  discernment: 45,
  compassion: 50,
  focus: 50,
  recall: 40,
};

export const initialGameState: GameState = {
  day: 1,
  stationId: "gate-of-commitment",
  resources: initialResources,
  log: ["Day 1: You arrive at the Gate of Commitment and begin with intention."],
  unlockedNotes: [],
  completedStations: [],
  quizHistory: [],
};

const commonCorrect = { clarity: 4, recall: 6 };
const commonWrong = { clarity: -3, recall: 1, rest: -2 };

export const stations: Station[] = [
  {
    id: "gate-of-commitment",
    dayRange: [1, 7],
    title: "The Gate of Commitment",
    subtitle: "Seriousness before speed",
    imageKey: "gate-of-commitment",
    story:
      "The path begins at a quiet threshold. Nothing dramatic demands your attention. The first invitation is simple: do not treat the journey casually. Enter with humility, attention, and a willingness to practice steadily.",
    lesson:
      "This course begins with intention and commitment. The participant is asked to bring attention to the work rather than consume it as a passing curiosity.",
    choices: [
      {
        id: "commit-review",
        label: "Review the commitment before beginning",
        resultText: "You slow down enough to remember why you are here.",
        effects: { consistency: 8, discernment: 6 },
      },
      {
        id: "commit-rush",
        label: "Rush forward without preparing",
        resultText: "Movement begins, but your coordinates feel thin.",
        effects: { focus: -7, clarity: -5 },
        miniStorylineId: "spectacle-path",
      },
      {
        id: "commit-perfect",
        label: "Wait until everything feels perfect",
        resultText: "You rest for a moment, but the trail asks for faithful beginnings.",
        effects: { consistency: -6, rest: 3 },
      },
    ],
  },
  {
    id: "ninety-day-road",
    dayRange: [8, 14],
    title: "The 90-Day Road",
    subtitle: "Twenty minutes, repeated",
    imageKey: "cover",
    story:
      "A long luminous road opens before you. It does not ask for intensity as much as return. The course rhythm is daily, modest, and compounded over time.",
    lesson:
      "The 90-day journey is built through 20 minutes of daily practice. Repetition gives the material a place to become familiar.",
    choices: [
      {
        id: "daily-rhythm",
        label: "Set a daily 20-minute rhythm",
        resultText: "Your practice becomes small enough to repeat and serious enough to matter.",
        effects: { consistency: 10, focus: 8, recall: 5 },
      },
      {
        id: "only-inspired",
        label: "Do it only when inspired",
        resultText: "The trail feels open, but the rhythm begins to fade.",
        effects: { consistency: -8, openness: 2 },
        miniStorylineId: "no-calendar-drift",
      },
      {
        id: "force-long",
        label: "Try to force long sessions immediately",
        resultText: "Your focus spikes, but the pace is heavier than the lesson requires.",
        effects: { rest: -8, focus: 3 },
        miniStorylineId: "over-forcing-path",
      },
    ],
    quiz: [
      {
        question: "What is the basic rhythm emphasized in the course?",
        options: ["A dramatic weekly breakthrough", "20 minutes daily as a compounded practice", "Only practice when deeply inspired"],
        correctIndex: 1,
        explanation: "The course emphasizes 20 minutes daily as a steady, compounded practice.",
        effectsCorrect: commonCorrect,
        effectsWrong: commonWrong,
      },
    ],
  },
  {
    id: "calendar-table",
    dayRange: [15, 21],
    title: "The Calendar Table",
    subtitle: "Coordinates for a formless process",
    imageKey: "calendar-table",
    story:
      "A journal lies open beneath a warm lamp. The blank calendar is not a cage. It is a set of coordinates that helps your intention find a path through ordinary days.",
    lesson:
      "Planning is not the opposite of being led. A realistic schedule gives direction and helps the participant avoid drifting.",
    choices: [
      {
        id: "fixed-time",
        label: "Choose a fixed daily practice time",
        resultText: "The day now has a clear place for the work.",
        effects: { focus: 8, consistency: 7 },
      },
      {
        id: "leave-vague",
        label: "Leave it vague and hope it happens",
        resultText: "The intention is sincere, but it has no coordinates.",
        effects: { focus: -8, consistency: -7 },
        miniStorylineId: "no-calendar-drift",
      },
      {
        id: "realistic-goal",
        label: "Set a realistic goal with one grace day",
        resultText: "You choose a rhythm that has structure and mercy.",
        effects: { consistency: 7, rest: 5 },
      },
    ],
  },
  {
    id: "first-stillness",
    dayRange: [22, 28],
    title: "The First Stillness",
    subtitle: "Watching instead of fighting",
    imageKey: "first-stillness",
    story:
      "In a quiet room, thoughts appear like small lights at the edge of attention. The lesson is not to destroy them. The lesson is to stop being carried away by them.",
    lesson:
      "The practice is not mainly about forcing the mind to have no thoughts. It is about watching without becoming immersed.",
    choices: [
      {
        id: "suppress-thoughts",
        label: "Try to suppress every thought",
        resultText: "The effort tightens the room and makes the thoughts feel louder.",
        effects: { rest: -7, clarity: -6 },
        miniStorylineId: "over-forcing-path",
      },
      {
        id: "watch-thought",
        label: "Watch the thought without entering it",
        resultText: "The thought remains present, but it is no longer the whole field.",
        effects: { discernment: 8, openness: 6 },
      },
      {
        id: "follow-story",
        label: "Follow every thought until it becomes a story",
        resultText: "The practice dissolves into narration.",
        effects: { focus: -7, openness: -5 },
        miniStorylineId: "clutching-loop",
      },
    ],
    quiz: [
      {
        question: "Is the practice mainly about forcing the mind to have no thoughts?",
        options: ["Yes, thoughts must be eliminated", "No, it is about watching without being immersed", "Only if the thoughts are distracting"],
        correctIndex: 1,
        explanation: "The course points toward watching without being immersed, not forcing a blank mind.",
        effectsCorrect: commonCorrect,
        effectsWrong: commonWrong,
      },
    ],
  },
  {
    id: "circus-witness",
    dayRange: [29, 35],
    title: "The Circus and the Witness",
    subtitle: "At the edge of the act",
    imageKey: "witness-seat",
    story:
      "A stage of movement appears before you: juggling, balancing, noise, momentum. Then you notice the still seat at the edge. From there, the whole movement can be seen.",
    lesson:
      "The witness image teaches separation from automatic immersion. Awareness can observe movement without becoming the movement.",
    choices: [
      {
        id: "become-witness",
        label: "Become the witness at the edge of the circus",
        resultText: "You find a stable place from which the movement can be observed.",
        effects: { discernment: 9, clarity: 6 },
      },
      {
        id: "control-act",
        label: "Jump back into the act and try to control everything",
        resultText: "Control becomes another performance.",
        effects: { openness: -7, rest: -6 },
        miniStorylineId: "clutching-loop",
      },
      {
        id: "observe-tent",
        label: "Observe the whole tent, not only one act",
        resultText: "Attention widens and the parts lose some of their grip.",
        effects: { openness: 7, recall: 4 },
      },
    ],
  },
  {
    id: "mirror-room",
    dayRange: [36, 42],
    title: "The Mirror Room",
    subtitle: "Reflection without reaction",
    imageKey: "mirror-room",
    story:
      "A simple mirror stands in a quiet room. It receives what appears without immediately naming it, fighting it, or turning it into a story.",
    lesson:
      "The mirror represents reflecting without immediately reacting or giving meaning. This strengthens the gap between perception and automatic response.",
    choices: [
      {
        id: "reflect-slowly",
        label: "Reflect without rushing to meaning",
        resultText: "The image can appear without demanding a conclusion.",
        effects: { openness: 8, discernment: 7 },
      },
      {
        id: "label-all",
        label: "Label every sound and image immediately",
        resultText: "The mirror becomes covered with labels before it can reflect.",
        effects: { openness: -7, clarity: -5 },
        miniStorylineId: "clutching-loop",
      },
      {
        id: "notice-return",
        label: "Notice the reaction, then return to reflection",
        resultText: "Even the reaction becomes something you can observe.",
        effects: { discernment: 7, rest: 4 },
      },
    ],
    quiz: [
      {
        question: "What does the mirror represent?",
        options: ["Reflecting without immediately reacting or giving meaning", "Trying to become impressive", "Finding hidden symbols in every thought"],
        correctIndex: 0,
        explanation: "The mirror reflects without rushing into reaction, judgment, or meaning.",
        effectsCorrect: commonCorrect,
        effectsWrong: commonWrong,
      },
    ],
  },
  {
    id: "field-of-openness",
    dayRange: [43, 49],
    title: "The Field of Openness",
    subtitle: "Before fixed definition",
    imageKey: "field-of-openness",
    story:
      "The trail opens into a wide field. It cannot be reduced to a normal object. The invitation is to remain with openness without turning it into spectacle.",
    lesson:
      "The field, scape, or void is taught here as openness and stillness, not fantasy. Definitions loosen so attention can become less cramped.",
    choices: [
      {
        id: "sit-openness",
        label: "Sit with openness without trying to define it",
        resultText: "The field remains spacious because you do not force it into a small box.",
        effects: { openness: 9, clarity: 5 },
      },
      {
        id: "demand-definition",
        label: "Demand a precise definition before continuing",
        resultText: "Recall improves slightly, but openness contracts.",
        effects: { openness: -7, recall: 2 },
        miniStorylineId: "clutching-loop",
      },
      {
        id: "make-spectacle",
        label: "Turn the concept into a spectacle",
        resultText: "The lesson grows noisy and loses its subtlety.",
        effects: { discernment: -7, clarity: -6 },
        miniStorylineId: "spectacle-path",
      },
    ],
  },
  {
    id: "feathered-border",
    dayRange: [50, 56],
    title: "The Feathered Border",
    subtitle: "Softening the edge",
    imageKey: "feathered-border",
    story:
      "A hard line appears between thought and world, name and object, self and reaction. You are invited to let the edge become softer without pretending it was never there.",
    lesson:
      "Feathering means softening the borders of a thought, object, or definition so the participant does not clutch it as final reality.",
    choices: [
      {
        id: "soften-edge",
        label: "Soften the edge of the thought",
        resultText: "The border loosens and the thought becomes less opaque.",
        effects: { openness: 8, discernment: 6, recall: 5 },
      },
      {
        id: "name-repeat",
        label: "Make the thought heavier by naming it repeatedly",
        resultText: "The name becomes heavy and the border hardens.",
        effects: { openness: -8, rest: -5 },
        miniStorylineId: "clutching-loop",
      },
      {
        id: "notice-relax",
        label: "Notice the boundary, then let it relax",
        resultText: "You do not deny the boundary; you stop making it absolute.",
        effects: { clarity: 6, rest: 5 },
      },
    ],
    quiz: [
      {
        question: "What does feathering mean in this course context?",
        options: ["Softening edges or borders of a thought, object, or definition", "Decorating the practice with symbols", "Avoiding all concrete language forever"],
        correctIndex: 0,
        explanation: "Feathering softens hard borders so the participant does not clutch definitions as final.",
        effectsCorrect: commonCorrect,
        effectsWrong: commonWrong,
      },
    ],
  },
  {
    id: "wobble-bubble",
    dayRange: [57, 63],
    title: "The Wobble / Bubble",
    subtitle: "Sensitivity without panic",
    imageKey: "wobble-bubble",
    story:
      "The heart feels more sensitive. The trail seems to wobble for a moment, not as a verdict, but as part of learning how to remain gentle and steady.",
    lesson:
      "The wobble is part of the course process. Sensitivity is not treated as failure, and the participant is invited to proceed gently.",
    choices: [
      {
        id: "settle",
        label: "Pause and let the sensitivity settle",
        resultText: "Gentleness gives the wobble room to settle.",
        effects: { rest: 8, compassion: 7 },
      },
      {
        id: "call-failure",
        label: "Call the wobble a failure",
        resultText: "Judgment makes the wobble heavier than it needs to be.",
        effects: { clarity: -6, rest: -7 },
        miniStorylineId: "comparison-road",
      },
      {
        id: "gentle-practice",
        label: "Keep practicing gently without forcing",
        resultText: "The rhythm continues without turning forceful.",
        effects: { consistency: 6, discernment: 6 },
      },
    ],
  },
  {
    id: "movement-of-heart",
    dayRange: [64, 70],
    title: "The Movement of the Heart",
    subtitle: "Watching meaning arise",
    imageKey: "movement-of-heart",
    story:
      "Names and thoughts pass through the field. Some become heavy. Some seem important. Fear, surprise, shock, and other emotions can appear almost like living movements asking for the reins. You begin to watch the movement of the heart that gives weight to what appears.",
    lesson:
      "The participant observes how meaning and salience arise with the movement of the heart, without rushing into judgment. Emotions are treated symbolically as strong movements that need to be brought under disciplined guidance, like spirited horses trained by patience, attention, and firmness.",
    choices: [
      {
        id: "watch-heart",
        label: "Watch the heart move without judgment",
        resultText: "Compassion grows as the movement can be seen rather than condemned.",
        effects: { compassion: 9, discernment: 7 },
      },
      {
        id: "heavy-story",
        label: "Attach a heavy story to every feeling",
        resultText: "The feeling becomes a full world before it can be observed.",
        effects: { rest: -7, openness: -6 },
        miniStorylineId: "clutching-loop",
      },
      {
        id: "journal-note",
        label: "Notice the feeling and write a short journal note",
        resultText: "A brief note preserves recall without overbuilding the story.",
        effects: { recall: 6, compassion: 5 },
      },
      {
        id: "bring-emotion-under-guidance",
        label: "Bring fear, surprise, and shock under steady guidance",
        resultText: "The emotions are not allowed to rule the trail. You hold the reins with patience and discernment.",
        effects: { discernment: 7, focus: 5, compassion: 4 },
      },
    ],
    quiz: [
      {
        question: "In the course, what should the participant observe when thoughts or names arise?",
        options: ["The movement of the heart and the meaning it gives", "Whether every thought is immediately useful", "A dramatic sign that proves progress"],
        correctIndex: 0,
        explanation: "The lesson asks the participant to observe the movement of the heart and the meaning it gives.",
        effectsCorrect: commonCorrect,
        effectsWrong: commonWrong,
      },
      {
        question: "How should fear, surprise, shock, and other strong emotions be handled in this symbolic lesson?",
        options: [
          "Let them rule the journey immediately",
          "Bring them under patient, disciplined guidance like spirited horses",
          "Pretend they never appeared",
        ],
        correctIndex: 1,
        explanation:
          "The lesson treats strong emotions as movements that can be witnessed and brought under steady guidance rather than obeyed, feared, or suppressed.",
        effectsCorrect: { discernment: 5, compassion: 4, focus: 3, recall: 3 },
        effectsWrong: { rest: -3, clarity: -3, recall: 1 },
      },
    ],
  },
  {
    id: "matter-is-mind",
    dayRange: [71, 80],
    title: "Matter is Mind",
    subtitle: "Problems as experienced through mind",
    imageKey: "matter-is-mind",
    story:
      "A simple object rests in starlight. Then a problem appears around it: names, pressure, conclusions. You remember the sober phrase: matter is mind.",
    lesson:
      "Objects, problems, and thoughts are experienced through mind. Problems can become heavy when over-defined and clutched.",
    choices: [
      {
        id: "reduce-opacity",
        label: "See the problem as a thought-image and reduce its opacity",
        resultText: "The problem is still present, but it is no longer sealed shut.",
        effects: { clarity: 9, discernment: 7 },
      },
      {
        id: "clutch-problem",
        label: "Clutch the problem until it becomes the whole world",
        resultText: "The problem becomes opaque and fills the field.",
        effects: { openness: -9, rest: -7 },
        miniStorylineId: "clutching-loop",
      },
      {
        id: "review-before-choice",
        label: "Review the lesson before choosing",
        resultText: "Recall strengthens, though the trail waits a moment.",
        effects: { recall: 7, focus: -2 },
      },
    ],
  },
  {
    id: "inner-temple-threshold",
    dayRange: [81, 90],
    title: "The Threshold of the Inner Temple",
    subtitle: "Readiness for what follows",
    imageKey: "inner-temple-threshold",
    story:
      "A quiet doorway opens ahead. Module 1 has not made you an expert. It has trained the posture: daily return, witness, openness, feathered borders, and gentle discernment.",
    lesson:
      "The first module prepares the participant's mindset for later work by reinforcing steadiness, humility, and recall.",
    choices: [
      {
        id: "review-log",
        label: "Review the trail log before proceeding",
        resultText: "The journey becomes easier to remember because you gather its pattern.",
        effects: { recall: 8, discernment: 6 },
      },
      {
        id: "humility",
        label: "Proceed with humility and steadiness",
        resultText: "You reach the threshold without pretending to have mastered everything.",
        effects: { consistency: 6, openness: 6 },
      },
      {
        id: "rush-basics",
        label: "Rush ahead because the basics are boring",
        resultText: "The threshold remains, but your foundation thins.",
        effects: { recall: -7, discernment: -6 },
        miniStorylineId: "spectacle-path",
      },
    ],
    quiz: [
      {
        question: "Why are daily repetitions important?",
        options: ["They compound recall and make the practice steady", "They replace all need for humility", "They create instant mastery"],
        correctIndex: 0,
        explanation: "Daily repetition builds steadiness and recall over the 90-day journey.",
        effectsCorrect: commonCorrect,
        effectsWrong: commonWrong,
      },
      {
        question: "What does the witness position do?",
        options: ["It helps awareness observe thought and reaction from outside immersion", "It controls every thought perfectly", "It proves the participant is finished"],
        correctIndex: 0,
        explanation: "The witness position creates distance from automatic immersion.",
        effectsCorrect: commonCorrect,
        effectsWrong: commonWrong,
      },
      {
        question: "What does the mirror teach?",
        options: ["Reflect without immediate reaction", "Search for hidden symbols", "Judge every appearance quickly"],
        correctIndex: 0,
        explanation: "The mirror teaches reflection without rushing into reaction or meaning.",
        effectsCorrect: commonCorrect,
        effectsWrong: commonWrong,
      },
      {
        question: "What is feathering?",
        options: ["Softening hard borders and definitions", "Inventing elaborate imagery", "Forcing certainty"],
        correctIndex: 0,
        explanation: "Feathering softens the edge of a thought, object, problem, or definition.",
        effectsCorrect: commonCorrect,
        effectsWrong: commonWrong,
      },
      {
        question: "What should be done during the wobble?",
        options: ["Pause, treat sensitivity gently, and continue without forcing", "Call it failure", "Chase a dramatic experience"],
        correctIndex: 0,
        explanation: "The wobble is met with gentleness, rest, and steady practice.",
        effectsCorrect: commonCorrect,
        effectsWrong: commonWrong,
      },
    ],
  },
];

const noteData = [
  ["gate-of-commitment", "Commitment", "The course begins with attention and humility, not casual curiosity.", "Begin with intention.", "What would make my practice more intentional today?"],
  ["ninety-day-road", "The 90-Day Road", "Small daily repetition gives the course material a place to become familiar over time.", "Twenty minutes, repeated.", "Where can I protect a modest daily rhythm?"],
  ["calendar-table", "Coordinates", "Coordinates help the participant move through a formless process without drifting.", "Give intention a time and place.", "What are my coordinates for the week?"],
  ["first-stillness", "Watching Thoughts", "The practice is not thought suppression. It is learning to watch without entering every thought.", "Watch without entering.", "Which thought did I enter too quickly today?"],
  ["circus-witness", "The Witness", "The witness position helps awareness observe movement without becoming the movement.", "Sit at the edge of the act.", "Where could I become the witness instead of the performer?"],
  ["mirror-room", "The Mirror", "A mirror reflects without immediately naming, judging, or reacting.", "Reflect before reacting.", "What did I label too quickly today?"],
  ["field-of-openness", "Openness", "Openness loosens ordinary fixed definitions so attention can become spacious.", "Stay open before defining.", "Where did I demand certainty too soon?"],
  ["feathered-border", "Feathering", "Feathering means softening the hard edge of a thought, object, problem, or definition so it is not clutched as final reality.", "Soften the border; return to openness.", "Where did I rush to define something today?"],
  ["wobble-bubble", "The Wobble", "Sensitivity may feel shaky. The participant can treat it gently instead of calling it failure.", "Gentleness steadies the wobble.", "Where do I need a gentle reset?"],
  ["movement-of-heart", "Movement of the Heart", "The participant watches how the heart gives weight, meaning, and salience to thoughts, names, fear, surprise, shock, and other strong emotions. These emotions are treated symbolically as movements to bring under patient guidance, not as rulers of the trail.", "Hold the reins; watch the heart.", "Which emotion tried to take the reins today?"],
  ["matter-is-mind", "Matter is Mind", "Problems and objects are experienced through mind and can become heavier when over-defined.", "Reduce opacity.", "Which problem became opaque today?"],
  ["inner-temple-threshold", "Readiness", "Module 1 prepares the posture for later work: steadiness, humility, witness, openness, and recall.", "Stay with the process.", "What foundation do I need to revisit?"],
] as const;

export const courseNotes: CourseNote[] = noteData.map(([stationId, keyConcept, plainExplanation, memoryPhrase, reflectionQuestion]) => ({
  id: `${stationId}-note`,
  stationId,
  title: keyConcept,
  keyConcept,
  plainExplanation,
  memoryPhrase,
  reflectionQuestion,
}));

type EventChoiceSeed = [string, string, Choice["effects"]];
type EventSeed = [string, string, string, EventChoiceSeed[]];

const randomEventSeeds: EventSeed[] = [
  ["missed-practice", "A missed evening practice", "The day closed before you practiced.", [["Reset tomorrow without shame", "You return without condemnation.", { rest: 4, consistency: 4 }], ["Give up for the week", "One missed day tries to become a verdict.", { consistency: -8 }], ["Do a short review note", "A small note keeps recall alive.", { recall: 5 }]]],
  ["loud-thought", "A thought becomes loud", "A thought fills the inner room.", [["Watch it as an object", "The thought becomes visible rather than total.", { discernment: 6 }], ["Fight it directly", "Resistance spends your rest.", { rest: -5 }], ["Follow it into a long story", "Focus thins as the story expands.", { focus: -6 }]]],
  ["comparison", "You compare your progress", "Another participant seems farther ahead.", [["Return to your own trail", "Your milepost becomes enough for today.", { clarity: 5 }], ["Decide you are behind", "Comparison drains rest.", { rest: -6 }], ["Review the not-a-race lesson", "Recall steadies your pace.", { recall: 5 }]]],
  ["crowded-calendar", "The calendar gets crowded", "Appointments press against the practice window.", [["Protect the 20-minute window", "The coordinate holds.", { consistency: 6 }], ["Squeeze it in vaguely", "The window blurs.", { focus: -5 }], ["Move it intentionally", "The coordinate changes without disappearing.", { focus: 5 }]]],
  ["sensitivity-rises", "Sensitivity rises", "The heart feels unusually tender.", [["Treat it gently", "Compassion steadies the moment.", { compassion: 6 }], ["Judge it as weakness", "Judgment makes the moment heavier.", { rest: -6 }], ["Pause and journal", "A brief record helps memory and rest.", { recall: 4, rest: 4 }]]],
  ["strong-definition", "A strong definition appears", "A name tries to become the whole object.", [["Feather the border", "The edge softens.", { openness: 6 }], ["Clutch it", "The definition hardens.", { openness: -6 }], ["Ask: what is this?", "Questioning restores clarity.", { clarity: 5 }]]],
  ["dramatic-experience", "You want a dramatic experience", "Subtle practice starts to feel too ordinary.", [["Return to subtlety", "Discernment grows where spectacle fades.", { discernment: 6 }], ["Chase spectacle", "Clarity scatters.", { clarity: -6 }], ["Review the course note", "Recall brings you back to the lesson.", { recall: 5 }]]],
  ["opaque-problem", "A problem feels opaque", "A concern becomes dense and sealed.", [["Reduce opacity", "The problem becomes less absolute.", { clarity: 6 }], ["Name it repeatedly", "The name grows heavy.", { rest: -6 }], ["Step back as witness", "Distance restores discernment.", { discernment: 5 }]]],
  ["early-confidence", "Early confidence rises", "A good day tempts you to skip the basics.", [["Keep the rhythm", "Steadiness outruns excitement.", { consistency: 5 }], ["Assume you have mastered it", "Recall weakens when review stops.", { recall: -5 }], ["Thank God and continue humbly", "Humility steadies attention.", { discernment: 4, compassion: 3 }]]],
  ["tired-morning", "A tired morning arrives", "Rest feels thin before practice.", [["Shorten and stay present", "A modest practice preserves rhythm.", { rest: 3, consistency: 3 }], ["Force hard", "The pace becomes harsh.", { rest: -6, focus: 2 }], ["Skip with a plan to return", "The day remains honest.", { rest: 4, consistency: -2 }]]],
  ["journal-clutter", "The journal becomes cluttered", "Notes multiply without clear recall.", [["Summarize one key phrase", "Memory becomes cleaner.", { recall: 5, clarity: 3 }], ["Keep adding explanations", "The page grows noisy.", { clarity: -4 }], ["Close the journal and sit quietly", "Rest returns.", { rest: 4 }]]],
  ["meaning-rush", "Meaning rushes in", "A small feeling asks for a large story.", [["Watch the heart give weight", "You notice salience arise.", { discernment: 5, compassion: 4 }], ["Build the large story", "The story becomes heavy.", { openness: -5 }], ["Name it lightly", "A gentle note keeps perspective.", { clarity: 3 }]]],
  ["schedule-change", "A schedule changes", "Your usual practice time disappears.", [["Choose a new coordinate", "The practice keeps a place.", { focus: 6 }], ["Wait for the old schedule", "Consistency drops.", { consistency: -5 }], ["Use a brief review card", "Recall survives the disruption.", { recall: 4 }]]],
  ["dry-session", "The session feels dry", "Nothing special seems to happen.", [["Stay faithful to the rhythm", "Consistency grows in ordinary soil.", { consistency: 6 }], ["Call it pointless", "Clarity dims.", { clarity: -5 }], ["Review the purpose", "Recall reconnects the session.", { recall: 4 }]]],
  ["over-explaining", "You over-explain the lesson", "The concept becomes more complicated than useful.", [["Return to the memory phrase", "Simplicity restores recall.", { recall: 5 }], ["Keep elaborating", "Focus drains.", { focus: -5 }], ["Sit with not-knowing", "Openness returns.", { openness: 5 }]]],
  ["restlessness", "Restlessness arrives", "You want to leave the chair immediately.", [["Observe restlessness as movement", "The movement becomes visible.", { discernment: 5 }], ["React instantly", "Focus drops.", { focus: -5 }], ["Take one calm breath and reset", "Rest improves.", { rest: 4 }]]],
  ["hard-border", "A hard border forms", "The thought feels separate and final.", [["Let the edge feather", "The border softens.", { openness: 6 }], ["Defend the border", "Openness narrows.", { openness: -5 }], ["Notice the boundary first", "Clarity improves.", { clarity: 4 }]]],
  ["forgot-quiz", "A quiz answer slips away", "The correct phrase is almost remembered.", [["Review the note", "Recall returns through review.", { recall: 6 }], ["Guess impatiently", "Clarity drops.", { clarity: -4 }], ["Slow down and remember the station", "Focus and recall improve.", { focus: 3, recall: 3 }]]],
  ["heart-judgment", "The heart is judged harshly", "You dislike what you notice arising.", [["Watch without judgment", "Compassion grows.", { compassion: 6 }], ["Condemn the movement", "Rest drops.", { rest: -5 }], ["Write a short honest line", "Recall and compassion increase.", { recall: 3, compassion: 3 }]]],
  ["course-fatigue", "Course fatigue appears", "The 90-day road feels long.", [["Return to today only", "Focus becomes manageable.", { focus: 5 }], ["Count every remaining day anxiously", "Rest drains.", { rest: -5 }], ["Review why repetition matters", "Recall strengthens.", { recall: 5 }]]],
  ["teacher-recap", "A Kirby recap lands clearly", "A recap phrase brings the module back into focus.", [["Add it to your notes", "Recall improves.", { recall: 6 }], ["Admire it without practicing", "Consistency dips.", { consistency: -3 }], ["Practice for 20 minutes", "Focus and consistency rise.", { focus: 4, consistency: 4 }]]],
  ["subtle-resistance", "Subtle resistance appears", "You would rather think about practice than practice.", [["Begin the 20 minutes", "Action restores consistency.", { consistency: 6 }], ["Plan endlessly", "Focus becomes diffused.", { focus: -5 }], ["Choose one tiny first step", "Rest and consistency improve.", { rest: 3, consistency: 3 }]]],
  ["object-heavy", "An object feels heavy with meaning", "A simple object becomes loaded with thought.", [["Notice matter as experienced through mind", "Discernment increases.", { discernment: 5 }], ["Let it become the whole world", "Openness drops.", { openness: -5 }], ["Reduce opacity", "Clarity returns.", { clarity: 5 }]]],
  ["grace-day", "A grace day is needed", "The body and schedule ask for mercy.", [["Use it intentionally", "Rest increases without abandoning rhythm.", { rest: 6, consistency: 2 }], ["Use it as escape", "Consistency drops.", { consistency: -5 }], ["Do a brief recall review", "Recall improves gently.", { recall: 4 }]]],
  ["quiet-breakthrough", "A quiet breakthrough", "Nothing flashes, but the witness position feels clearer.", [["Receive it humbly", "Discernment deepens.", { discernment: 6 }], ["Turn it into a performance", "Openness narrows.", { openness: -4 }], ["Record the lesson briefly", "Recall improves.", { recall: 4 }]]],
  ["fear-takes-reins", "Fear takes the reins", "Fear rises suddenly and tries to steer the whole trail.", [["Bring fear under steady guidance", "Fear is seen, named lightly, and not allowed to rule.", { discernment: 6, focus: 4 }], ["Let fear steer every choice", "The trail narrows around alarm.", { rest: -6, clarity: -4 }], ["Watch fear as a movement of the heart", "The emotion becomes visible without becoming master.", { compassion: 4, discernment: 4 }]]],
  ["shock-bolts", "Shock bolts forward", "A sudden shock moves through the heart like a spirited horse pulling hard against the reins.", [["Pause and take the reins patiently", "Steadiness returns without denial.", { rest: 4, focus: 5 }], ["Try to crush the reaction", "Force makes the movement harsher.", { rest: -5, compassion: -3 }], ["Let the witness observe the surge", "Discernment grows as the surge is watched.", { discernment: 5 }]]],
  ["surprise-startles", "Surprise startles the trail", "Surprise appears before meaning has formed.", [["Wait before naming it", "The first reaction softens before becoming a story.", { openness: 5, clarity: 4 }], ["Name it instantly as danger", "The border hardens too quickly.", { openness: -5, rest: -4 }], ["Journal one plain sentence", "Recall improves without overbuilding the moment.", { recall: 4 }]]],
];

export const randomEvents: RandomEvent[] = randomEventSeeds.map(([id, title, story, choices]) => ({
  id,
  title,
  story,
  choices: choices.map(([label, resultText, effects], index) => ({
    id: `${id}-${index}`,
    label,
    resultText,
    effects,
  })),
})) as RandomEvent[];

export const endings: Ending[] = [
  {
    id: "ready-next-module",
    title: "Ready for the Next Module",
    message: "You did not master everything, but you learned how to stay with the process.",
    remembered: ["consistency", "discernment", "recall", "openness"],
    revise: ["rest"],
  },
  {
    id: "gentle-reset",
    title: "The Gentle Reset",
    message: "You have been sincere, but the next step is rhythm, recovery, and gentleness.",
    remembered: ["consistency", "compassion"],
    revise: ["rest", "focus"],
  },
  {
    id: "calendar-return",
    title: "The Calendar Return",
    message: "You learned that intention needs coordinates.",
    remembered: ["openness", "compassion"],
    revise: ["consistency", "focus"],
  },
  {
    id: "witness-awakens",
    title: "The Witness Awakens",
    message: "You have begun to see thoughts and reactions from the outside, but the rhythm must continue.",
    remembered: ["discernment", "clarity"],
    revise: ["consistency", "recall"],
  },
  {
    id: "clutching-loop",
    title: "The Clutching Loop",
    message: "You kept grabbing meaning too quickly and are invited to replay with softer borders.",
    remembered: ["focus"],
    revise: ["openness", "rest", "discernment"],
  },
];

export const getStation = (stationId: string) => stations.find((station) => station.id === stationId) ?? stations[0];
export const getNoteForStation = (stationId: string) => courseNotes.find((note) => note.stationId === stationId);
export const stationIndex = (stationId: string) => Math.max(0, stations.findIndex((station) => station.id === stationId));
export const nextStationId = (stationId: string) => stations[Math.min(stationIndex(stationId) + 1, stations.length - 1)].id;
