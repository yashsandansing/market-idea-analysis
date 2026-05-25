import { useState, useEffect } from 'react'
import { usePromptLibrary } from '../hooks/usePromptLibrary'

const PROMPT_DEFS = [
  {
    id: 'marketing_okrs',
    label: 'Marketing OKRs',
    description: 'Generate 3–5 concrete, measurable OKRs for the product and segment.',
    defaultHint: 'You are a marketing strategist. Generate 3–5 concrete OKRs for the product "{product}". Product description: {description}. Target the segment "{segment}" with the goal to {objective}. Be specific and measurable.',
  },
  {
    id: 'strengths',
    label: 'Strengths',
    description: 'Identify 4–6 key strengths of the product as perceived by the segment.',
    defaultHint: 'You are a business analyst. Identify 4–6 key strengths of the product "{product}". Product description: {description}. Consider how the segment "{segment}" perceives it in context of the objective to {objective}.',
  },
  {
    id: 'weaknesses',
    label: 'Weaknesses',
    description: 'Identify 4–6 key weaknesses of the product as perceived by the segment.',
    defaultHint: 'You are a business analyst. Identify 4–6 key weaknesses of the product "{product}". Product description: {description}. Consider how the segment "{segment}" perceives it in context of the objective to {objective}.',
  },
  {
    id: 'opportunities',
    label: 'Opportunities',
    description: 'Identify 4–6 key market opportunities for the product.',
    defaultHint: 'You are a market analyst. Identify 4–6 key market opportunities for "{product}". Product description: {description}. Target the segment "{segment}" with the goal to {objective}.',
  },
  {
    id: 'threats',
    label: 'Threats',
    description: 'Identify 4–6 key threats facing the product in this segment.',
    defaultHint: 'You are a market analyst. Identify 4–6 key threats facing "{product}". Product description: {description}. Consider targeting the segment "{segment}" with the goal to {objective}.',
  },
  {
    id: 'market_positioning',
    label: 'Market Positioning',
    description: 'Write a positioning statement and map against competitors.',
    defaultHint: 'You are a brand strategist. Write market positioning for "{product}". Product description: {description}. Aim at the segment "{segment}" to {objective}.',
  },
  {
    id: 'buyer_persona',
    label: 'Buyer Persona',
    description: 'Create a detailed buyer persona for the target segment.',
    defaultHint: 'You are a UX researcher. Create a detailed buyer persona for someone in the segment "{segment}" who would purchase "{product}". Product description: {description}. Their goal: to {objective}.',
  },
  {
    id: 'investment_opportunities',
    label: 'Investment Opportunities',
    description: 'Describe investment thesis, stats, and rationale.',
    defaultHint: 'You are a venture analyst. Describe investment opportunities for "{product}". Product description: {description}. Target the segment "{segment}" with the strategic objective to {objective}.',
  },
  {
    id: 'channels_distribution',
    label: 'Channels & Distribution',
    description: 'Recommend the best distribution and marketing channels.',
    defaultHint: 'You are a go-to-market strategist. Recommend the best distribution and marketing channels for "{product}". Product description: {description}. Reach the segment "{segment}" and {objective}.',
  },
]

function PromptEditor({ def, value, onChange, onReset }) {
  const isCustom = !!value

  return (
    <div className={'pl-prompt-item' + (isCustom ? ' pl-prompt-item--custom' : '')}>
      <div className="pl-prompt-header">
        <span className="pl-prompt-label">{def.label}</span>
        {isCustom && <span className="pl-badge">custom</span>}
        {isCustom && (
          <button className="pl-reset-btn" onClick={() => onReset(def.id)} title="Revert to default">
            reset
          </button>
        )}
      </div>
      <p className="pl-prompt-desc">{def.description}</p>
      <textarea
        className={'pl-prompt-textarea' + (isCustom ? '' : ' pl-prompt-textarea--default')}
        value={isCustom ? value : def.defaultHint}
        placeholder={def.defaultHint}
        onChange={e => onChange(def.id, e.target.value)}
        onFocus={e => { if (!isCustom) { onChange(def.id, def.defaultHint); e.target.select() } }}
        rows={3}
        spellCheck={false}
      />
      {!isCustom && (
        <p className="pl-hint">
          Click to customise. Use <code>{'{product}'}</code>, <code>{'{segment}'}</code>, <code>{'{objective}'}</code>, and <code>{'{description}'}</code> as variables.
        </p>
      )}
    </div>
  )
}

export default function PromptLibraryModal({ onClose }) {
  const { prompts, setPrompt, resetPrompt } = usePromptLibrary()
  const [draft, setDraft] = useState(prompts)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleChange = (id, text) => {
    setDraft(prev => ({ ...prev, [id]: text }))
  }

  const handleReset = (id) => {
    setDraft(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  const handleSave = () => {
    PROMPT_DEFS.forEach(def => {
      const val = draft[def.id]
      if (val && val.trim() && val.trim() !== def.defaultHint) {
        setPrompt(def.id, val.trim())
      } else {
        resetPrompt(def.id)
      }
    })
    onClose()
  }

  const customCount = PROMPT_DEFS.filter(d => {
    const v = draft[d.id]
    return v && v.trim() && v.trim() !== d.defaultHint
  }).length

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box pl-modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Prompt Library</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <p className="modal-desc">
          Customise the prompts used for each analysis section. Leave a prompt at its default to use the built-in template.
          Variables <code>{'{product}'}</code>, <code>{'{segment}'}</code>, <code>{'{objective}'}</code>, and <code>{'{description}'}</code> are substituted at runtime.
        </p>

        <div className="pl-prompt-list">
          {PROMPT_DEFS.map(def => {
            const val = draft[def.id]
            const effectiveVal = val && val.trim() && val.trim() !== def.defaultHint ? val : null
            return (
              <PromptEditor
                key={def.id}
                def={def}
                value={effectiveVal}
                onChange={handleChange}
                onReset={handleReset}
              />
            )
          })}
        </div>

        <div className="modal-actions">
          {customCount > 0 && (
            <span className="pl-custom-count">{customCount} custom</span>
          )}
          <button className="na-btn ghost" onClick={onClose}>Cancel</button>
          <button className="na-btn primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
