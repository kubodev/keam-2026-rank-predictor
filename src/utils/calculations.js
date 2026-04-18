import { collegeCutoffs } from "../data/collegeCutoffs";
import { rankBands } from "../data/rankTable";

const BOARD_SUBJECT_DEFAULT = "Chemistry";

const tierMeta = [
  { min: 550, label: "Elite Zone", tone: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { min: 480, label: "Top Tier", tone: "text-sky-700 bg-sky-50 border-sky-200" },
  { min: 380, label: "Mid Tier", tone: "text-amber-700 bg-amber-50 border-amber-200" },
  {
    min: 280,
    label: "Below Average",
    tone: "text-orange-700 bg-orange-50 border-orange-200"
  },
  { min: -Infinity, label: "Needs Improvement", tone: "text-rose-700 bg-rose-50 border-rose-200" }
];

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getThirdSubjectLabel = (board, selectedOptionalSubject) => {
  if (board === "Kerala State HSE") {
    return BOARD_SUBJECT_DEFAULT;
  }

  return selectedOptionalSubject || BOARD_SUBJECT_DEFAULT;
};

export const getDefaultInputs = () => ({
  keamMode: "score",
  keamScore: "",
  paper1Correct: "",
  paper1Wrong: "",
  paper2Correct: "",
  paper2Wrong: "",
  board: "Kerala State HSE",
  optionalSubject: BOARD_SUBJECT_DEFAULT,
  mathsMarks: "",
  mathsTopper: "100",
  physicsMarks: "",
  physicsTopper: "100",
  thirdSubjectMarks: "",
  thirdSubjectTopper: "100"
});

export const evaluateStepOne = (inputs) => {
  const errors = {};

  const paper1Correct = toNumber(inputs.paper1Correct);
  const paper1Wrong = toNumber(inputs.paper1Wrong);
  const paper2Correct = toNumber(inputs.paper2Correct);
  const paper2Wrong = toNumber(inputs.paper2Wrong);
  const directKeamScore = toNumber(inputs.keamScore);

  if (inputs.keamMode === "score") {
    if (directKeamScore < 0 || directKeamScore > 600) {
      errors.keamScore = "Enter a KEAM score between 0 and 600.";
    }
  }

  const paperFields = [
    ["paper1Correct", paper1Correct],
    ["paper1Wrong", paper1Wrong],
    ["paper2Correct", paper2Correct],
    ["paper2Wrong", paper2Wrong]
  ];

  paperFields.forEach(([field, value]) => {
    if (value < 0) {
      errors[field] = "Values cannot be negative.";
    }
  });

  if (paper1Correct + paper1Wrong > 75) {
    errors.paper1Total = "Paper I correct + wrong cannot exceed 75.";
  }

  if (paper2Correct + paper2Wrong > 75) {
    errors.paper2Total = "Paper II correct + wrong cannot exceed 75.";
  }

  const computedRawScore =
    paper1Correct * 4 - paper1Wrong + (paper2Correct * 4 - paper2Wrong);

  const rawKeamScore = clamp(inputs.keamMode === "advanced" ? computedRawScore : directKeamScore, 0, 600);
  const normalizedKeamScore = (rawKeamScore / 600) * 300;

  const thirdSubjectLabel = getThirdSubjectLabel(inputs.board, inputs.optionalSubject);
  const subjectPayload = [
    {
      key: "maths",
      label: "Mathematics",
      yourMark: toNumber(inputs.mathsMarks),
      topperMark: toNumber(inputs.mathsTopper),
      weight: 1.5
    },
    {
      key: "physics",
      label: "Physics",
      yourMark: toNumber(inputs.physicsMarks),
      topperMark: toNumber(inputs.physicsTopper),
      weight: 0.9
    },
    {
      key: "third",
      label: thirdSubjectLabel,
      yourMark: toNumber(inputs.thirdSubjectMarks),
      topperMark: toNumber(inputs.thirdSubjectTopper),
      weight: 0.6
    }
  ];

  subjectPayload.forEach((subject) => {
    if (subject.yourMark < 0) {
      errors[`${subject.key}Marks`] = `${subject.label} marks cannot be negative.`;
    }

    if (subject.topperMark <= 0) {
      errors[`${subject.key}Topper`] = `${subject.label} topper mark must be above 0.`;
    }

    if (subject.yourMark > subject.topperMark) {
      errors[`${subject.key}Marks`] = `Your ${subject.label} mark cannot exceed topper mark.`;
    }
  });

  const subjectResults = subjectPayload.map((subject) => {
    const normalized = subject.topperMark > 0 ? (subject.yourMark / subject.topperMark) * 100 : 0;
    const weighted = normalized * subject.weight;
    return {
      ...subject,
      normalized: clamp(normalized, 0, 100),
      weighted: clamp(weighted, 0, subject.weight * 100)
    };
  });

  const boardScore = subjectResults.reduce((acc, subject) => acc + subject.weighted, 0);
  const totalIndex = normalizedKeamScore + boardScore;

  const tier = tierMeta.find((entry) => totalIndex >= entry.min) ?? tierMeta[tierMeta.length - 1];

  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
    rawKeamScore,
    normalizedKeamScore,
    subjectResults,
    boardScore,
    totalIndex,
    tier,
    thirdSubjectLabel
  };
};

