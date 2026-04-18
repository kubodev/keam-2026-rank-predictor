const MetricBar = ({ label, value, max, tone = "bg-amber", suffix = "", showValue = true }) => {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-navy">{label}</span>
        {showValue && (
          <span className="font-semibold text-navy">
            {value.toFixed(2)}
            {suffix}
          </span>
        )}
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${tone}`}
          style={{ width: `${percent}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
};

export default MetricBar;
