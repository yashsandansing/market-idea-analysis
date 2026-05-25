import SectionSkeleton from './SectionSkeleton'

export default function ChannelsSection({ data, streaming, seg, onRerun }) {
  const channels = data?.channels

  return (
    <section id="sec-channels" className="section">
      <div className="section-head">
        <span className="num">◰</span>
        <h2>Channels &amp; Distribution</h2>
        <span className="pill">{seg}</span>
        <button className="section-rerun" onClick={onRerun} disabled={streaming} title="Regenerate">↺</button>
      </div>
      <p className="section-desc">Recommended channel mix to reach and convert this segment, ranked by budget allocation.</p>
      {!channels ? (
        <SectionSkeleton streaming={streaming} />
      ) : (
        <div className="card">
          <div className="chan-list">
            {(() => {
              const maxMix = Math.max(...channels.map(c => c.mix))
              return channels.map((c, i) => (
                <div key={i} className={'chan-row ' + (streaming ? 'shimmer' : 'fade-in')}>
                  <span className="chan-rank">{String(i + 1).padStart(2, '0')}</span>
                  <div className="chan-name-col">
                    <span className="chan-name">{c.name}</span>
                    <div className="chan-note">{c.note}</div>
                  </div>
                  <div className="chan-bar">
                    <div
                      className="chan-bar-fill"
                      style={{ width: streaming ? '0%' : `${(c.mix / maxMix) * 100}%` }}
                    />
                  </div>
                  <span className="chan-pct">{Math.round(c.mix * 100)}%</span>
                </div>
              ))
            })()}
          </div>
        </div>
      )}
    </section>
  )
}
