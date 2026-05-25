import SectionSkeleton from './SectionSkeleton'

export default function PersonaSection({ data, streaming, seg, onRerun }) {
  const p = data?.persona

  return (
    <section id="sec-persona" className="section">
      <div className="section-head">
        <span className="num">◯</span>
        <h2>Buyer Persona</h2>
        <span className="pill">{seg}</span>
        <button className="section-rerun" onClick={onRerun} disabled={streaming} title="Regenerate">↺</button>
      </div>
      <p className="section-desc">A composite profile of the ideal customer in this segment — their goals, pain points, and motivations.</p>
      {!p ? (
        <SectionSkeleton streaming={streaming} />
      ) : (
        <div className={'persona ' + (streaming ? 'shimmer' : 'fade-in')}>
          <div className="persona-side">
            <div className="persona-avatar">
              {p.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
            </div>
            <div className="persona-name">{p.name}</div>
            <div className="persona-meta">{p.age} · {p.city}</div>
            <div className="persona-meta">{p.role}</div>
            <div className="persona-meta">{p.income}</div>
            <div className="persona-tags">
              {p.channels.map(c => (
                <span key={c} className="persona-tag">{c}</span>
              ))}
            </div>
            <button
              className="talk-buyer-btn"
              onClick={() => alert('Talk with buyer is coming soon — this feature is a mock.')}
            >
              ↗ Talk with buyer
            </button>
          </div>
          <div className="persona-main">
            <div className="persona-quote">{p.quote}</div>
            <div className="persona-two">
              <div>
                <div className="persona-h">Goals</div>
                <ul className="persona-list goals">
                  {p.goals.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
              <div>
                <div className="persona-h">Pain points</div>
                <ul className="persona-list pains">
                  {p.pains.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
