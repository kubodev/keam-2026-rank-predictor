import { useEffect, useState } from "react";
import StepShell from "../common/StepShell";
import StyledSelect from "../common/StyledSelect";
import { reservationCategories } from "../../data/rankTable";
import { getCategoryNote } from "../../utils/calculations";

const formatRank = (value) => Math.round(value).toLocaleString();

const StepTwoRankPredictor = ({
  rankEstimate,
  category,
  onCategoryChange,
  onBack,
  onProceed,
  onRecalculate
}) => {
  const [revealedRank, setRevealedRank] = useState(rankEstimate.displayRank);

  useEffect(() => {
    const target = rankEstimate.displayRank;
    const start = Math.max(target + 4500, Math.round(target * 1.18));
    const duration = 1500;
    const startAt = performance.now();

    const run = (timestamp) => {
      const elapsed = timestamp - startAt;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = start + (target - start) * eased;
      setRevealedRank(current);
      if (progress < 1) {
        requestAnimationFrame(run);
      }
    };

    requestAnimationFrame(run);
  }, [rankEstimate.displayRank]);

  const markerPoints = [
    { label: "Top 1,000", value: 1000 },
    { label: "10,000", value: 10000 },
    { label: "30,000", value: 30000 },
    { label: "60,000+", value: 60000 }
  ];

  return (
    <StepShell
      stepNumber={2}
      title="Rank Predictor"
      subtitle="Approximate KEAM Engineering rank based on your index mark and KEAM 2025 marks-vs-rank trends."
    >
      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0f234d] to-[#112a5c] p-5 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200">Estimated rank reveal</p>
          <h3 className="mt-2 font-heading text-4xl sm:text-5xl">~{formatRank(revealedRank)}</h3>
          <p className="mt-2 text-sm text-slate-200">
            Estimated range: {rankEstimate.rangeLabel} (midpoint shown above)
          </p>
          <p className="mt-1 text-xs text-slate-300">Interpolated trend rank: {formatRank(rankEstimate.interpolatedRank)}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="relative">
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-full bg-gradient-to-r from-emerald-500 via-amber to-rose-500" />
            </div>
            <div
              className="absolute -top-2 h-7 w-7 -translate-x-1/2 rounded-full border-2 border-white bg-navy shadow"
              style={{ left: `${rankEstimate.spectrumPosition}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-subtext sm:grid-cols-4 sm:text-xs">
            {markerPoints.map((point) => (
              <div key={point.label}>
                <p className="font-semibold text-navy">{point.label}</p>
                <p>Rank {point.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-heading text-2xl text-navy">Reservation Category Advisory</h3>
          <StyledSelect
            label="Reservation Category"
            name="category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            options={reservationCategories}
            badge="Advisory"
          />
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {getCategoryNote(category)}
          </p>
        </section>

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
          <button
            type="button"
            onClick={onProceed}
            className="rounded-xl bg-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-700"
          >
            Continue to College Predictor
          </button>
        </div>
      </div>
    </StepShell>
  );
};

export default StepTwoRankPredictor;
