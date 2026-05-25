import React from 'react'
import { SEG_PANEL } from '../segments/segmentsData'
import Segments3D from '../segments/Segments3D'
import SegmentsGrid from '../segments/SegmentsGrid'
import '../segments/segments.css'

const LAY_SP = SEG_PANEL

function useSegmentsState() {
  const [rows, setRows]       = React.useState(() => [...LAY_SP.PANEL])
  const [columns, setColumns] = React.useState(() => [...LAY_SP.COLUMNS])
  const [highlight, setHighlight] = React.useState(new Set())
  const [active, setActive]   = React.useState(null)
  const [mode, setMode]       = React.useState('latent')
  const [pinned, setPinned]   = React.useState(null)
  return { rows, setRows, columns, setColumns, highlight, setHighlight, active, setActive, mode, setMode, pinned, setPinned }
}

// ── Latent Space Modal ───────────────────────────────────────────
function LatentSpaceModal({ s, onClose }) {
  const [size, setSize] = React.useState({ w: 800, h: 600 })
  const heroRef = React.useRef(null)

  React.useEffect(() => {
    if (!heroRef.current) return
    const ro = new ResizeObserver((es) => {
      const r = es[0].contentRect
      setSize({ w: r.width, h: r.height })
    })
    ro.observe(heroRef.current)
    return () => ro.disconnect()
  }, [])

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="ls-modal-backdrop" onClick={onClose}>
      <div className="ls-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ls-modal-3d" ref={heroRef}>
          <Segments3D rows={s.rows} width={size.w} height={size.h}
            mode={s.mode} onModeChange={s.setMode}
            onLassoSelect={s.setHighlight}
            externalHi={s.active ? new Set([s.active]) : new Set()}
            pinned={s.pinned} setPinned={s.setPinned} />
          <div className="ls-modal-overlay-top">
            <div className="ls-modal-title-card">
              <h2 className="ls-modal-title">Latent <em>space</em></h2>
              <p className="ls-modal-sub">
                Each dot is a synthetic respondent. Shift-drag to lasso a cluster.
              </p>
            </div>
            <div className="ls-modal-legend">
              <div className="ls-modal-legend-h">Segments</div>
              {LAY_SP.SEGMENTS.map((seg) => (
                <div key={seg.id} className="ls-modal-legend-row">
                  <span className="dot" style={{ background: seg.color }} />
                  <span>{seg.name}</span>
                  <span className="n">{seg.n}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="ls-modal-close" onClick={onClose} title="Close (Esc)">✕</button>
        </div>
      </div>
    </div>
  )
}

// ── Attribute radial chart ───────────────────────────────────────
function AttributeRadial({ row }) {
  const dims = [
    { k: 'sustainability',    l: 'Sustain.' },
    { k: 'price_sensitivity', l: 'Price-sens.' },
    { k: 'tech_optimism',     l: 'Tech-opt.' },
    { k: 'novelty_seeking',   l: 'Novelty' },
    { k: 'brand_loyalty',     l: 'Brand loy.' },
  ]
  const cx = 110, cy = 110, R = 78
  const n = dims.length
  const pt = (i, r) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  }
  const path = dims.map((d, i) => {
    const p = pt(i, (row[d.k] / 10) * R)
    return (i ? 'L' : 'M') + p.x + ' ' + p.y
  }).join(' ') + ' Z'

  return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <polygon key={t}
          points={dims.map((_, i) => { const p = pt(i, R * t); return p.x + ',' + p.y }).join(' ')}
          fill="none" stroke="var(--rule)" strokeWidth="0.75" />
      ))}
      {dims.map((_, i) => {
        const p = pt(i, R)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--rule)" strokeWidth="0.5" />
      })}
      <path d={path} fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="1.5" />
      {dims.map((d, i) => {
        const p = pt(i, (row[d.k] / 10) * R)
        return <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--accent)" stroke="white" strokeWidth="1.5" />
      })}
      {dims.map((d, i) => {
        const lp = pt(i, R + 16)
        return (
          <text key={i} x={lp.x} y={lp.y} fontSize="10" fill="var(--muted)" textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace" dy={i === 0 ? 0 : lp.y > cy ? 3 : 0}>
            {d.l}
          </text>
        )
      })}
    </svg>
  )
}

function nearestNeighbours(rows, target, k) {
  const others = rows.filter((r) => r.id !== target.id)
  others.sort((a, b) => {
    const da = (a.latent_x - target.latent_x) ** 2 + (a.latent_y - target.latent_y) ** 2 + (a.latent_z - target.latent_z) ** 2
    const db = (b.latent_x - target.latent_x) ** 2 + (b.latent_y - target.latent_y) ** 2 + (b.latent_z - target.latent_z) ** 2
    return da - db
  })
  return others.slice(0, k)
}

