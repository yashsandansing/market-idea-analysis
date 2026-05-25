import SectionSkeleton from './SectionSkeleton'

export default function OKRsSection({ data, streaming, seg, onRerun }) {
  const okrs = data?.okrs

  return (
    <section id="sec-okrs" className="section">
      <div className="section-head">
        <span className="num">◉</span>
        <h2>Marketing OKRs</h2>
        <span className="pill">{seg}</span>
        <button className="section-rerun" onClick={onRerun} disabled={streaming} title="Regenerate">↺</button>
      </div>
      <p className="section-desc">Objectives and measurable key results to guide this segment's marketing focus over the next quarter.</p>
      {!okrs ? (
        <SectionSkeleton streaming={streaming} />
      ) : (
        <div className="card">
          {okrs.map((okr, i) => (
            <div key={i} className="okr">
              <div className="okr-head">
                <span className="okr-num">O{i + 1}</span>
                <div className={'okr-o ' + (streaming ? 'shimmer' : 'fade-in')}>{okr.o}</div>
                <div className="okr-conf">
                  <span className="conf-bar" style={{ width: 60, height: 4 }}>
                    <span className="conf-fill" style={{ width: `${Math.round(okr.confidence * 100)}%` }} />
                  </span>
                  {Math.round(okr.confidence * 100)}%
                </div>
              </div>
              {okr.krs.map((kr, j) => (
                <div key={j} className={'kr ' + (streaming ? 'shimmer' : 'fade-in')}>
                  <span className="kr-mk">KR{j + 1}</span>
                  <span>{kr}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
