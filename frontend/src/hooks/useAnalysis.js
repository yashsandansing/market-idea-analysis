import { useState, useCallback, useRef } from 'react'
import { fetchSection, PROMPT_TYPES } from '../api'
import { usePromptLibrary } from './usePromptLibrary'

const INITIAL_SECTION = { status: 'idle', parsed: null }

function makeConcurrencyQueue(limit) {
  let active = 0
  const queue = []
  return function enqueue(fn) {
    return new Promise((resolve, reject) => {
      const run = async () => {
        active++
        try { resolve(await fn()) }
        catch (e) { reject(e) }
        finally {
          active--
          if (queue.length) queue.shift()()
        }
      }
      if (active < limit) run()
      else queue.push(run)
    })
  }
}

function buildInitialResults(segments) {
  return Object.fromEntries(
    segments.map(seg => [
      seg,
      Object.fromEntries(PROMPT_TYPES.map(pt => [pt, { ...INITIAL_SECTION, status: 'loading' }])),
    ])
  )
}

export function useAnalysis() {
  const [config, setConfig]       = useState(null)
  const [results, setResults]     = useState({})
  const [saved, setSaved]         = useState([])
  const [toastError, setToastError] = useState(null)
  const seenErrors                = useRef(new Set())
  const abortRef                  = useRef(null)
  const { getPrompt }             = usePromptLibrary()

  const clearToastError = () => setToastError(null)

  const isRunning = useCallback(() => {
    if (!config?.segments) return false
    return config.segments.some(seg =>
      PROMPT_TYPES.some(pt => results[seg]?.[pt]?.status === 'loading')
    )
  }, [config, results])

  const isSectionStreaming = useCallback((segId, ...promptTypes) => {
    if (!results[segId]) return true
    return promptTypes.some(pt => results[segId]?.[pt]?.status === 'loading')
  }, [results])

  const getSegmentData = useCallback((segId) => {
    const seg = results[segId]
    if (!seg) return null
    return {
      okrs:          seg.marketing_okrs?.parsed         ?? null,
      strengths:     seg.strengths?.parsed              ?? null,
      weaknesses:    seg.weaknesses?.parsed             ?? null,
      opportunities: seg.opportunities?.parsed          ?? null,
      threats:       seg.threats?.parsed                ?? null,
      positioning:   seg.market_positioning?.parsed     ?? null,
      persona:       seg.buyer_persona?.parsed          ?? null,
      investment:    seg.investment_opportunities?.parsed ?? null,
      channels:      seg.channels_distribution?.parsed  ?? null,
    }
  }, [results])

  const run = useCallback(async (formData) => {
    const { product, description, objective, segments, cohortN } = formData

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    seenErrors.current.clear()
    setToastError(null)

    const id  = 'a' + Math.random().toString(36).slice(2, 8)
    const ts  = new Date()
      .toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      .replace(',', ' ·')

    const storedModel = (() => {
      try { return JSON.parse(localStorage.getItem('segmentiq_api_keys') || '{}').model || 'anthropic' }
      catch { return 'anthropic' }
    })()
    const apiConfig = { product, description: description || undefined, objective, segments, model: storedModel }

    setConfig({ id, product, description, objective, segments, cohortN, createdAt: ts })
    setResults(buildInitialResults(segments))
    setSaved(prev => {
      const label = `${product} · ${objective} · ${segments.length} seg`
      return [{ id, label, product, objective, segments }, ...prev]
    })

    const concurrency = storedModel === 'gemini' ? 2 : Infinity
    const enqueue = makeConcurrencyQueue(concurrency)

    const calls = segments.flatMap(seg =>
      PROMPT_TYPES.map(pt =>
        enqueue(() => fetchSection({
          config: apiConfig,
          segment: seg,
          promptType: pt,
          customPrompt: getPrompt(pt),
          onDone: (parsed) => {
            setResults(prev => ({
              ...prev,
              [seg]: {
                ...prev[seg],
                [pt]: { status: 'done', parsed },
              },
            }))
          },
          onError: (message) => {
            setResults(prev => ({
              ...prev,
              [seg]: {
                ...prev[seg],
                [pt]: { status: 'error', parsed: null, error: message },
              },
            }))
            if (!seenErrors.current.has(message)) {
              seenErrors.current.add(message)
              setToastError(message)
            }
          },
          signal: controller.signal,
        }))
      )
    )

    await Promise.allSettled(calls)
  }, [])

  const rerun = useCallback(() => {
    if (!config) return
    run(config)
  }, [config, run])

  const rerunSection = useCallback(async (segId, promptTypes) => {
    if (!config) return

    const storedModel = (() => {
      try { return JSON.parse(localStorage.getItem('segmentiq_api_keys') || '{}').model || 'anthropic' }
      catch { return 'anthropic' }
    })()
    const apiConfig = { product: config.product, description: config.description || undefined, objective: config.objective, segments: config.segments, model: storedModel }

    setResults(prev => ({
      ...prev,
      [segId]: {
        ...prev[segId],
        ...Object.fromEntries(promptTypes.map(pt => [pt, { status: 'loading', parsed: null }])),
      },
    }))

    await Promise.allSettled(
      promptTypes.map(pt =>
        fetchSection({
          config: apiConfig,
          segment: segId,
          promptType: pt,
          customPrompt: getPrompt(pt),
          onDone: (parsed) => {
            setResults(prev => ({
              ...prev,
              [segId]: { ...prev[segId], [pt]: { status: 'done', parsed } },
            }))
          },
          onError: (message) => {
            setResults(prev => ({
              ...prev,
              [segId]: { ...prev[segId], [pt]: { status: 'error', parsed: null, error: message } },
            }))
            setToastError(message)
          },
        })
      )
    )
  }, [config])

  const openSaved = useCallback((item) => {
    setConfig({
      id:        item.id,
      product:   item.product,
      objective: item.objective,
      segments:  item.segments,
      createdAt: '–',
    })
    setResults({})
  }, [])

  return { config, results, saved, run, rerun, rerunSection, openSaved, getSegmentData, isSectionStreaming, isRunning, toastError, clearToastError }
}
