const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getApiKeyHeaders() {
  try {
    const keys = JSON.parse(localStorage.getItem('segmentiq_api_keys') || '{}')
    const headers = {}
    if (keys.anthropic) headers['X-Anthropic-Key'] = keys.anthropic
    if (keys.openai) headers['X-OpenAI-Key'] = keys.openai
    if (keys.gemini) headers['X-Gemini-Key'] = keys.gemini
    return headers
  } catch {
    return {}
  }
}

export const PROMPT_TYPES = [
  'marketing_okrs',
  'strengths',
  'weaknesses',
  'opportunities',
  'threats',
  'market_positioning',
  'buyer_persona',
  'investment_opportunities',
  'channels_distribution',
]

export async function fetchSection({ config, segment, promptType, customPrompt, onDone, onError, signal }) {
  let res
  const payload = { config, segment, promptType }
  if (customPrompt) payload.customPrompt = customPrompt
  try {
    res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getApiKeyHeaders() },
      body: JSON.stringify(payload),
      signal,
    })
  } catch (err) {
    if (err.name !== 'AbortError') onError(err.message)
    return
  }

  let body
  try {
    body = await res.json()
  } catch (err) {
    onError(`Invalid JSON response: ${err.message}`)
    return
  }

  if (!res.ok) {
    onError(body?.error ?? `HTTP ${res.status}`)
    return
  }

  onDone(body.result)
}

export async function exportJson(results, config) {
  const res = await fetch(`${API_BASE}/api/export/json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ results, config }),
  })
  return res.blob()
}

export async function exportCsv(results, config) {
  const res = await fetch(`${API_BASE}/api/export/csv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ results, config }),
  })
  return res.blob()
}
