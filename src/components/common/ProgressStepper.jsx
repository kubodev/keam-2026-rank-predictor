const steps = [
  { id: 1, title: "Normalized Marks" },
  { id: 2, title: "Rank Predictor" },
  { id: 3, title: "College Predictor" }
];

const ProgressStepper = ({ currentStep }) => {
  return (
    <div className="rounded-2xl border border-amber-100 bg-white/80 px-4 py-4 shadow-panel backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex w-full items-center gap-3">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-bold transition-all ${
                    isActive
                      ? "border-amber bg-amber text-white"
                      : isCompleted
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-300 bg-white text-slate-500"
                  }`}
                >
                  {step.id}
                </span>
                <span
                  className={`text-xs font-medium sm:text-sm ${
                    isActive ? "text-navy" : "text-slate-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div className="ml-2 hidden h-[2px] flex-1 bg-slate-200 sm:block">
                  <div
                    className={`h-full transition-all ${
                      currentStep > step.id ? "w-full bg-emerald-600" : "w-0 bg-transparent"
                    }`}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
