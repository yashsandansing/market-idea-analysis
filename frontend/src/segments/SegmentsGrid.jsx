import React from 'react'
import { SEG_PANEL } from './segmentsData'

const SP = SEG_PANEL

const formatCell = (v, col) => {
  if (v == null) return ''
  if (col.kind === 'num' && col.format === 'usd') return '$' + v.toLocaleString()
  if (col.kind === 'pct') return Math.round(v * 100) + '%'
  if (col.kind === 'chips') return Array.isArray(v) ? v.join(', ') : v
  return String(v)
}

const segById = (id) => SP.SEGMENTS.find((s) => s.id === id)

function Cell({ col, row, editing, onStart, onCommit, onCancel }) {
  const v = row[col.key]

  if (editing) {
    if (col.kind === 'select') {
      return (
        <select autoFocus className="sg-editor" defaultValue={v}
          onBlur={(e) => onCommit(e.target.value)}
          onChange={(e) => onCommit(e.target.value)}>
          {col.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )
    }
    if (col.kind === 'segment') {
      return (
        <select autoFocus className="sg-editor" defaultValue={v}
          onBlur={(e) => onCommit(e.target.value)}
          onChange={(e) => onCommit(e.target.value)}>
          {SP.SEGMENTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      )
    }
    if (col.kind === 'score' || col.kind === 'num' || col.kind === 'pct') {
      return (
        <input autoFocus type="number" className="sg-editor"
          step={col.kind === 'score' ? 0.1 : 1}
          defaultValue={col.kind === 'pct' ? Math.round(v * 100) : v}
          onBlur={(e) => {
            let n = parseFloat(e.target.value)
            if (Number.isNaN(n)) return onCancel()
            if (col.kind === 'pct') n = n / 100
            if (col.kind === 'score') n = Math.max(1, Math.min(10, n))
            onCommit(n)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.target.blur()
            if (e.key === 'Escape') onCancel()
          }} />
      )
    }
    if (col.kind === 'chips') {
      return (
        <input autoFocus type="text" className="sg-editor"
          defaultValue={Array.isArray(v) ? v.join(', ') : v}
          onBlur={(e) => onCommit(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.target.blur()
            if (e.key === 'Escape') onCancel()
          }} />
      )
    }
    return (
      <input autoFocus type="text" className="sg-editor" defaultValue={v}
        onBlur={(e) => onCommit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.target.blur()
          if (e.key === 'Escape') onCancel()
        }} />
    )
  }

  const open = () => { if (col.editable !== false) onStart() }

  if (col.kind === 'segment') {
    const s = segById(v)
    return (
      <div className="sg-cell" onClick={open}>
        <span className="sg-seg-pill" style={{
          background: s ? s.color + '18' : 'transparent',
          color: s ? s.color : 'var(--muted)',
          borderColor: s ? s.color + '40' : 'var(--rule)',
        }}>
          <span className="sg-seg-dot" style={{ background: s ? s.color : 'var(--faint)' }} />
          {s ? s.name : v}
        </span>
      </div>
    )
  }

  if (col.kind === 'score') {
    const pct = ((v - 1) / 9) * 100
    return (
      <div className="sg-cell sg-cell-score" onClick={open}>
        <span className="sg-score-bar">
          <span className="sg-score-fill" style={{ width: pct + '%' }} />
        </span>
        <span className="sg-score-v">{Number(v).toFixed(1)}</span>
      </div>
    )
  }

  if (col.kind === 'chips') {
    const arr = Array.isArray(v) ? v : []
    return (
      <div className="sg-cell sg-cell-chips" onClick={open}>
        {arr.slice(0, 3).map((c, i) => <span key={i} className="sg-mini-chip">{c}</span>)}
        {arr.length > 3 && <span className="sg-mini-chip sg-overflow">+{arr.length - 3}</span>}
      </div>
    )
  }

  if (col.kind === 'longtext') {
    return (
      <div className="sg-cell sg-cell-quote" onClick={open}>
        <span className="sg-quote">{v}</span>
      </div>
    )
  }

  if (col.kind === 'tag') {
    return (
      <div className="sg-cell" onClick={open}>
        <span className="sg-tag">{v}</span>
      </div>
    )
  }

  if (col.kind === 'mono') {
    return (
      <div className={'sg-cell sg-cell-mono' + (col.align === 'right' ? ' sg-right' : '')} onClick={open}>
        {formatCell(v, col)}
      </div>
    )
  }

  return (
    <div
      className={'sg-cell' + (col.align === 'right' ? ' sg-right' : '') + (col.kind === 'num' ? ' sg-cell-mono' : '')}
      onClick={open}>
      {formatCell(v, col)}
    </div>
  )
}

function FilterChip({ col, active, value, onChange }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (!open) return
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const label = active
    ? col.kind === 'score' || col.kind === 'num'
      ? `${col.label}: ${value[0]}–${value[1]}`
      : `${col.label}: ${Array.from(value).slice(0, 2).join(', ')}${value.size > 2 ? ` +${value.size - 2}` : ''}`
    : col.label

  return (
    <div className="sg-filter-wrap" ref={ref}>
      <button className={'sg-filter-chip' + (active ? ' on' : '')} onClick={() => setOpen((o) => !o)}>
        {label}
        <span className="sg-filter-caret">▾</span>
      </button>
      {open && (
        <div className="sg-filter-pop">
          {col.kind === 'score' ? (
            <div className="sg-filter-range">
              <div className="sg-filter-range-row">
                <span>min</span>
                <input type="number" min="1" max="10" step="0.5"
                  defaultValue={value ? value[0] : 1}
                  onChange={(e) => onChange([+e.target.value, value ? value[1] : 10])} />
              </div>
              <div className="sg-filter-range-row">
                <span>max</span>
                <input type="number" min="1" max="10" step="0.5"
                  defaultValue={value ? value[1] : 10}
                  onChange={(e) => onChange([value ? value[0] : 1, +e.target.value])} />
              </div>
              {active && (
                <button className="sg-filter-clear" onClick={() => { onChange(null); setOpen(false) }}>Clear</button>
              )}
            </div>
          ) : (
            <FilterCheckboxList col={col} value={value} onChange={onChange} />
          )}
        </div>
      )}
    </div>
  )
}

function FilterCheckboxList({ col, value, onChange }) {
  const unique = React.useMemo(() => {
    const set = new Set()
    SP.PANEL.forEach((r) => {
      const v = r[col.key]
      if (Array.isArray(v)) v.forEach((x) => set.add(x))
      else if (v != null) set.add(v)
    })
    return [...set].sort()
  }, [col.key])
  const sel = value || new Set()
  const toggle = (v) => {
    const next = new Set(sel)
    next.has(v) ? next.delete(v) : next.add(v)
    onChange(next.size ? next : null)
  }
  return (
    <div className="sg-filter-list">
      {unique.map((u) => (
        <label key={u} className="sg-filter-row">
          <input type="checkbox" checked={sel.has(u)} onChange={() => toggle(u)} />
          {col.kind === 'segment' ? (segById(u)?.name || u) : String(u)}
        </label>
      ))}
    </div>
  )
}

export default function SegmentsGrid({
  rows, setRows,
  columns, setColumns,
  variant = 'editorial',
  rowHighlight = new Set(),
  onActiveChange,
  hideFilters = false,
}) {
  const [editing, setEditing] = React.useState(null)
  const [sort, setSort] = React.useState(null)
  const [filters, setFilters] = React.useState({})
  const [selected, setSelected] = React.useState(new Set())
  const [lastIdx, setLastIdx] = React.useState(-1)
  const [activeRow, setActiveRow] = React.useState(null)

  const filtered = React.useMemo(() => {
    let out = rows
    Object.entries(filters).forEach(([k, v]) => {
      if (!v) return
      const col = columns.find((c) => c.key === k)
      if (!col) return
      if (col.kind === 'score' || col.kind === 'num') {
        out = out.filter((r) => r[k] >= v[0] && r[k] <= v[1])
      } else if (v instanceof Set && v.size) {
        out = out.filter((r) => {
          const rv = r[k]
          if (Array.isArray(rv)) return rv.some((x) => v.has(x))
          return v.has(rv)
        })
      }
    })
    if (sort) {
      out = [...out].sort((a, b) => {
        const av = a[sort.key], bv = b[sort.key]
        const cmp = av < bv ? -1 : av > bv ? 1 : 0
        return sort.dir === 'desc' ? -cmp : cmp
      })
    }
    return out
  }, [rows, filters, sort, columns])

  const allVisibleSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id))

  const toggleSelected = (id, idx, shift) => {
    setActiveRow(id)
    onActiveChange?.(id)
    if (shift && lastIdx >= 0) {
      const lo = Math.min(idx, lastIdx), hi = Math.max(idx, lastIdx)
      const next = new Set(selected)
      for (let i = lo; i <= hi; i++) next.add(filtered[i].id)
      setSelected(next)
    } else {
      const next = new Set(selected)
      next.has(id) ? next.delete(id) : next.add(id)
      setSelected(next)
    }
    setLastIdx(idx)
  }

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const next = new Set(selected)
      filtered.forEach((r) => next.delete(r.id))
      setSelected(next)
    } else {
      const next = new Set(selected)
      filtered.forEach((r) => next.add(r.id))
      setSelected(next)
    }
  }

  const commit = (rowId, colKey, value) => {
    setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, [colKey]: value } : r)))
    setEditing(null)
  }

  const sortByCol = (key) => {
    setSort((s) => {
      if (!s || s.key !== key) return { key, dir: 'asc' }
      if (s.dir === 'asc') return { key, dir: 'desc' }
      return null
    })
  }

  const bulkSetSegment = (newSeg) => {
    setRows((prev) => prev.map((r) => (selected.has(r.id) ? { ...r, segment: newSeg } : r)))
  }

  const bulkAdjustScore = (colKey, delta) => {
    setRows((prev) =>
      prev.map((r) => {
        if (!selected.has(r.id)) return r
        const v = Math.max(1, Math.min(10, +(r[colKey] + delta).toFixed(1)))
        return { ...r, [colKey]: v }
      })
    )
  }

  const addRow = () => {
    const id = 'R-' + String(900 + rows.length).padStart(3, '0')
    const next = {
      id, name: 'New respondent', segment: rows[0]?.segment || 'genz',
      age: 30, gender: '—', city: '—', state: '—', income: 0,
      education: 'Bachelors', household: 'Single', occupation: '—', lifecycle: '—',
      sustainability: 5, price_sensitivity: 5, tech_optimism: 5, novelty_seeking: 5, brand_loyalty: 5,
      top_brands: [], primary_channels: [], last_purchase: '—',
      monthly_discretionary: 0, engagement_rate: 0.5, quote: '—',
      recruited: new Date().toISOString().slice(0, 10),
      latent_x: 0, latent_y: 0, latent_z: 0,
      belief_x: 0, belief_y: 0, belief_z: 0,
    }
    setRows((prev) => [next, ...prev])
  }

  const addColumn = () => {
    const n = columns.filter((c) => c.key.startsWith('custom_')).length + 1
    const key = 'custom_' + n
    setColumns((prev) => [...prev, { key, label: 'Custom ' + n, w: 110, kind: 'text' }])
    setRows((prev) => prev.map((r) => ({ ...r, [key]: '' })))
  }

  const totalW = columns.reduce((s, c) => s + c.w, 0) + 44

  return (
    <div className={'sg sg-' + variant}>
      {!hideFilters && (
        <div className="sg-filters">
          <span className="sg-filters-lbl">Filter</span>
          {columns
            .filter((c) => ['segment','education','household','lifecycle','sustainability','price_sensitivity','tech_optimism','last_purchase'].includes(c.key))
            .map((c) => (
              <FilterChip key={c.key} col={c}
                active={!!filters[c.key]}
                value={filters[c.key]}
                onChange={(v) => setFilters((f) => ({ ...f, [c.key]: v }))} />
            ))}
          {Object.values(filters).some(Boolean) && (
            <button className="sg-filter-reset" onClick={() => setFilters({})}>Reset filters</button>
          )}
          <span style={{ flex: 1 }} />
          <span className="sg-row-count">
            {filtered.length === rows.length
              ? <><strong>{rows.length}</strong> respondents</>
              : <><strong>{filtered.length}</strong> of {rows.length}</>}
          </span>
        </div>
      )}

      {selected.size > 0 && (
        <div className="sg-bulkbar">
          <span className="sg-bulk-count">{selected.size} selected</span>
          <span className="sg-bulk-sep">·</span>
          <span className="sg-bulk-label">Move to segment</span>
          {SP.SEGMENTS.map((s) => (
            <button key={s.id} className="sg-bulk-pill"
              style={{ borderColor: s.color + '50', color: s.color }}
              onClick={() => bulkSetSegment(s.id)}>
              <span className="sg-seg-dot" style={{ background: s.color }} />
              {s.name}
            </button>
          ))}
          <span className="sg-bulk-sep">·</span>
          <span className="sg-bulk-label">Nudge</span>
          {[['sustainability','Sustain.'],['price_sensitivity','Price-sens.'],['tech_optimism','Tech-opt.']].map(([k, l]) => (
            <span key={k} className="sg-nudger">
              <button onClick={() => bulkAdjustScore(k, -0.5)}>−</button>
              <span>{l}</span>
              <button onClick={() => bulkAdjustScore(k, +0.5)}>+</button>
            </span>
          ))}
          <span style={{ flex: 1 }} />
          <button className="sg-bulk-save">＋ Save as new segment</button>
          <button className="sg-bulk-clear" onClick={() => setSelected(new Set())}>Clear</button>
        </div>
      )}

      <div className="sg-viewport">
        <div className="sg-inner" style={{ minWidth: totalW }}>
          <div className="sg-thead">
            <div className="sg-th sg-select">
              <input type="checkbox" checked={allVisibleSelected}
                ref={(el) => { if (el) el.indeterminate = !allVisibleSelected && selected.size > 0 }}
                onChange={toggleSelectAll} />
            </div>
            {columns.map((col) => (
              <div key={col.key}
                className={'sg-th' + (col.pinned ? ' sg-pinned' : '') + (col.align === 'right' ? ' sg-right' : '')}
                style={{ width: col.w }}
                onClick={() => sortByCol(col.key)}>
                <span className="sg-th-lbl">{col.label}</span>
                {sort && sort.key === col.key && (
                  <span className="sg-th-arrow">{sort.dir === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            ))}
            <button className="sg-th sg-add-col" onClick={addColumn} title="Add column">＋</button>
          </div>

          <div className="sg-tbody">
            {filtered.map((row, idx) => {
              const isSel = selected.has(row.id)
              const isHi = rowHighlight.has(row.id)
              const isAct = activeRow === row.id
              return (
                <div key={row.id}
                  className={'sg-tr' + (isSel ? ' sg-sel' : '') + (isHi ? ' sg-hi' : '') + (isAct ? ' sg-act' : '')}
                  onMouseEnter={() => onActiveChange?.(row.id)}>
                  <div className="sg-td sg-select" onClick={(e) => toggleSelected(row.id, idx, e.shiftKey)}>
                    <input type="checkbox" checked={isSel} readOnly />
                    {isHi && <span className="sg-hi-stripe" title="In 3D selection" />}
                  </div>
                  {columns.map((col) => {
                    const isEditing = editing && editing.rowId === row.id && editing.colKey === col.key
                    return (
                      <div key={col.key}
                        className={'sg-td' + (col.pinned ? ' sg-pinned' : '') + (isEditing ? ' sg-editing' : '')}
                        style={{ width: col.w }}>
                        <Cell
                          col={col} row={row} editing={isEditing}
                          onStart={() => setEditing({ rowId: row.id, colKey: col.key })}
                          onCommit={(v) => commit(row.id, col.key, v)}
                          onCancel={() => setEditing(null)} />
                      </div>
                    )
                  })}
                </div>
              )
            })}
            <button className="sg-add-row" onClick={addRow}>＋ Add respondent</button>
          </div>
        </div>
      </div>
    </div>
  )
}
