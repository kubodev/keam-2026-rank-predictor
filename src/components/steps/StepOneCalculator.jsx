import MetricBar from "../common/MetricBar";
import StepShell from "../common/StepShell";
import AnimatedNumber from "../common/AnimatedNumber";
import StyledSelect from "../common/StyledSelect";

const boards = ["Kerala State HSE", "CBSE", "ICSE", "ISC", "Other"];
const optionalSubjects = ["Chemistry", "Computer Science", "Biology", "Biotechnology"];

const NumberField = ({ label, name, value, onChange, error, helper }) => {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-navy">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-navy outline-none transition ${
          error ? "border-rose-300" : "border-slate-200"
        }`}
      />
      {helper ? <p className="text-xs text-subtext">{helper}</p> : null}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </label>
  );
};

const SubjectCard = ({
  title,
  yourField,
  yourValue,
  topperField,
  topperValue,
  onChange,
  yourError,
  topperError,
  normalized,
  weighted
}) => {
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4">
      <h4 className="font-heading text-xl text-navy">{title}</h4>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <NumberField
          label={`Your marks in ${title}`}
          name={yourField}
          value={yourValue}
          onChange={onChange}
          error={yourError}
        />
        <NumberField
          label={`Topper marks in ${title}`}
          name={topperField}
          value={topperValue}
          onChange={onChange}
          error={topperError}
          helper="CEE uses board-wise topper values for normalization."
        />
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-2">
        <p className="text-xs uppercase tracking-[0.16em] text-subtext">Live subject preview</p>
        <p className="mt-1 text-sm font-semibold text-navy">
          Normalized: {normalized.toFixed(2)} / 100 | Weighted: {weighted.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

const StepOneCalculator = ({ inputs, setInputs, evaluation, onProceed, onRecalculate }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((current) => ({ ...current, [name]: value }));
  };

  const handleKeamMode = (nextMode) => {
    setInputs((current) => ({ ...current, keamMode: nextMode }));
  };

  const handleBoardChange = (event) => {
    const board = event.target.value;
    setInputs((current) => ({
      ...current,
      board,
      optionalSubject: board === "Kerala State HSE" ? "Chemistry" : current.optionalSubject
    }));
  };

  const [maths, physics, third] = evaluation.subjectResults;
  const totalIndexPercent = Math.max(0, Math.min(100, (evaluation.totalIndex / 600) * 100));

  return (
    <StepShell
      stepNumber={1}
      title="Normalized Marks Calculator"
      subtitle="Compute your KEAM normalized entrance score, board-standardized marks, and final index out of 600."
    >
      <div className="space-y-8">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-heading text-2xl text-navy">Section A: KEAM Entrance Score</h3>
            <div className="flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => handleKeamMode("score")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  inputs.keamMode === "score" ? "bg-navy text-white" : "text-subtext"
                }`}
              >
                Simple input
              </button>
              <button
                type="button"
                onClick={() => handleKeamMode("advanced")}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  inputs.keamMode === "advanced" ? "bg-navy text-white" : "text-subtext"
                }`}
              >
                Advanced mode
              </button>
            </div>
          </div>

          {inputs.keamMode === "score" ? (
            <NumberField
              label="Enter KEAM score (out of 600)"
              name="keamScore"
              value={inputs.keamScore}
              onChange={handleChange}
              error={evaluation.errors.keamScore}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <NumberField
                label="Paper I correct answers"
                name="paper1Correct"
                value={inputs.paper1Correct}
                onChange={handleChange}
                error={evaluation.errors.paper1Correct || evaluation.errors.paper1Total}
                helper="Physics & Chemistry paper, max 75 questions."
              />
              <NumberField
                label="Paper I wrong answers"
                name="paper1Wrong"
                value={inputs.paper1Wrong}
                onChange={handleChange}
                error={evaluation.errors.paper1Wrong}
              />
              <NumberField
                label="Paper II correct answers"
                name="paper2Correct"
                value={inputs.paper2Correct}
                onChange={handleChange}
                error={evaluation.errors.paper2Correct || evaluation.errors.paper2Total}
                helper="Mathematics paper, max 75 questions."
              />
              <NumberField
                label="Paper II wrong answers"
                name="paper2Wrong"
                value={inputs.paper2Wrong}
                onChange={handleChange}
                error={evaluation.errors.paper2Wrong}
              />
            </div>
          )}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Live raw score</p>
            <p className="mt-1 text-xl font-semibold text-navy">{evaluation.rawKeamScore.toFixed(2)} / 600</p>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-heading text-2xl text-navy">Section B: Class 12 Board Marks</h3>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800">
              Tooltip: CEE Kerala normalizes each subject using board-wise topper marks.
            </div>
          </div>

          <StyledSelect
            label="Select your board"
            name="board"
            value={inputs.board}
            onChange={handleBoardChange}
            options={boards}
            badge="Board"
          />

          {inputs.board !== "Kerala State HSE" ? (
            <StyledSelect
              label="Choose third subject (in place of Chemistry)"
              name="optionalSubject"
              value={inputs.optionalSubject}
              onChange={handleChange}
              options={optionalSubjects}
              badge="Optional"
            />
          ) : null}

          <div className="grid gap-4">
            <SubjectCard
              title={maths.label}
              yourField="mathsMarks"
              yourValue={inputs.mathsMarks}
              topperField="mathsTopper"
              topperValue={inputs.mathsTopper}
              onChange={handleChange}
              yourError={evaluation.errors.mathsMarks}
              topperError={evaluation.errors.mathsTopper}
              normalized={maths.normalized}
              weighted={maths.weighted}
            />
            <SubjectCard
              title={physics.label}
              yourField="physicsMarks"
              yourValue={inputs.physicsMarks}
              topperField="physicsTopper"
              topperValue={inputs.physicsTopper}
              onChange={handleChange}
              yourError={evaluation.errors.physicsMarks}
              topperError={evaluation.errors.physicsTopper}
              normalized={physics.normalized}
              weighted={physics.weighted}
            />
            <SubjectCard
              title={third.label}
              yourField="thirdSubjectMarks"
              yourValue={inputs.thirdSubjectMarks}
              topperField="thirdSubjectTopper"
              topperValue={inputs.thirdSubjectTopper}
              onChange={handleChange}
              yourError={evaluation.errors.thirdMarks}
              topperError={evaluation.errors.thirdTopper}
              normalized={third.normalized}
              weighted={third.weighted}
            />
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-navy/10 bg-navy/[0.03] p-4 sm:p-5 lg:grid-cols-[1.4fr,1fr]">
          <div className="space-y-4">
            <h3 className="font-heading text-2xl text-navy">Step 1 Result</h3>
            <MetricBar label="KEAM Entrance Score (out of 300)" value={evaluation.normalizedKeamScore} max={300} />
            <MetricBar
              label="Board Standardized Score (out of 300)"
              value={evaluation.boardScore}
              max={300}
              tone="bg-emerald-600"
            />
            <MetricBar label="Maths Weighted (max 150)" value={maths.weighted} max={150} tone="bg-sky-600" />
            <MetricBar label="Physics Weighted (max 90)" value={physics.weighted} max={90} tone="bg-violet-600" />
            <MetricBar
              label={`${third.label} Weighted (max 60)`}
              value={third.weighted}
              max={60}
              tone="bg-orange-500"
            />
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-5 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-subtext">Total Index Mark</p>
            <div
              className="mx-auto mt-4 grid h-44 w-44 place-items-center rounded-full p-3"
              style={{
                background: `conic-gradient(var(--amber) ${totalIndexPercent}%, #e5e7eb ${totalIndexPercent}% 100%)`
              }}
            >
              <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
                <p className="text-xs uppercase tracking-[0.15em] text-subtext">out of 600</p>
                <AnimatedNumber
                  value={evaluation.totalIndex}
                  duration={900}
                  className="font-heading text-3xl text-navy"
                  formatter={(number) => number.toFixed(2)}
                />
              </div>
            </div>
            <p className={`mt-4 inline-block rounded-full border px-3 py-1 text-sm font-semibold ${evaluation.tier.tone}`}>
              {evaluation.tier.label}
            </p>
          </div>
        </section>

        <details className="rounded-2xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer list-none font-heading text-xl text-navy">
            How is this calculated?
          </summary>
          <div className="mt-4 space-y-3 text-sm text-subtext">
            <p className="text-navy">
              Normalized KEAM = (Raw KEAM / 600) x 300 = ({evaluation.rawKeamScore.toFixed(2)} / 600) x 300 ={" "}
              {evaluation.normalizedKeamScore.toFixed(2)}
            </p>
            <p>
              Maths: ({inputs.mathsMarks || 0} / {inputs.mathsTopper || 0}) x 100 x 1.5 = {maths.weighted.toFixed(2)}
            </p>
            <p>
              Physics: ({inputs.physicsMarks || 0} / {inputs.physicsTopper || 0}) x 100 x 0.9 ={" "}
              {physics.weighted.toFixed(2)}
            </p>
            <p>
              {third.label}: ({inputs.thirdSubjectMarks || 0} / {inputs.thirdSubjectTopper || 0}) x 100 x 0.6 ={" "}
              {third.weighted.toFixed(2)}
            </p>
            <p className="font-semibold text-navy">
              Final Index = {evaluation.normalizedKeamScore.toFixed(2)} + {evaluation.boardScore.toFixed(2)} ={" "}
              {evaluation.totalIndex.toFixed(2)}
            </p>
          </div>
        </details>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRecalculate}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:shadow"
          >
            Recalculate
          </button>
          <button
            type="button"
            onClick={onProceed}
            disabled={evaluation.hasErrors}
            className="rounded-xl bg-amber px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Proceed to Rank Prediction
          </button>
        </div>
      </div>
    </StepShell>
  );
};

export default StepOneCalculator;
