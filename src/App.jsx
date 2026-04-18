import { useMemo, useState } from "react";
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

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
