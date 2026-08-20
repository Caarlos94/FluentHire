"use client";

const SUB_SCORE_CONFIG = {
  clarityStructure: {
    label: "Clarity & Structure",
    barColor: "bg-sky-500",
    trackColor: "bg-sky-500/10",
  },
  grammarVocabulary: {
    label: "Grammar & Vocabulary",
    barColor: "bg-amber-500",
    trackColor: "bg-amber-500/10",
  },
  fillerFluency: {
    label: "Fluency & Confidence",
    barColor: "bg-rose-500",
    trackColor: "bg-rose-500/10",
  },
} as const;

type SubScoreKey = keyof typeof SUB_SCORE_CONFIG;

function SubScoreRow({
  dimension,
  score,
  feedback,
}: {
  dimension: SubScoreKey;
  score: number;
  feedback: string;
}) {
  const config = SUB_SCORE_CONFIG[dimension];

  return (
    <div className="space-y-1.5">
      {/* Mobile: label + score, then bar below */}
      <div className="flex items-center justify-between sm:hidden">
        <span className="text-sm font-medium">{config.label}</span>
        <span className="text-sm font-semibold tabular-nums">{score}</span>
      </div>
      <div className={`h-1.5 overflow-hidden rounded-full sm:hidden ${config.trackColor}`}>
        <div
          className={`h-full rounded-full ${config.barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Desktop: label + bar + score inline */}
      <div className="hidden items-center gap-3 sm:flex">
        <span className="w-[170px] shrink-0 text-sm font-medium">
          {config.label}
        </span>
        <div className={`relative h-1.5 flex-1 overflow-hidden rounded-full ${config.trackColor}`}>
          <div
            className={`h-full rounded-full ${config.barColor} transition-all duration-1000 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="w-7 text-right text-sm font-semibold tabular-nums">{score}</span>
      </div>

      {/* Feedback — full-width, below the label */}
      <p className="text-sm leading-relaxed text-muted-foreground">{feedback}</p>
    </div>
  );
}

interface CommunicationBreakdownData {
  clarityStructureScore: number | null;
  clarityStructureFeedback: string | null;
  grammarVocabularyScore: number | null;
  grammarVocabularyFeedback: string | null;
  fillerFluencyScore: number | null;
  fillerFluencyFeedback: string | null;
}

export function hasCommunicationBreakdown(data: CommunicationBreakdownData): boolean {
  return (
    data.clarityStructureScore != null &&
    data.grammarVocabularyScore != null &&
    data.fillerFluencyScore != null
  );
}

export function CommunicationBreakdownRows({ data }: { data: CommunicationBreakdownData }) {
  return (
    <div className="space-y-4">
      <SubScoreRow
        dimension="clarityStructure"
        score={data.clarityStructureScore!}
        feedback={data.clarityStructureFeedback || ""}
      />
      <SubScoreRow
        dimension="grammarVocabulary"
        score={data.grammarVocabularyScore!}
        feedback={data.grammarVocabularyFeedback || ""}
      />
      <SubScoreRow
        dimension="fillerFluency"
        score={data.fillerFluencyScore!}
        feedback={data.fillerFluencyFeedback || ""}
      />
    </div>
  );
}
