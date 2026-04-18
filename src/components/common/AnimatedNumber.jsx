import { useEffect, useRef, useState } from "react";

const AnimatedNumber = ({ value, duration = 700, formatter = (n) => n.toFixed(2), className = "" }) => {
  const [animatedValue, setAnimatedValue] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const start = previous.current;
    const end = value;
    const startAt = performance.now();

    const tick = (timestamp) => {
      const elapsed = timestamp - startAt;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = start + (end - start) * eased;
      setAnimatedValue(current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        previous.current = end;
      }
    };

    requestAnimationFrame(tick);
  }, [value, duration]);

  return <span className={className}>{formatter(animatedValue)}</span>;
};

export default AnimatedNumber;
