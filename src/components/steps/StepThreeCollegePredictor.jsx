import StepShell from "../common/StepShell";

const StepThreeCollegePredictor = ({ predictedRank, predictions, onBack, onRecalculate }) => {
  const visiblePredictions = predictions.slice(0, 60);
  const hiddenCount = Math.max(0, predictions.length - visiblePredictions.length);
  const counts = predictions.reduce(
    (acc, item) => {
      acc[item.likelihood] += 1;
      return acc;
    },
    { "High Chance": 0, Moderate: 0, "Low Chance": 0 }
  );

  return (
    <StepShell
      stepNumber={3}
      title="College Predictor"
      subtitle="Likely college and branch options from the KEAM 2025 Second Phase last-rank table using the SM closing-rank column."
    >
      <div className="space-y-6">
        <div className="sticky top-3 z-20">
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 shadow">
            Predicted Rank: ~{predictedRank.toLocaleString()}
          </div>
        </div>

        {predictions.length > 0 ? (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-navy">
                  {predictions.length.toLocaleString()} matching options
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  High: {counts["High Chance"]}
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                  Moderate: {counts.Moderate}
                </span>
                <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                  Low: {counts["Low Chance"]}
                </span>
              </div>
              <p className="mt-3 text-sm text-subtext">
                Showing the closest {visiblePredictions.length} options first, sorted by likelihood and closing rank.
              </p>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              {visiblePredictions.map((item, index) => (
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
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-subtext">
                  <span>Code: {item.code || "N/A"}</span>
                  <span>Type: {item.type}</span>
                </div>
              </article>
              ))}
            </div>

            {hiddenCount > 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-subtext">
                {hiddenCount.toLocaleString()} additional lower-priority matches are hidden to keep the results usable.
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="font-heading text-2xl text-navy">No likely options in current dataset</p>
            <p className="mt-2 text-sm text-subtext">
              The current rank is above the low-chance threshold in the imported 2025 last-rank dataset. Check
              category-specific allotment data and later rounds as well.
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
