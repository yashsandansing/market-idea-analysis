import { useState, useCallback } from 'react'

const STORAGE_KEY = 'segmentiq_prompt_library'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  catch { return {} }
}

export function usePromptLibrary() {
  const [prompts, setPromptsState] = useState(load)

  const setPrompt = useCallback((promptType, text) => {
    setPromptsState(prev => {
      const next = text.trim() ? { ...prev, [promptType]: text } : (() => { const n = { ...prev }; delete n[promptType]; return n })()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const resetPrompt = useCallback((promptType) => {
    setPromptsState(prev => {
      const next = { ...prev }
      delete next[promptType]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const getPrompt = useCallback((promptType) => load()[promptType] || null, [])

  return { prompts, setPrompt, resetPrompt, getPrompt }
}
