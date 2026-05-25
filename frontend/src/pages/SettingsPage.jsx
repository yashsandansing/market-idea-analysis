import { useState } from 'react'

export default function SettingsPage({ keys, onSave, onBack }) {
  const [anthropic, setAnthropic] = useState(keys.anthropic || '')
  const [openai, setOpenai]       = useState(keys.openai || '')
  const [gemini, setGemini]       = useState(keys.gemini || '')
  const [model, setModel]         = useState(keys.model || 'anthropic')
  const [showAnthropic, setShowAnthropic] = useState(false)
  const [showOpenai, setShowOpenai]       = useState(false)
  const [showGemini, setShowGemini]       = useState(false)

  const handleSave = () => {
    onSave({ anthropic: anthropic.trim(), openai: openai.trim(), gemini: gemini.trim(), model })
    onBack()
  }

  return (
    <div className="na-page">
      <div className="na-inner" style={{ maxWidth: 560 }}>
        <div className="na-eyebrow">
          <button className="na-back" onClick={onBack}>← Back</button>
        </div>

        <h1 className="na-title">Settings</h1>
        <p className="na-lede">
          Keys are stored in your browser only and sent directly to the backend on each request.
          They are never stored server-side.
        </p>

        <div className="modal-field">
          <label className="modal-label">Default model</label>
          <div className="modal-radio-group">
            {[
              { id: 'anthropic', label: 'Claude (Anthropic)' },
              { id: 'openai',    label: 'GPT-4o (OpenAI)' },
              { id: 'gemini',    label: 'Gemini (Google)' },
            ].map(({ id, label }) => (
              <button
                key={id}
                className={'modal-radio' + (model === id ? ' on' : '')}
                onClick={() => setModel(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-field">
          <label className="modal-label">
            Anthropic API key
            {anthropic && <span className="modal-key-status ok">saved</span>}
          </label>
          <div className="modal-input-wrap">
            <input
              className="modal-input"
              type={showAnthropic ? 'text' : 'password'}
              value={anthropic}
              onChange={e => setAnthropic(e.target.value)}
              placeholder="sk-ant-..."
              spellCheck={false}
              autoComplete="off"
            />
            <button className="modal-reveal" onClick={() => setShowAnthropic(v => !v)}>
              {showAnthropic ? 'hide' : 'show'}
            </button>
          </div>
        </div>

        <div className="modal-field">
          <label className="modal-label">
            OpenAI API key
            {openai && <span className="modal-key-status ok">saved</span>}
          </label>
          <div className="modal-input-wrap">
            <input
              className="modal-input"
              type={showOpenai ? 'text' : 'password'}
              value={openai}
              onChange={e => setOpenai(e.target.value)}
              placeholder="sk-..."
              spellCheck={false}
              autoComplete="off"
            />
            <button className="modal-reveal" onClick={() => setShowOpenai(v => !v)}>
              {showOpenai ? 'hide' : 'show'}
            </button>
          </div>
        </div>

        <div className="modal-field">
          <label className="modal-label">
            Gemini API key
            {gemini && <span className="modal-key-status ok">saved</span>}
          </label>
          <div className="modal-input-wrap">
            <input
              className="modal-input"
              type={showGemini ? 'text' : 'password'}
              value={gemini}
              onChange={e => setGemini(e.target.value)}
              placeholder="AIza..."
              spellCheck={false}
              autoComplete="off"
            />
            <button className="modal-reveal" onClick={() => setShowGemini(v => !v)}>
              {showGemini ? 'hide' : 'show'}
            </button>
          </div>
        </div>

        <div className="na-actions">
          <div className="na-est" />
          <div className="na-buttons">
            <button className="na-btn ghost" onClick={onBack}>Cancel</button>
            <button className="na-btn primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
