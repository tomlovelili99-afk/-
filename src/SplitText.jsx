import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 0.6,
  ease = 'power3.out',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
}) {
  const ref = useRef(null);
  const Tag = tag;

  useGSAP(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const margin = rootMargin.startsWith('-') ? `-=${rootMargin.slice(1)}` : `+=${rootMargin}`;

    return gsap.fromTo(
      element.querySelectorAll('.split-char'),
      from,
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: element,
          start: `top ${Math.round((1 - threshold) * 100)}%${margin}`,
          once: true,
        },
      },
    );
  }, { scope: ref, dependencies: [text, delay, duration, ease, threshold, rootMargin] });

  const fragments = Array.from(text).reduce((items, character) => {
    if (/^[，。！？；：、]/.test(character) && items.length) {
      items[items.length - 1] += character;
    } else {
      items.push(character);
    }
    return items;
  }, []);

  return (
    <Tag ref={ref} className={`split-parent ${className}`}>
      {fragments.map((fragment, index) => (
        <span className="split-char" key={`${fragment}-${index}`}>{fragment === ' ' ? '\u00a0' : fragment}</span>
      ))}
    </Tag>
  );
}
