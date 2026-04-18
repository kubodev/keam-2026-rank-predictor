import { useEffect, useMemo, useState } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProgressStepper from "./components/common/ProgressStepper";
import StepOneCalculator from "./components/steps/StepOneCalculator";
import StepTwoRankPredictor from "./components/steps/StepTwoRankPredictor";
import StepThreeCollegePredictor from "./components/steps/StepThreeCollegePredictor";
import {
  estimateRankFromIndex,
  evaluateStepOne,
  getCollegePredictions,
  getDefaultInputs
} from "./utils/calculations";

const STEP_PARAM_MAP = {
  "1": 1,
  calculator: 1,
  "2": 2,
  rank: 2,
  "rank-predictor": 2,
  "3": 3,
  college: 3,
  "college-predictor": 3
};

const getInitialStep = () => {
  if (typeof window === "undefined") {
    return 1;
  }

  const params = new URLSearchParams(window.location.search);
  const rawStep = (params.get("step") || "").toLowerCase();
  return STEP_PARAM_MAP[rawStep] ?? 1;
};

const getStepSlug = (step) => {
  if (step === 2) {
    return "rank-predictor";
  }

  if (step === 3) {
    return "college-predictor";
  }

  return "calculator";
};

const syncStepUrl = (step) => {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("step", getStepSlug(step));
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
};

const App = () => {
  const [currentStep, setCurrentStep] = useState(getInitialStep);
  const [transitionDirection, setTransitionDirection] = useState(1);
  const [inputs, setInputs] = useState(getDefaultInputs);
  const [category, setCategory] = useState("General (SM)");

  const evaluation = useMemo(() => evaluateStepOne(inputs), [inputs]);
  const rankEstimate = useMemo(() => estimateRankFromIndex(evaluation.totalIndex), [evaluation.totalIndex]);
  const predictions = useMemo(
    () => getCollegePredictions(rankEstimate.displayRank),
    [rankEstimate.displayRank]
  );

  const goToStep = (step) => {
    setTransitionDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  useEffect(() => {
    syncStepUrl(currentStep);
  }, [currentStep]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handlePopState = () => {
      const nextStep = getInitialStep();
      setTransitionDirection(nextStep > currentStep ? 1 : -1);
      setCurrentStep(nextStep);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep]);

  const resetAll = () => {
    setInputs(getDefaultInputs());
    setCategory("General (SM)");
    setTransitionDirection(-1);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen px-4 py-6 font-body sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5">
        <Header />
        <ProgressStepper currentStep={currentStep} />

        <main
          className={`${
            transitionDirection === 1 ? "animate-step-forward" : "animate-step-back"
          }`}
          key={`${currentStep}-${transitionDirection}`}
        >
          {currentStep === 1 ? (
            <StepOneCalculator
              inputs={inputs}
              setInputs={setInputs}
              evaluation={evaluation}
              onProceed={() => goToStep(2)}
              onRecalculate={resetAll}
            />
          ) : null}

          {currentStep === 2 ? (
            <StepTwoRankPredictor
              rankEstimate={rankEstimate}
              category={category}
              onCategoryChange={setCategory}
              onBack={() => goToStep(1)}
              onProceed={() => goToStep(3)}
              onRecalculate={resetAll}
            />
          ) : null}

          {currentStep === 3 ? (
            <StepThreeCollegePredictor
              predictedRank={rankEstimate.displayRank}
              predictions={predictions}
              onBack={() => goToStep(2)}
              onRecalculate={resetAll}
            />
          ) : null}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
