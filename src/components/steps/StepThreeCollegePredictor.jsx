import StepShell from "../common/StepShell";

const StepThreeCollegePredictor = ({ predictedRank, predictions, onBack, onRecalculate }) => {
  return (
    <StepShell
      stepNumber={3}
      title="College Predictor"
      subtitle="Likely college and branch options from KEAM 2025 closing ranks (General category trend)."
    >
      <div className="space-y-6">
        <div className="sticky top-3 z-20">
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 shadow">
            Predicted Rank: ~{predictedRank.toLocaleString()}
          </div>
        </div>

        {predictions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {predictions.map((item, index) => (
              <article
                key={`${item.college}-${item.branch}-${item.closingRank}`}
                className="animate-fade-rise rounded-2xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:shadow-panel"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-heading text-xl leading-snug text-navy">{item.college}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-subtext">{item.location}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${item.badgeTone}`}>
                    {item.likelihood}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-subtext">Branch</p>
                    <p className="font-semibold text-navy">{item.branch}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-subtext">Closing rank (2025)</p>
                    <p className="font-semibold text-navy">{item.closingRank.toLocaleString()}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-subtext">Type: {item.type}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="font-heading text-2xl text-navy">No likely options in current dataset</p>
            <p className="mt-2 text-sm text-subtext">
              The current rank is above the low-chance threshold for this sample list. Check broader college lists and
              category-specific allotment data.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:shadow"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onRecalculate}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:shadow"
            >
              Recalculate
            </button>
          </div>
        </div>
      </div>
    </StepShell>
  );
};

export default StepThreeCollegePredictor;
