const Footer = ({ onOpenCreatorProfile }) => {
  return (
    <footer className="rounded-2xl border border-amber-100 bg-white px-4 py-5 text-sm text-subtext shadow-panel sm:px-6">
        <p data-nosnippet>
          This tool provides estimates based on KEAM 2025 trends. Official ranks are determined by CEE Kerala.
          Results here are indicative only.
        </p>
        <p className="mt-3" data-nosnippet>
          Warning: This tool is an unofficial estimator. Rank predictions are based on KEAM 2025 trends and published
          cutoff data. Actual ranks depend on the final CEE Kerala normalization process, total candidates, and
          difficulty factors which vary each year. Always refer to{" "}
          <a className="font-medium text-navy underline decoration-amber" href="https://cee.kerala.gov.in/">
            cee.kerala.gov.in
          </a>{" "}
          for official results.
        </p>
        <div className="mt-5 border-t border-amber-100 pt-5 text-center" data-nosnippet>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">Copyright</p>
          <p className="mt-2 font-heading text-3xl text-navy sm:text-4xl">
            Created By{" "}
            <button
              type="button"
              onClick={onOpenCreatorProfile}
              className="font-heading font-bold text-amber-700 underline decoration-amber decoration-2 underline-offset-4 transition hover:text-navy"
            >
              Kubo
            </button>
          </p>
          <p className="mt-2 text-xs font-medium text-subtext">All creator rights reserved by Kubo.</p>
        </div>
        <p className="mt-3 text-center text-xs">This website is owned by Acadialoom.</p>
      </footer>
  );
};

export default Footer;
