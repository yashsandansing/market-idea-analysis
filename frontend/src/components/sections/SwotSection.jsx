import SectionSkeleton from './SectionSkeleton'

const QUADRANTS = [
  { key: 'strengths',     cls: 'swot-s', badge: 'S', title: 'Strengths'     },
  { key: 'weaknesses',    cls: 'swot-w', badge: 'W', title: 'Weaknesses'    },
  { key: 'opportunities', cls: 'swot-o', badge: 'O', title: 'Opportunities' },
  { key: 'threats',       cls: 'swot-t', badge: 'T', title: 'Threats'       },
]

export default function SwotSection({ data, streaming, seg, onRerun }) {
  const hasAny = QUADRANTS.some(q => Array.isArray(data?.[q.key]))

  return (
    <section id="sec-swot" className="section">
      <div className="section-head">
        <span className="num">◇</span>
        <h2>SWOT</h2>
        <span className="pill">{seg}</span>
        <button className="section-rerun" onClick={onRerun} disabled={streaming} title="Regenerate">↺</button>
      </div>
      <p className="section-desc">Internal strengths and weaknesses alongside external opportunities and threats relevant to this segment.</p>
      {!hasAny ? (
        <SectionSkeleton streaming={streaming} />
      ) : (
        <div className="swot-grid">
          {QUADRANTS.map(q => {
            const items = data[q.key]
            return (
              <div key={q.key} className={`swot-card ${q.cls}`}>
                <div className="swot-head">
                  <span className="badge">{q.badge}</span>
                  <h3>{q.title}</h3>
                  {items && <span className="count">{items.length}</span>}
                </div>
                <div className="swot-body">
                  {!items ? (
                    <div className="swot-row shimmer" style={{ height: 60 }} />
                  ) : items.map((item, i) => (
                    <div key={i} className={'swot-row ' + (streaming ? 'shimmer' : 'fade-in')}>
                      <span className="mk">→</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
