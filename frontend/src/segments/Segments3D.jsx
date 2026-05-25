import React from 'react'
import { SEG_PANEL } from './segmentsData'

const S3D_SP = SEG_PANEL

const rotXY = (p, rx, ry) => {
  const cx = Math.cos(rx), sx = Math.sin(rx)
  const cy = Math.cos(ry), sy = Math.sin(ry)
  const x1 = p[0] * cy + p[2] * sy
  const z1 = -p[0] * sy + p[2] * cy
  const y2 = p[1] * cx - z1 * sx
  const z2 = p[1] * sx + z1 * cx
  return [x1, y2, z2]
}
const project = (p, w, h, zoom) => {
  const focal = 4
  const s = focal / (focal - p[2])
  return {
    x: w / 2 + p[0] * (Math.min(w, h) * 0.34) * zoom * s,
    y: h / 2 - p[1] * (Math.min(w, h) * 0.34) * zoom * s,
    s, z: p[2],
  }
}

const pointInPoly = (pt, poly) => {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y
    const xj = poly[j].x, yj = poly[j].y
    const intersect =
      yi > pt.y !== yj > pt.y &&
      pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi + 1e-9) + xi
    if (intersect) c = !c
  }
  return c
}

function FloorGrid({ rot, zoom, w, h }) {
  const lines = []
  for (let i = -4; i <= 4; i++) {
    const t = i / 4
    lines.push([[-1, -1, t], [1, -1, t]])
    lines.push([[t, -1, -1], [t, -1, 1]])
  }
  return (
    <g opacity="0.4" style={{ pointerEvents: 'none' }}>
      {lines.map((ln, i) => {
        const a = project(rotXY(ln[0], rot.x, rot.y), w, h, zoom)
        const b = project(rotXY(ln[1], rot.x, rot.y), w, h, zoom)
        return (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#A29B8E" strokeWidth="0.5" />
        )
      })}
    </g>
  )
}

