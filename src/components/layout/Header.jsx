const Header = () => {
  return (
    <header className="overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-[#0d1b3d] via-[#132a59] to-[#0f1d3a] px-6 py-8 text-white shadow-panel sm:px-10">
      <div className="relative">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-amber/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6">
          <div className="max-w-xl">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-amber-200">KEAM 2026 estimator</p>
            <h1 className="mt-2 font-heading text-4xl leading-tight sm:text-5xl">KEAM Compass</h1>
            <p className="mt-4 font-body text-sm text-slate-200 sm:text-base">
              Normalized Marks Calculator and Rank Predictor with Kerala-focused engineering college insights.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
