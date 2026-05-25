import SectionSkeleton from './SectionSkeleton'

export default function PositioningSection({ data, streaming, seg, onRerun }) {
  const pos = data?.positioning

  return (
    <section id="sec-positioning" className="section">
      <div className="section-head">
        <span className="num">◎</span>
        <h2>Market Positioning</h2>
        <span className="pill">{seg}</span>
        <button className="section-rerun" onClick={onRerun} disabled={streaming} title="Regenerate">↺</button>
      </div>
      <p className="section-desc">How your product sits relative to competitors on the axes that matter most to this segment.</p>
      {!pos ? (
        <SectionSkeleton streaming={streaming} />
      ) : (
        <div className="card">
          <div className="pos-wrap">
            <div>
              <div className={'pos-statement ' + (streaming ? 'shimmer' : 'fade-in')}>{pos.statement}</div>
              <div className="pos-meta">
                <span>{pos.axes.x[0]} ↔ {pos.axes.x[1]}</span>
                <span>{pos.axes.y[0]} ↔ {pos.axes.y[1]}</span>
              </div>
            </div>
            <div className="pos-canvas">
              <div className="axis-x" />
              <div className="axis-y" />
              <span className="axis-l ax-w">{pos.axes.x[0]}</span>
              <span className="axis-l ax-e">{pos.axes.x[1]}</span>
              <span className="axis-l ax-n">{pos.axes.y[1]}</span>
              <span className="axis-l ax-s">{pos.axes.y[0]}</span>
              {pos.comp.map((c, i) => (
                <span key={i}>
                  <div className="pos-dot" style={{ left: `${c.x * 100}%`, top: `${(1 - c.y) * 100}%` }} />
                  <div className="pos-label" style={{ left: `${c.x * 100}%`, top: `${(1 - c.y) * 100}%` }}>{c.name}</div>
                </span>
              ))}
              <div className="pos-dot us" style={{ left: `${pos.us.x * 100}%`, top: `${(1 - pos.us.y) * 100}%` }} />
              <div className="pos-label us" style={{ left: `${pos.us.x * 100}%`, top: `${(1 - pos.us.y) * 100}%` }}>Us</div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
