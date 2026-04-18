const Footer = () => {
  return (
    <footer className="rounded-2xl border border-amber-100 bg-white px-4 py-5 text-sm text-subtext shadow-panel sm:px-6">
      <p>
        This tool provides estimates based on KEAM 2025 trends. Official ranks are determined by CEE Kerala.
        Results here are indicative only.
      </p>
      <p className="mt-3">
        Warning: This tool is an unofficial estimator. Rank predictions are based on KEAM 2025 trends and published
        cutoff data. Actual ranks depend on the final CEE Kerala normalization process, total candidates, and
        difficulty factors which vary each year. Always refer to{" "}
        <a className="font-medium text-navy underline decoration-amber" href="https://cee.kerala.gov.in/">
          cee.kerala.gov.in
        </a>{" "}
        for official results.
      </p>
      <p className="mt-3 text-xs">
        Copyright rights to{" "}
        <a className="font-semibold text-navy underline decoration-amber" href="https://github.com/Kubodev">
          kubo
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;
