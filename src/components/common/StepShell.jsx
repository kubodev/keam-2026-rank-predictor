const StepShell = ({ stepNumber, title, subtitle, children }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-panel sm:p-8">
      <span className="pointer-events-none absolute -right-2 -top-10 select-none font-heading text-[7rem] leading-none text-navy/5 sm:text-[9rem]">
        {stepNumber}
      </span>
      <div className="relative z-10 mb-8 border-b border-amber-100 pb-5">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-amber">Step {stepNumber}</p>
        <h2 className="mt-2 font-heading text-3xl text-navy sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm text-subtext sm:text-base">{subtitle}</p>
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
};

export default StepShell;
