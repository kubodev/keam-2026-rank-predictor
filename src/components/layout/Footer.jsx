import { useState } from "react";

const profileLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mathewskdev/"
  },
  {
    label: "GitHub",
    href: "https://github.com/Kubodev"
  }
];

const Footer = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
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
          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="font-semibold text-navy underline decoration-amber"
          >
            kubo
          </button>
          .
        </p>
        <p className="mt-1 text-xs">This website is owned by Acadialoom.</p>
      </footer>

      {showProfileModal ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kubo-profile-title"
          onMouseDown={() => setShowProfileModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-amber-100 bg-white p-5 text-navy shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Creator</p>
                <h2 id="kubo-profile-title" className="mt-1 font-heading text-2xl text-navy">
                  kubo
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-sm font-bold text-subtext transition hover:border-amber-200 hover:bg-amber-50 hover:text-navy"
                aria-label="Close creator links"
              >
                x
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              {profileLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50 hover:shadow"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Footer;
