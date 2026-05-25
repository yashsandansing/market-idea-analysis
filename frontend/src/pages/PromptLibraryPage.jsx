import { useState } from 'react'
import { usePromptLibrary } from '../hooks/usePromptLibrary'

const PROMPT_DEFS = [
  {
    id: 'marketing_okrs',
    label: 'Marketing OKRs',
    glyph: '◎',
    description: 'Generate 3–5 concrete, measurable OKRs for the product and segment.',
    defaultHint: 'You are a marketing strategist. Generate 3–5 concrete OKRs for the product "{product}". Product description: {description}. Target the segment "{segment}" with the goal to {objective}. Be specific and measurable.',
  },
  {
    id: 'strengths',
    label: 'Strengths',
    glyph: '↑',
    description: 'Identify 4–6 key strengths of the product as perceived by the segment.',
    defaultHint: 'You are a business analyst. Identify 4–6 key strengths of the product "{product}". Product description: {description}. Consider how the segment "{segment}" perceives it in context of the objective to {objective}.',
  },
  {
    id: 'weaknesses',
    label: 'Weaknesses',
    glyph: '↓',
    description: 'Identify 4–6 key weaknesses of the product as perceived by the segment.',
    defaultHint: 'You are a business analyst. Identify 4–6 key weaknesses of the product "{product}". Product description: {description}. Consider how the segment "{segment}" perceives it in context of the objective to {objective}.',
  },
  {
    id: 'opportunities',
    label: 'Opportunities',
    glyph: '→',
    description: 'Identify 4–6 key market opportunities for the product.',
    defaultHint: 'You are a market analyst. Identify 4–6 key market opportunities for "{product}". Product description: {description}. Target the segment "{segment}" with the goal to {objective}.',
  },
  {
    id: 'threats',
    label: 'Threats',
    glyph: '⚡',
    description: 'Identify 4–6 key threats facing the product in this segment.',
    defaultHint: 'You are a market analyst. Identify 4–6 key threats facing "{product}". Product description: {description}. Consider targeting the segment "{segment}" with the goal to {objective}.',
  },
  {
    id: 'market_positioning',
    label: 'Market Positioning',
    glyph: '◈',
    description: 'Write a positioning statement and map against competitors.',
    defaultHint: 'You are a brand strategist. Write market positioning for "{product}". Product description: {description}. Aim at the segment "{segment}" to {objective}.',
  },
  {
    id: 'buyer_persona',
    label: 'Buyer Persona',
    glyph: '◉',
    description: 'Create a detailed buyer persona for the target segment.',
    defaultHint: 'You are a UX researcher. Create a detailed buyer persona for someone in the segment "{segment}" who would purchase "{product}". Product description: {description}. Their goal: to {objective}.',
  },
  {
    id: 'investment_opportunities',
    label: 'Investment Opportunities',
    glyph: '◆',
    description: 'Describe investment thesis, stats, and rationale.',
    defaultHint: 'You are a venture analyst. Describe investment opportunities for "{product}". Product description: {description}. Target the segment "{segment}" with the strategic objective to {objective}.',
  },
  {
    id: 'channels_distribution',
    label: 'Channels & Distribution',
    glyph: '◫',
    description: 'Recommend the best distribution and marketing channels.',
    defaultHint: 'You are a go-to-market strategist. Recommend the best distribution and marketing channels for "{product}". Product description: {description}. Reach the segment "{segment}" and {objective}.',
  },
]

function PromptRow({ def, customValue, onChange, onReset }) {
  const isCustom = !!customValue
  const displayValue = isCustom ? customValue : def.defaultHint

  return (
    <div className={'plp-row' + (isCustom ? ' plp-row--custom' : '')}>
      <div className="plp-row-header">
        <span className="plp-row-glyph">{def.glyph}</span>
        <span className="plp-row-label">{def.label}</span>
        {isCustom && <span className="plp-badge">custom</span>}
        {isCustom && (
          <button className="plp-reset" onClick={() => onReset(def.id)}>reset to default</button>
        )}
      </div>
      <p className="plp-row-desc">{def.description}</p>
      <textarea
        className={'plp-textarea' + (isCustom ? ' plp-textarea--active' : ' plp-textarea--default')}
        value={displayValue}
        onChange={e => onChange(def.id, e.target.value)}
        onFocus={e => {
          if (!isCustom) {
            onChange(def.id, def.defaultHint)
            requestAnimationFrame(() => e.target.select())
          }
        }}
        rows={3}
        spellCheck={false}
      />
      {!isCustom && (
        <p className="plp-var-hint">
          Click to edit. Use <code>{'{product}'}</code>, <code>{'{segment}'}</code>, <code>{'{objective}'}</code>, and <code>{'{description}'}</code> as template variables.
        </p>
      )}
    </div>
  )
}

export default function PromptLibraryPage({ onBack }) {
  const { prompts, setPrompt, resetPrompt } = usePromptLibrary()
  const [draft, setDraft] = useState(() => ({ ...prompts }))
  const [saved, setSaved] = useState(false)

  const handleChange = (id, text) => {
    setSaved(false)
    setDraft(prev => ({ ...prev, [id]: text }))
  }

  const handleReset = (id) => {
    setSaved(false)
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
    setSaved(true)
  }

  const customCount = PROMPT_DEFS.filter(d => {
    const v = draft[d.id]
    return v && v.trim() && v.trim() !== d.defaultHint
  }).length

  return (
    <div className="canvas-inner">
      <div className="plp-header">
        <div>
          <h1 className="page-title">Prompt <em>Library</em></h1>
          <p className="page-sub">
            Customise the prompts sent to the model for each analysis section.
            Prompts without an override use the built-in default.
          </p>
        </div>
        <div className="plp-header-actions">
          {customCount > 0 && (
            <span className="plp-count-badge">{customCount} of {PROMPT_DEFS.length} customised</span>
          )}
          <button className="na-btn ghost" onClick={onBack}>Back</button>
          <button className={'na-btn primary' + (saved ? ' disabled' : '')} onClick={handleSave} disabled={saved}>
            {saved ? 'Saved' : 'Save changes'}
          </button>
        </div>
      </div>

      <p className="plp-vars-note">
        Variables <code>{'{product}'}</code>, <code>{'{segment}'}</code>, <code>{'{objective}'}</code>, and <code>{'{description}'}</code> are substituted at runtime from your analysis configuration.
        The model is also instructed to respond with valid JSON matching the expected format — your custom prompt replaces only the instructional part.
      </p>

      <div className="plp-list">
        {PROMPT_DEFS.map(def => {
          const val = draft[def.id]
          const effectiveVal = val && val.trim() && val.trim() !== def.defaultHint ? val : null
          return (
            <PromptRow
              key={def.id}
              def={def}
              customValue={effectiveVal}
              onChange={handleChange}
              onReset={handleReset}
            />
          )
        })}
      </div>

      <div className="plp-footer">
        <button className="na-btn ghost" onClick={onBack}>Back</button>
        <button className={'na-btn primary' + (saved ? ' disabled' : '')} onClick={handleSave} disabled={saved}>
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
