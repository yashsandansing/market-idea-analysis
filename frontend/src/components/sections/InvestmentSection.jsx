import SectionSkeleton from './SectionSkeleton'

export default function InvestmentSection({ data, streaming, seg, onRerun }) {
  const inv = data?.investment

  return (
    <section id="sec-investment" className="section">
      <div className="section-head">
        <span className="num">◈</span>
        <h2>Investment Opportunity</h2>
        <span className="pill">{seg}</span>
        <button className="section-rerun" onClick={onRerun} disabled={streaming} title="Regenerate">↺</button>
      </div>
      <p className="section-desc">Where to allocate budget and effort for the highest expected return with this segment.</p>
      {!inv ? (
        <SectionSkeleton streaming={streaming} />
      ) : (
        <div className={'card ' + (streaming ? 'shimmer' : 'fade-in')}>
          <div className="inv-head">{inv.headline}</div>
          <div className="inv-stats">
            {inv.stats.map((s, i) => (
              <div key={i} className="inv-stat">
                <div className="inv-stat-k">{s.k}</div>
                <div className="inv-stat-v">{s.v}</div>
              </div>
            ))}
          </div>
          <div className="inv-rationale">{inv.rationale}</div>
        </div>
      )}
    </section>
  )
}
