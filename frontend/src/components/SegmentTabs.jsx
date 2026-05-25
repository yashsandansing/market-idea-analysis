import { SEGMENTS } from '../data'

export default function SegmentTabs({ segments, active, cohortN, onChange }) {
  return (
    <div className="seg-tabs">
      {segments.map(id => {
        const seg = SEGMENTS.find(x => x.id === id)
        if (!seg) return null
        const n = cohortN?.[id] ?? seg.n
        return (
          <button
            key={id}
            className={'seg-tab' + (id === active ? ' active' : '')}
            onClick={() => onChange(id)}
          >
            <span className="seg-tab-dot" />
            <span className="seg-tab-name">{seg.name}</span>
            <span className="seg-tab-n">n={n.toLocaleString()}</span>
          </button>
        )
      })}
    </div>
  )
}