const formatRange = (best, worst) => `${best.toLocaleString()} - ${worst.toLocaleString()}`;

export const estimateRankFromIndex = (indexMark) => {
  const mark = clamp(toNumber(indexMark), 0, 600);
  const markInt = Math.floor(mark);

  if (markInt < 250) {
    const minimum = 60000;
    const maximum = 70000;
    return {
      mark,
      openEnded: true,
      rangeLabel: "60,000+",
      rangeMin: minimum,
      rangeMax: maximum,
      displayRank: 62500,
      interpolatedRank: 65000,
      spectrumPosition: 100
    };
  }

  const band =
    rankBands.find((item) => markInt >= item.marksMin && markInt <= item.marksMax) ??
    rankBands[rankBands.length - 1];
  const denominator = Math.max(1, band.marksMax - band.marksMin);
  const progress = (markInt - band.marksMin) / denominator;
  const interpolatedRank = Math.round(band.rankWorst + progress * (band.rankBest - band.rankWorst));
  const displayRank = Math.round((band.rankBest + band.rankWorst) / 2);
  const normalizedSpectrum = clamp((displayRank / 60000) * 100, 0, 100);

  return {
    mark,
    openEnded: false,
    rangeLabel: formatRange(band.rankBest, band.rankWorst),
    rangeMin: band.rankBest,
    rangeMax: band.rankWorst,
    displayRank,
    interpolatedRank,
    spectrumPosition: normalizedSpectrum
  };
};

export const getCategoryNote = (category) => {
  if (category === "SC" || category === "ST") {
    return "SC/ST candidates generally have a lower qualifying minimum (around 40%), and category rank can be materially better than general rank.";
  }

  if (category !== "General (SM)") {
    return "Reserved category seats often improve effective admission position within the category list compared with the same general rank.";
  }

  return "General category estimate uses the baseline KEAM 2025 trend line without reservation adjustment.";
};

export const getCollegePredictions = (rank) => {
  const candidateRank = toNumber(rank);
  const rankedCards = collegeCutoffs
    .map((item) => {
      const highBand = item.closingRank * 0.75;
      const moderateBand = item.closingRank;
      const lowBand = item.closingRank * 1.4;

      if (candidateRank > lowBand) {
        return null;
      }

      let likelihood = "Low Chance";
      let badgeTone = "bg-rose-100 text-rose-700 border-rose-200";

      if (candidateRank <= highBand) {
        likelihood = "High Chance";
        badgeTone = "bg-emerald-100 text-emerald-700 border-emerald-200";
      } else if (candidateRank <= moderateBand) {
        likelihood = "Moderate";
        badgeTone = "bg-amber-100 text-amber-800 border-amber-200";
      }

      return {
        ...item,
        likelihood,
        badgeTone
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.closingRank - b.closingRank);

  return rankedCards;
};
