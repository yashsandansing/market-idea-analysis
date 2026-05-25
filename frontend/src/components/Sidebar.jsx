import { useState, useEffect } from 'react'
import { CATEGORIES } from '../data'

export default function Sidebar({ onNew, onSegments, onPrompts, onSettings, saved, currentSavedId, onOpenSaved }) {
  const [activeCat, setActiveCat] = useState('okrs')

  // Track which section is in view and highlight the matching nav item
  useEffect(() => {
    const canvas = document.querySelector('.canvas')
    if (!canvas) return

    const onScroll = () => {
      for (const cat of CATEGORIES) {
        const sec = document.getElementById('sec-' + cat.id)
        if (!sec) continue
        const { top, bottom } = sec.getBoundingClientRect()
        if (top < 200 && bottom > 200) {
          setActiveCat(cat.id)
          break
        }
      }
    }

    canvas.addEventListener('scroll', onScroll, { passive: true })
    return () => canvas.removeEventListener('scroll', onScroll)
  }, [])

  // Keyboard shortcut: N opens new analysis
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'n' && e.key !== 'N') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      onNew()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onNew])

  const scrollTo = (id) => {
    const el = document.getElementById('sec-' + id)
    const canvas = document.querySelector('.canvas')
    if (!el || !canvas) return
    const top = el.getBoundingClientRect().top - canvas.getBoundingClientRect().top + canvas.scrollTop - 16
    canvas.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <aside className="sidebar">
      <button className="sb-new" onClick={onNew}>
        <span className="sb-new-plus">+</span>
        <span>New analysis</span>
        <span className="kbd" style={{ marginLeft: 'auto' }}>N</span>
      </button>

      <div className="sb-section">
        <div className="sb-label">On this page</div>
        {CATEGORIES.map(c => (
          <div
            key={c.id}
            className={'cat-item' + (c.id === activeCat ? ' active' : '')}
            onClick={() => { setActiveCat(c.id); scrollTo(c.id) }}
          >
            <span className="cat-glyph">{c.glyph}</span>
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      <div className="sb-section">
        <div className="sb-label">Saved analyses</div>
        {saved.length === 0 ? (
          <p className="sb-empty">No saved analyses yet</p>
        ) : saved.map(s => (
          <div
            key={s.id}
            className={'cat-item' + (s.id === currentSavedId ? ' active' : '')}
            onClick={() => onOpenSaved(s)}
          >
            <span className="cat-glyph">★</span>
            <span className="cat-label-overflow">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="sb-section">
        <div className="sb-label">Workspace</div>
        <div className="cat-item" onClick={onSegments}><span className="cat-glyph">◰</span><span>Segments</span></div>
        <div className="cat-item" onClick={onPrompts}><span className="cat-glyph">◊</span><span>Prompt library</span></div>
        <div className="cat-item" onClick={onSettings}><span className="cat-glyph">◟</span><span>Settings</span></div>
      </div>
    </aside>
  )
}
