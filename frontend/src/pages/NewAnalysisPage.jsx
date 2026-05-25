import { useState } from 'react'
import { PRODUCTS, OBJECTIVES, SEGMENTS } from '../data'

function ComboField({ label, hint, value, onChange, suggestions, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="na-field">
      <label className="na-label">{label}</label>
      <div className={'na-input-wrap' + (focused ? ' focused' : '')}>
        <input
          className="na-input"
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
        />
        {value && (
          <button className="na-input-clear" onClick={() => onChange('')} aria-label="Clear">×</button>
        )}
      </div>
      <div className="na-hint">{hint}</div>
      <div className="na-suggest">
        {suggestions.map(s => (
          <button
            key={s.id || s}
            className={'na-chip' + (value.toLowerCase() === (s.name || s).toLowerCase() ? ' on' : '')}
            onClick={() => onChange(s.name || s)}
          >
            {s.emoji && <span style={{ marginRight: 6 }}>{s.emoji}</span>}
            {s.name || s}
          </button>
        ))}
      </div>
    </div>
  )
}

function SegmentCard({ seg, selected, n, totalN, onToggle, onN }) {
  const min  = 50
  const max  = seg.n
  const step = 50
  const pct  = ((n - min) / (max - min)) * 100
  const stop = e => e.stopPropagation()

  return (
    <div className={'na-seg' + (selected ? ' on' : '')} onClick={() => onToggle(seg.id)}>
      <div className="na-seg-top">
        <span className={'na-seg-check' + (selected ? ' on' : '')}>
          {selected ? '✓' : ''}
        </span>
        <span className="na-seg-n">
          available <span style={{ color: 'var(--ink-2)' }}>{seg.n.toLocaleString()}</span>
        </span>
      </div>
      <div className="na-seg-name">{seg.name}</div>
      <div className="na-seg-sub">{seg.sub}</div>

      {selected && (
        <div className="na-seg-slider" onClick={stop}>
          <div className="na-seg-slider-row">
            <span className="na-seg-slider-lbl">Sample size</span>
            <span className="na-seg-slider-val">
              n = <strong>{n.toLocaleString()}</strong>
              <span className="na-seg-slider-pct"> · {totalN > 0 ? Math.round((n / totalN) * 100) : 0}% of panel</span>
            </span>
          </div>
          <input
            type="range"
            className="na-range"
            min={min} max={max} step={step}
            value={n}
            onChange={e => onN(seg.id, +e.target.value)}
            onClick={stop}
            onMouseDown={stop}
            style={{ '--pct': pct + '%' }}
          />
          <div className="na-seg-slider-scale">
            <span>{min}</span>
            <span>{max.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function NewAnalysisPage({ onCancel, onGenerate }) {
  const [product, setProduct]         = useState('')
  const [description, setDescription] = useState('')
  const [objective, setObjective]     = useState('')
  const [picked, setPicked]           = useState([])

  const defaultN = seg => Math.min(500, Math.max(50, Math.round(seg.n / 4 / 50) * 50))
  const [cohortN, setCohortN] = useState(() =>
    Object.fromEntries(SEGMENTS.map(s => [s.id, defaultN(s)]))
  )

  const setN       = (id, v) => setCohortN(prev => ({ ...prev, [id]: v }))
  const togglePick = id => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const ready   = product.trim() && objective.trim() && picked.length > 0
  const totalN  = picked.reduce((acc, id) => acc + (cohortN[id] || 0), 0)
  const seconds = Math.round(picked.length * 9 * 6 + totalN * 0.04)
  const estLabel = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

  const submit = () => {
    if (!ready) return
    onGenerate({
      product:     product.trim(),
      description: description.trim(),
      objective:   objective.trim(),
      segments:    picked,
      cohortN:     Object.fromEntries(picked.map(id => [id, cohortN[id]])),
    })
  }

  return (
    <div className="na-page">
      <div className="na-inner">
        <div className="na-eyebrow">
          <button className="na-back" onClick={onCancel}>← Back</button>
          <span className="na-step">New analysis</span>
        </div>

        <h1 className="na-title">New analysis</h1>
        <p className="na-lede">
          Pick a product, a business objective, and one or more market segments.
          We&rsquo;ll run nine prompt categories per segment and assemble a navigable report.
        </p>

        <ComboField
          label="Product"
          hint="What you're analysing. Type your own or choose a suggestion."
          value={product}
          onChange={setProduct}
          suggestions={PRODUCTS}
          placeholder="e.g. Recycled-fibre running shoes"
        />

        <div className="na-field">
          <label className="na-label">
            Product description
            <span className="na-optional">Optional</span>
          </label>
          <div className={'na-input-wrap na-textarea-wrap' + (description ? ' has-value' : '')}>
            <textarea
              className="na-input na-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Materials, price band, who it's for, what makes it different. Two or three sentences is plenty."
              rows={3}
              maxLength={600}
            />
            {description && (
              <button className="na-input-clear na-textarea-clear" onClick={() => setDescription('')} aria-label="Clear">×</button>
            )}
          </div>
          <div className="na-hint na-hint-row">
            <span>Gives the model a richer brief — more specific outputs, fewer generic answers.</span>
            <span className="na-count">{description.length}/600</span>
          </div>
        </div>

        <ComboField
          label="Business objective"
          hint="What success looks like. Custom objectives are allowed — keep them measurable."
          value={objective}
          onChange={setObjective}
          suggestions={OBJECTIVES}
          placeholder="e.g. Grow trial among lapsed runners"
        />

        <div className="na-field">
          <label className="na-label">Market segments</label>
          <div className="na-hint" style={{ marginBottom: 12 }}>
            Pick one or more pre-recruited cohorts. New cohorts can be commissioned from the Segments workspace.
          </div>
          <div className="na-seg-grid">
            {SEGMENTS.map(seg => (
              <SegmentCard
                key={seg.id}
                seg={seg}
                selected={picked.includes(seg.id)}
                n={cohortN[seg.id]}
                totalN={totalN}
                onToggle={togglePick}
                onN={setN}
              />
            ))}
            <div className="na-seg na-seg-add" title="Coming soon">
              <div className="na-seg-top">
                <span className="na-seg-check">+</span>
                <span className="na-seg-n na-locked">locked</span>
              </div>
              <div className="na-seg-name">Custom cohort</div>
              <div className="na-seg-sub">Brief our panel team to recruit a new segment for this analysis.</div>
            </div>
          </div>
        </div>

        <div className="na-actions">
          <div className="na-est">
            {ready ? (
              <>
                <span className="na-est-num">{estLabel}</span>
                <span className="na-est-label">
                  estimated · {picked.length * 9} prompts × {totalN.toLocaleString()} respondents across {picked.length} segment{picked.length === 1 ? '' : 's'}
                </span>
              </>
            ) : (
              <span className="na-est-label">
                {!product.trim()    && '• Add a product '}
                {!objective.trim()  && '• Add an objective '}
                {picked.length === 0 && '• Pick at least one segment'}
              </span>
            )}
          </div>
          <div className="na-buttons">
            <button className="na-btn ghost" onClick={onCancel}>Cancel</button>
            <button
              className={'na-btn primary' + (ready ? '' : ' disabled')}
              onClick={submit}
            >
              Generate analysis →
            </button>
          </div>
        </div>

        <div className="na-fineprint">
          Outputs are synthesised from the selected cohorts&rsquo; survey responses and a language model.
          Runs are auto-saved to your workspace.{' '}
          <span style={{ textDecoration: 'underline' }}>How synthesis works</span>.
        </div>
      </div>
    </div>
  )
}
