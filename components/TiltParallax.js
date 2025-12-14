import { useEffect, useRef } from 'react';

export default function TiltParallax({ className = '', children, maxTilt = 10 }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let frame = 0;
    const state = { x: 0, y: 0, tx: 0, ty: 0 };

    const onMove = (event) => {
      const rect = root.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      state.tx = (px - 0.5) * 2;
      state.ty = (py - 0.5) * 2;
      root.style.setProperty('--vx', String(px));
      root.style.setProperty('--vy', String(py));
    };

    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
      root.style.setProperty('--vx', '0.5');
      root.style.setProperty('--vy', '0.5');
      root.dataset.active = 'false';
    };

    const onEnter = () => {
      root.dataset.active = 'true';
    };

    const animate = () => {
      state.x += (state.tx - state.x) * 0.22;
      state.y += (state.ty - state.y) * 0.22;
      root.style.setProperty('--rx', String((-state.y * maxTilt).toFixed(3)));
      root.style.setProperty('--ry', String((state.x * (maxTilt * 1.4)).toFixed(3)));
      root.style.setProperty('--tx', String((state.x * 14).toFixed(3)));
      root.style.setProperty('--ty', String((state.y * 10).toFixed(3)));
      frame = requestAnimationFrame(animate);
    };

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave, { passive: true });
    root.addEventListener('pointerenter', onEnter, { passive: true });
    root.dataset.active = 'false';
    frame = requestAnimationFrame(animate);

    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerenter', onEnter);
      cancelAnimationFrame(frame);
    };
  }, [maxTilt]);

  return (
    <div ref={rootRef} className={`tilt-parallax ${className}`.trim()}>
      {children}
    </div>
  );
}
