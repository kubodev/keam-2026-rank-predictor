import { useEffect, useId, useMemo, useRef, useState } from "react";

const StyledSelect = ({ label, name, value, onChange, options, helper, error, badge }) => {
  const autoId = useId();
  const id = `${name || "select"}-${autoId}`;
  const listId = `${id}-listbox`;
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string" ? { label: option, value: option } : option
      ),
    [options]
  );

  const selectedIndex = Math.max(
    0,
    normalizedOptions.findIndex((option) => option.value === value)
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const selectedOption = normalizedOptions[selectedIndex] ?? normalizedOptions[0] ?? { label: "", value: "" };

  useEffect(() => {
    if (open) {
      setActiveIndex(selectedIndex);
    }
  }, [open, selectedIndex]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  const emitChange = (nextValue) => {
    if (onChange) {
      onChange({ target: { name, value: nextValue } });
    }
  };

  const commitSelection = (nextIndex) => {
    const option = normalizedOptions[nextIndex];
    if (!option) {
      return;
    }
    emitChange(option.value);
    setOpen(false);
  };

  const handleButtonKeyDown = (event) => {
    if (!normalizedOptions.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        setActiveIndex((index) => Math.min(normalizedOptions.length - 1, index + 1));
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        setActiveIndex((index) => Math.max(0, index - 1));
      }
    } else if (event.key === "Home" && open) {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End" && open) {
      event.preventDefault();
      setActiveIndex(normalizedOptions.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        commitSelection(activeIndex);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="block space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-navy">
          {label}
        </label>
        {badge ? (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
            {badge}
          </span>
        ) : null}
      </div>

      <div ref={containerRef} className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setOpen((current) => !current)}
          onKeyDown={handleButtonKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          className={`group relative w-full overflow-hidden rounded-xl border bg-white py-2.5 pl-4 pr-11 text-left text-sm font-medium text-navy shadow-sm transition ${
            error
              ? "border-rose-300"
              : "border-slate-200 hover:border-amber-300 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100"
          }`}
        >
          <span
            className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500"
            aria-hidden
          />
          <span>{selectedOption.label}</span>
          <span
            className="pointer-events-none absolute inset-y-1.5 right-1.5 grid w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-amber-100 group-hover:text-amber-700"
            aria-hidden
          >
            <svg
              viewBox="0 0 20 20"
              className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {open ? (
          <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <ul
              id={listId}
              role="listbox"
              aria-labelledby={id}
              className="max-h-56 overflow-auto p-1"
            >
              {normalizedOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeIndex;

                return (
                  <li key={option.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => commitSelection(index)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                        isActive
                          ? "bg-amber-100 text-amber-900"
                          : isSelected
                            ? "bg-slate-100 text-navy"
                            : "text-navy hover:bg-amber-50"
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected ? (
                        <svg
                          viewBox="0 0 20 20"
                          className="h-4 w-4 text-amber-700"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 10.5L8.4 13.8L15 7.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>

      {helper ? <p className="text-xs text-subtext">{helper}</p> : null}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
};

export default StyledSelect;