export default function Segments3D({
  rows,
  width = 520, height = 480,
  mode = 'latent',
  onModeChange,
  onLassoSelect,
  onHover,
  externalHi = new Set(),
  pinned, setPinned,
  showLabels = true,
}) {
  const [rot, setRot] = React.useState({ x: -0.45, y: 0.7 })
  const [zoom, setZoom] = React.useState(1)
  const [dragging, setDrag] = React.useState(false)
  const [lasso, setLasso] = React.useState(null)
  const [hover, setHover] = React.useState(null)
  const [autoRotate, setAutoRotate] = React.useState(true)
  const svgRef = React.useRef(null)

  React.useEffect(() => {
    if (!autoRotate || dragging || lasso) return
    let raf, last = performance.now()
    const tick = (now) => {
      const dt = (now - last) / 1000
      last = now
      setRot((r) => ({ ...r, y: r.y + dt * 0.12 }))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [autoRotate, dragging, lasso])

  const projected = React.useMemo(() => {
    return rows
      .map((r) => {
        const p =
          mode === 'belief'
            ? [r.belief_x, r.belief_y, r.belief_z]
            : [r.latent_x, r.latent_y, r.latent_z]
        const rotated = rotXY(p, rot.x, rot.y)
        const pr = project(rotated, width, height, zoom)
        return { id: r.id, row: r, ...pr }
      })
      .sort((a, b) => a.z - b.z)
  }, [rows, rot.x, rot.y, zoom, width, height, mode])

  const centroids = React.useMemo(() => {
    return S3D_SP.SEGMENTS.map((s) => {
      const members = rows.filter((r) => r.segment === s.id)
      if (!members.length) return null
      const mean = [0, 1, 2].map((i) => {
        const k = mode === 'belief'
          ? ['belief_x', 'belief_y', 'belief_z'][i]
          : ['latent_x', 'latent_y', 'latent_z'][i]
        return members.reduce((a, r) => a + r[k], 0) / members.length
      })
      const rotated = rotXY(mean, rot.x, rot.y)
      const pr = project(rotated, width, height, zoom)
      return { seg: s, ...pr, count: members.length }
    }).filter(Boolean)
  }, [rows, rot.x, rot.y, zoom, width, height, mode])

  const axes = React.useMemo(() => {
    const endpoints = [
      { dir: [1, 0, 0], lbl: mode === 'belief' ? 'Sustainability' : 'x' },
      { dir: [0, 1, 0], lbl: mode === 'belief' ? 'Price-insensitive' : 'y' },
      { dir: [0, 0, 1], lbl: mode === 'belief' ? 'Tech-optimism' : 'z' },
    ]
    return endpoints.map((a) => {
      const p0 = project(rotXY([0, 0, 0], rot.x, rot.y), width, height, zoom)
      const p1 = project(rotXY(a.dir, rot.x, rot.y), width, height, zoom)
      return { p0, p1, lbl: a.lbl }
    })
  }, [rot.x, rot.y, zoom, width, height, mode])

  const onPointerDown = (e) => {
    svgRef.current?.setPointerCapture(e.pointerId)
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left, y = e.clientY - rect.top
    if (e.shiftKey) {
      setLasso([{ x, y }])
    } else {
      setDrag({ x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y })
      setAutoRotate(false)
    }
  }
  const onPointerMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left, y = e.clientY - rect.top
    if (lasso) { setLasso((l) => [...l, { x, y }]); return }
    if (dragging) {
      setRot({
        x: dragging.rx - (e.clientY - dragging.y) * 0.006,
        y: dragging.ry + (e.clientX - dragging.x) * 0.006,
      })
      return
    }
    let near = null, bestD = 1e9
    projected.forEach((p) => {
      const dx = x - p.x, dy = y - p.y
      const d = dx * dx + dy * dy
      if (d < 100 && d < bestD) { bestD = d; near = p }
    })
    setHover(near)
    onHover?.(near?.row || null)
  }
  const onPointerUp = (e) => {
    if (lasso && lasso.length > 3) {
      const inside = new Set()
      projected.forEach((p) => { if (pointInPoly(p, lasso)) inside.add(p.id) })
      onLassoSelect?.(inside)
    }
    setLasso(null)
    setDrag(false)
  }
  const onWheel = (e) => {
    e.preventDefault()
    setZoom((z) => Math.max(0.4, Math.min(3, z + (e.deltaY > 0 ? -0.08 : 0.08))))
  }

  const dotR = (p) => (3 + p.s * 1.2) * zoom
  const hoverOrPinned = hover || projected.find((p) => p.id === pinned)

  return (
    <div className="s3d" style={{ width, height, position: 'relative' }}>
      <svg
        ref={svgRef}
        width={width} height={height}
        className="s3d-svg"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => { setHover(null); onHover?.(null) }}
        onWheel={onWheel}
      >
        <defs>
          <radialGradient id="s3d-bg" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#FAF8F2" />
            <stop offset="100%" stopColor="#EFE9DA" />
          </radialGradient>
          <filter id="s3d-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="url(#s3d-bg)" />
        <FloorGrid rot={rot} zoom={zoom} w={width} h={height} />

        {axes.map((a, i) => {
          const c = ['#B23A48', '#1F7A4C', '#2766C7'][i]
          return (
            <g key={i}>
              <line
                x1={a.p0.x} y1={a.p0.y} x2={a.p1.x} y2={a.p1.y}
                stroke={c} strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 3"
              />
              {mode === 'belief' && (
                <text
                  x={a.p1.x} y={a.p1.y} fontSize="10" fill={c} opacity="0.8"
                  fontFamily="'JetBrains Mono', monospace"
                  textAnchor="middle" dy={a.p1.y < height / 2 ? -6 : 14}>
                  {a.lbl}
                </text>
              )}
            </g>
          )
        })}

        {projected.map((p) => {
          const seg = S3D_SP.SEGMENTS.find((s) => s.id === p.row.segment)
          const r = dotR(p)
          const hi = externalHi.has(p.id)
          const isHover = hover?.id === p.id
          const isPinned = pinned === p.id
          const op = 0.35 + ((p.z + 1) / 2) * 0.6
          return (
            <g key={p.id}>
              {hi && (
                <circle cx={p.x} cy={p.y} r={r + 5} fill="none"
                  stroke={seg?.color || '#000'} strokeWidth="1.5" opacity="0.5" />
              )}
              <circle
                cx={p.x} cy={p.y} r={r}
                fill={seg?.color || '#666'}
                fillOpacity={op}
                stroke={isPinned ? '#1A1714' : (isHover ? seg?.color : 'white')}
                strokeWidth={isPinned ? 2 : (isHover ? 2 : 0.8)}
                onClick={() => setPinned?.(isPinned ? null : p.id)}
                style={{ cursor: 'default' }}
              />
            </g>
          )
        })}

        {showLabels && centroids.map((c) => (
          <g key={c.seg.id} style={{ pointerEvents: 'none' }}>
            <rect x={c.x - 60} y={c.y - 26} width="120" height="18" rx="4"
              fill="white" stroke={c.seg.color + '60'} filter="url(#s3d-soft)" opacity="0.85" />
            <rect x={c.x - 60} y={c.y - 26} width="120" height="18" rx="4"
              fill="white" stroke={c.seg.color + '80'} />
            <text x={c.x} y={c.y - 13} textAnchor="middle" fontSize="10.5" fontWeight="500"
              fill={c.seg.color} fontFamily="'Geist', sans-serif">
              {c.seg.name} · {c.count}
            </text>
          </g>
        ))}

        {lasso && lasso.length > 1 && (
          <path
            d={'M ' + lasso.map((p) => p.x + ' ' + p.y).join(' L ') + ' Z'}
            fill="rgba(79,63,211,0.10)" stroke="#4F3FD3"
            strokeWidth="1" strokeDasharray="4 3"
          />
        )}

        {hoverOrPinned && (
          <foreignObject
            x={Math.min(width - 240, Math.max(8, hoverOrPinned.x + 14))}
            y={Math.min(height - 130, Math.max(8, hoverOrPinned.y - 10))}
            width="232" height="124"
            style={{ pointerEvents: 'none' }}>
            <div className="s3d-tip">
              <div className="s3d-tip-row">
                <span className="s3d-tip-id">{hoverOrPinned.row.id}</span>
                <span className="s3d-tip-seg" style={{
                  color: S3D_SP.SEGMENTS.find((s) => s.id === hoverOrPinned.row.segment)?.color,
                }}>
                  ● {S3D_SP.SEGMENTS.find((s) => s.id === hoverOrPinned.row.segment)?.name}
                </span>
              </div>
              <div className="s3d-tip-name">
                {hoverOrPinned.row.name}, {hoverOrPinned.row.age} · {hoverOrPinned.row.city}
              </div>
              <div className="s3d-tip-role">{hoverOrPinned.row.occupation}</div>
              <div className="s3d-tip-scores">
                <span title="Sustainability">🌿 {hoverOrPinned.row.sustainability.toFixed(1)}</span>
                <span title="Price sensitivity">$ {hoverOrPinned.row.price_sensitivity.toFixed(1)}</span>
                <span title="Tech optimism">⚙ {hoverOrPinned.row.tech_optimism.toFixed(1)}</span>
                <span title="Novelty seeking">✦ {hoverOrPinned.row.novelty_seeking.toFixed(1)}</span>
              </div>
            </div>
          </foreignObject>
        )}
      </svg>

      <div className="s3d-hud-tl">
        <div className="s3d-mode">
          <button className={mode === 'latent' ? 'on' : ''} onClick={() => onModeChange?.('latent')}>
            Latent space
          </button>
          <button className={mode === 'belief' ? 'on' : ''} onClick={() => onModeChange?.('belief')}>
            Belief axes
          </button>
        </div>
        <div className="s3d-hint">
          {mode === 'latent'
            ? 'UMAP-like embedding. Drag to orbit, scroll to zoom, shift-drag to lasso.'
            : 'Axes are real attitude scores. Same dots, interpretable position.'}
        </div>
      </div>
      <div className="s3d-hud-br">
        <button className="s3d-hud-btn" onClick={() => setAutoRotate((a) => !a)}>
          {autoRotate ? '❚❚' : '▶'} {autoRotate ? 'pause' : 'rotate'}
        </button>
        <button className="s3d-hud-btn" onClick={() => { setRot({ x: -0.45, y: 0.7 }); setZoom(1) }}>
          ⤾ reset view
        </button>
      </div>
    </div>
  )
}
