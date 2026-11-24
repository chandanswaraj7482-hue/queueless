import React, { useState, useEffect, useRef } from 'react';

export interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  useIndianLocale?: boolean;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
  useIndianLocale = false,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const startValRef = useRef(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startVal = hasStartedRef.current ? startValRef.current : 0;
    hasStartedRef.current = true;
    const change = end - startVal;
    let startTime: number | null = null;
    let animationFrame: number;

    // Premium easeOutExpo curve for rapid count up then smooth deceleration
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const currentVal = startVal + change * easedProgress;
      setCount(currentVal);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(end);
        startValRef.current = end;
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  const formattedNumber = () => {
    if (decimals > 0) {
      return count.toFixed(decimals);
    }
    const rounded = Math.round(count);
    if (useIndianLocale) {
      return rounded.toLocaleString('en-IN');
    }
    return rounded.toLocaleString('en-US');
  };

  // If prefix is '-' and number is 0, display without negative sign until it counts down
  const displayPrefix = prefix === '-' && Math.round(count) === 0 ? '' : prefix;

  return (
    <span ref={ref} className={className}>
      {displayPrefix}
      {formattedNumber()}
      {suffix}
    </span>
  );
};
