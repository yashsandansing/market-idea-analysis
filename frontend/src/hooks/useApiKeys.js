import { useState, useCallback } from 'react'

const STORAGE_KEY = 'segmentiq_api_keys'

function loadKeys() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function useApiKeys() {
  const [keys, setKeysState] = useState(loadKeys)

  const setKeys = useCallback((updates) => {
    setKeysState(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const hasKeyForModel = useCallback((model) => {
    if (model === 'anthropic') return !!keys.anthropic
    if (model === 'openai')    return !!keys.openai
    if (model === 'gemini')    return !!keys.gemini
    return false
  }, [keys])

  return { keys, setKeys, hasKeyForModel }
}