// ── Workshop layout ──────────────────────────────────────────────
function WorkshopLayout() {
  const s = useSegmentsState()
  const [activeSeg, setActiveSeg] = React.useState('genz')
  const [modalOpen, setModalOpen] = React.useState(false)
  const filteredRows = s.rows.filter((r) => r.segment === activeSeg)
  const activeRow = s.rows.find((r) => r.id === s.active)

  return (
    <div className="lay-workshop">
      {modalOpen && <LatentSpaceModal s={s} onClose={() => setModalOpen(false)} />}

      <div className="ws-topbar">
        <div className="ws-title">Segments <em>workshop</em></div>
        <span className="ws-meta">panel · {LAY_SP.PANEL.length}</span>
        <span className="ws-meta">{LAY_SP.SEGMENTS.length} cohorts</span>
        <div className="ws-spacer" />
        <button className="tb-btn">Saved views</button>
        <button className="tb-btn">Commission cohort</button>
        <button className="ws-cta">＋ New segment from selection</button>
      </div>

      <div className="ws-side">
        <div className="ws-side-h">Cohorts</div>
        {LAY_SP.SEGMENTS.map((seg) => {
          const members = LAY_SP.PANEL.filter((r) => r.segment === seg.id)
          const bins = new Array(8).fill(0)
          members.forEach((m) => {
            const b = Math.min(7, Math.max(0, Math.floor((m.age - 18) / 8)))
            bins[b]++
          })
          const maxB = Math.max(...bins, 1)
          return (
            <div key={seg.id} className={'ws-seg-card' + (activeSeg === seg.id ? ' on' : '')} onClick={() => setActiveSeg(seg.id)}>
              <div className="ws-seg-name">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: seg.color }} />
                {seg.name}
              </div>
              <div className="ws-seg-n">n = {seg.n} · ages {seg.age[0]}–{seg.age[1]}</div>
              <div className="ws-spark">
                {bins.map((b, i) => (
                  <span key={i} style={{ height: (b / maxB) * 100 + '%', background: seg.color }} />
                ))}
              </div>
            </div>
          )
        })}
        <div className="ws-side-h" style={{ marginTop: 8 }}>Quick filters</div>
        <button className="tb-btn" style={{ justifyContent: 'flex-start' }}>★ High sustainability + high income</button>
        <button className="tb-btn" style={{ justifyContent: 'flex-start' }}>★ Apartment dwellers, &lt; $80k</button>
        <button className="tb-btn" style={{ justifyContent: 'flex-start' }}>＋ Save current view</button>
      </div>

      <div className="ws-center">
        <div className="ws-3d-strip">
          <Segments3D rows={s.rows} width={780} height={220}
            mode={s.mode} onModeChange={s.setMode}
            onLassoSelect={s.setHighlight}
            externalHi={new Set([...(activeRow ? [activeRow.id] : []), ...s.highlight])}
            pinned={s.pinned} setPinned={s.setPinned} showLabels={false} />
          <button className="ws-3d-expand-btn" onClick={() => setModalOpen(true)} title="Enlarge latent space">
            ↗ Enlarge
          </button>
        </div>
        <div className="ws-grid-wrap">
          <SegmentsGrid rows={filteredRows} setRows={s.setRows} columns={s.columns} setColumns={s.setColumns}
            variant="workshop" rowHighlight={s.highlight} onActiveChange={s.setActive} />
        </div>
      </div>

      <div className="ws-inspector">
        {!activeRow ? (
          <div className="ws-insp-empty">
            Hover or select a respondent in the table or 3D view to inspect.
          </div>
        ) : (
          <>
            <div className="ws-insp-h">Inspecting respondent</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{activeRow.id}</div>
            <div className="ws-insp-name">{activeRow.name}</div>
            <div className="ws-insp-meta">{activeRow.age} · {activeRow.city}, {activeRow.state} · {activeRow.occupation}</div>
            <div className="ws-insp-quote">{activeRow.quote}</div>
            <div className="ws-insp-h">Attribute fingerprint</div>
            <div className="ws-radial"><AttributeRadial row={activeRow} /></div>
            <div className="ws-insp-h">Detail</div>
            <div className="ws-insp-fields">
              <span className="ws-insp-field-k">Household</span>
              <span className="ws-insp-field-k">Income</span>
              <span className="ws-insp-field-v">{activeRow.household}</span>
              <span className="ws-insp-field-v">${activeRow.income}k</span>
              <span className="ws-insp-field-k">Education</span>
              <span className="ws-insp-field-k">Stage</span>
              <span className="ws-insp-field-v">{activeRow.education}</span>
              <span className="ws-insp-field-v">{activeRow.lifecycle}</span>
            </div>
            <div className="ws-insp-h">Top brands</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
              {activeRow.top_brands.map((b, i) => <span key={i} className="sg-mini-chip">{b}</span>)}
            </div>
            <div className="ws-insp-h">Nearest neighbours</div>
            <div className="ws-similar">
              {nearestNeighbours(s.rows, activeRow, 4).map((r) => {
                const seg = LAY_SP.SEGMENTS.find((x) => x.id === r.segment)
                return (
                  <div key={r.id} className="ws-sim" onClick={() => s.setActive(r.id)}>
                    <span className="ws-sim-dot" style={{ background: seg?.color }} />
                    <span>{r.name}, {r.age}</span>
                    <span className="ws-sim-id">{r.id}</span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function SegmentsPage() {
  return (
    <div className="seg-page">
      <div className="seg-page-body">
        <WorkshopLayout key="workshop" />
      </div>
    </div>
  )
}
