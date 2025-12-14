import { useEffect, useRef } from 'react';

export default function InteractiveIcon({
  className = '',
  children,
  maxTilt = 12,
  enableRotation = false
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Check for reduced motion preference
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
      state.tx = (px - 0.5) * 2;  // Normalize to -1 to 1
      state.ty = (py - 0.5) * 2;
    };

    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
    };

    const animate = () => {
      // Smooth interpolation (easing factor 0.15)
      state.x += (state.tx - state.x) * 0.15;
      state.y += (state.ty - state.y) * 0.15;

      // Calculate rotation angles
      const rotateX = -state.y * maxTilt;
      const rotateY = state.x * maxTilt;
      const iconRotate = enableRotation ? state.x * 5 : 0;

      // Set CSS custom properties
      root.style.setProperty('--icon-rx', rotateX.toFixed(3));
      root.style.setProperty('--icon-ry', rotateY.toFixed(3));
      root.style.setProperty('--icon-rotate', iconRotate.toFixed(3));

      frame = requestAnimationFrame(animate);
    };

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave, { passive: true });
    frame = requestAnimationFrame(animate);

    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [maxTilt, enableRotation]);

  return (
    <div ref={rootRef} className={`interactive-icon ${className}`.trim()}>
      {children}
    </div>
  );
}
