import { useEffect, useRef } from 'react';

export default function InteractiveVision3D({ variant = 'product' }) {
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
    const state = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
    };

    const onMove = (event) => {
      const rect = root.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      state.tx = (px - 0.5) * 2;
      state.ty = (py - 0.5) * 2;
      root.style.setProperty('--vx', String(px));
      root.style.setProperty('--vy', String(py));
    };

    const animate = () => {
      state.x += (state.tx - state.x) * 0.08;
      state.y += (state.ty - state.y) * 0.08;
      root.style.setProperty('--rx', String((-state.y * 10).toFixed(3)));
      root.style.setProperty('--ry', String((state.x * 14).toFixed(3)));
      frame = requestAnimationFrame(animate);
    };

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener(
      'pointerleave',
      () => {
        state.tx = 0;
        state.ty = 0;
        root.style.setProperty('--vx', '0.5');
        root.style.setProperty('--vy', '0.5');
      },
      { passive: true }
    );

    frame = requestAnimationFrame(animate);
    return () => {
      root.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className={`vision3d ${variant === 'hero' ? 'vision3d--hero' : 'vision3d--product'}`} aria-hidden="true">
      <div className="vision3d-stage">
        <div className="vision3d-stack">
          <div className="vision3d-stackCard is-far" data-depth="far">
            <div className="vision3d-cardTop">
              <span className="vision3d-pill">Export</span>
              <span className="vision3d-meta">PDF</span>
            </div>
            <div className="vision3d-title">Board-ready Report</div>
            <div className="vision3d-lines">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="vision3d-stackCard is-back" data-depth="back">
            <div className="vision3d-cardTop">
              <span className="vision3d-pill">Evidence</span>
              <span className="vision3d-meta">Audit Trail</span>
            </div>
            <div className="vision3d-title">Approvals & Rationale</div>
            <div className="vision3d-lines">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="vision3d-stackCard is-mid" data-depth="mid">
            <div className="vision3d-cardTop">
              <span className="vision3d-pill">Perimeter</span>
              <span className="vision3d-meta">PERG 8</span>
            </div>
            <div className="vision3d-title">Invitation or Inducement?</div>
            <div className="vision3d-choiceRow">
              <span className="vision3d-choice">Yes</span>
              <span className="vision3d-choice">No</span>
              <span className="vision3d-choice">Unsure</span>
            </div>
          </div>

          <div className="vision3d-stackCard is-front" data-depth="front">
            <div className="vision3d-cardTop">
              <span className="vision3d-pill is-accent">FinProms</span>
              <span className="vision3d-meta">Live</span>
            </div>
            <div className="vision3d-title">Compliance Snapshot</div>
            <div className="vision3d-gauges">
              <div className="vision3d-gauge">
                <span>FSMA s21</span>
                <div className="vision3d-bar"><i style={{ '--p': '78%' }} /></div>
              </div>
              <div className="vision3d-gauge">
                <span>Consumer Duty</span>
                <div className="vision3d-bar"><i style={{ '--p': '62%' }} /></div>
              </div>
              <div className="vision3d-gauge">
                <span>Risk Warnings</span>
                <div className="vision3d-bar"><i style={{ '--p': '86%' }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
