import { useMemo, useState } from 'react'
import { Badge, Button, Card, Input, Textarea } from './components/ui'

type ContextState = {
  speaker: string
  listener: string
  relation: string
  pronoun: string
  emotion: string
}

type AdaptOption = {
  text: string
  style: 'hindi' | 'hinglish'
  syllables: number
  target_syllables: number
  timing_error_pct: number
  score: number
}

const initialContext: ContextState = {
  speaker: '',
  listener: '',
  relation: '',
  pronoun: '',
  emotion: '',
}

const relations = ['senior', 'boss', 'teacher', 'friend', 'junior', 'family', 'lover', 'enemy']

export default function App() {
  const [sourceText, setSourceText] = useState('')
  const [context, setContext] = useState(initialContext)
  const [contextExpanded, setContextExpanded] = useState(false)
  const [showContext, setShowContext] = useState(false)
  const [timingMode, setTimingMode] = useState<'auto' | 'manual'>('auto')
  const [slotSeconds, setSlotSeconds] = useState('2.5')
  const [options, setOptions] = useState<AdaptOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const contextLines = useMemo(() => {
    return [
      context.speaker && `Speaker: ${context.speaker}`,
      context.listener && `Listener: ${context.listener}`,
      context.relation && `Relationship: ${context.relation}`,
      context.pronoun && `Pronoun: ${context.pronoun}`,
      context.emotion && `Emotion: ${context.emotion}`,
    ].filter((line): line is string => Boolean(line))
  }, [context])

  const setField = (field: keyof ContextState, value: string) => {
    setContext((current) => ({ ...current, [field]: value }))
  }

  const adaptLine = async () => {
    setIsLoading(true)
    setErrorMessage('')
    setOptions([])
    const contextText = contextLines.join('\n')
    const payload: Record<string, unknown> = {
      ja: sourceText.trim(),
      context: contextText,
      styles: ['hindi', 'hinglish'],
      limit: 10,
    }
    if (timingMode === 'manual') payload.slot_seconds = Number(slotSeconds)

    try {
      const response = await fetch('/api/v1/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(typeof result.detail === 'string' ? result.detail : 'Could not adapt this line.')
      }
      setOptions(result.options ?? [])
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not connect to the adaptation service.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearAll = () => {
    setSourceText('')
    setContext(initialContext)
    setContextExpanded(false)
    setShowContext(false)
    setTimingMode('auto')
    setSlotSeconds('2.5')
    setOptions([])
    setErrorMessage('')
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Dubstep home">
          <span className="brand-mark">d.</span>
          <span>dubstep</span>
        </a>
        <span className="profile-avatar" role="img" aria-label="Profile">
          <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="#ffe4ee" />
            <path d="M8.5 31.5c1.8-5.1 6-7.6 11.5-7.6s9.7 2.5 11.5 7.6" fill="#8c6b9e" stroke="#49395c" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M11.5 17.2c0-6 3.5-10 8.5-10s8.5 4 8.5 10v2.3c0 5.1-3.6 8.2-8.5 8.2s-8.5-3.1-8.5-8.2v-2.3Z" fill="#ffd9c8" stroke="#49395c" strokeWidth="1.8" />
            <path d="M10.8 17c.4-6.6 4.1-11.1 9.8-11.1 5.4 0 8.7 4 8.8 10.3-2.1-.2-4.5-1.8-6.1-4.1-2.7 3-7.2 4.7-12.5 4.9Z" fill="#49395c" />
            <circle cx="17" cy="19.5" r=".9" fill="#49395c" />
            <circle cx="23" cy="19.5" r=".9" fill="#49395c" />
            <path d="M18 23c1.2 1 2.8 1 4 0" stroke="#b66c85" strokeWidth="1.2" strokeLinecap="round" />
            <path d="m31.8 7 .9 1.8 1.8.9-1.8.9-.9 1.8-.9-1.8-1.8-.9 1.8-.9.9-1.8Z" fill="#ffe58f" />
          </svg>
        </span>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span>01</span> SAY IT YOUR WAY</div>
        <h1>Make every line<br /><em>feel like it belongs.</em></h1>
        <p className="intro">Start with a line. Add a little context to shape how it sounds.</p>
        <div className="japanese-stamp" aria-hidden="true"><span>言葉</span><small>こ と ば</small></div>
        <svg className="sakura-branch" viewBox="0 0 190 170" aria-hidden="true">
          <path className="branch-line" d="M12 151 C53 120 71 101 89 73 C105 48 127 35 169 17 M73 102 C48 84 37 63 31 37 M104 61 C92 39 93 22 99 9 M124 40 C147 44 163 57 175 77" />
          <g className="blossom blossom-one" transform="translate(34 35)"><path d="M0 0 C-16-19-7-31 2-19 C12-34 23-25 14-10 C33-13 35 1 17 6 C31 20 20 31 7 15 C1 34-13 28-9 10 C-28 15-31 1-13-5 C-27-20-16-30-4-13Z"/><circle r="4" /></g>
          <g className="blossom blossom-two" transform="translate(99 13) scale(.72)"><path d="M0 0 C-16-19-7-31 2-19 C12-34 23-25 14-10 C33-13 35 1 17 6 C31 20 20 31 7 15 C1 34-13 28-9 10 C-28 15-31 1-13-5 C-27-20-16-30-4-13Z"/><circle r="4" /></g>
          <g className="blossom blossom-three" transform="translate(166 80) scale(.68)"><path d="M0 0 C-16-19-7-31 2-19 C12-34 23-25 14-10 C33-13 35 1 17 6 C31 20 20 31 7 15 C1 34-13 28-9 10 C-28 15-31 1-13-5 C-27-20-16-30-4-13Z"/><circle r="4" /></g>
          <g className="blossom blossom-four" transform="translate(67 94) scale(.48)"><path d="M0 0 C-16-19-7-31 2-19 C12-34 23-25 14-10 C33-13 35 1 17 6 C31 20 20 31 7 15 C1 34-13 28-9 10 C-28 15-31 1-13-5 C-27-20-16-30-4-13Z"/><circle r="4" /></g>
        </svg>
      </section>

      <Card className="workspace" aria-label="Dialogue input">
        <div className="section-heading">
          <div><span className="step-number">01</span><h2>Your line</h2></div>
          <span className="field-hint">Japanese source text</span>
        </div>
        <label className="sr-only" htmlFor="source-text">Text to adapt</label>
        <Textarea
          id="source-text"
          className="source-input"
          placeholder="Type or paste a line here…"
          value={sourceText}
          onChange={(event) => setSourceText(event.target.value)}
          maxLength={2000}
          rows={4}
        />
        <div className="input-meta"><span>Your original dialogue</span><span>{sourceText.length} / 2000</span></div>

        <div className="timing-section">
          <div className="timing-heading">
            <div><span className="timing-icon" aria-hidden="true">◷</span><div><strong>Line timing</strong><small>Set a delivery length or let the model estimate it.</small></div></div>
            <Badge className="optional">OPTIONAL</Badge>
          </div>
          <div className="timing-options" role="group" aria-label="Line timing mode">
            <button type="button" className={timingMode === 'auto' ? 'selected' : ''} onClick={() => setTimingMode('auto')}>
              <span className="radio-mark" /> <span><b>Automatic</b><small>Estimate from line length</small></span>
            </button>
            <button type="button" className={timingMode === 'manual' ? 'selected' : ''} onClick={() => setTimingMode('manual')}>
              <span className="radio-mark" /> <span><b>Set duration</b><small>Choose a time slot</small></span>
            </button>
          </div>
          {timingMode === 'manual' && (
            <label className="duration-field"><span>Duration</span><span className="duration-input"><Input type="number" min="0.1" max="60" step="0.1" value={slotSeconds} onChange={(event) => setSlotSeconds(event.target.value)} /><span>seconds</span></span></label>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          className="context-toggle-row"
          aria-expanded={contextExpanded}
          aria-controls="context-fields"
          onClick={() => setContextExpanded((expanded) => !expanded)}
        >
          <span className="context-copy">
            <span className="context-icon" aria-hidden="true">✿</span>
            <span className="context-copy-text"><strong>Context <Badge className="optional">OPTIONAL</Badge></strong><small>Add details to shape the voice, relationship, and mood.</small></span>
          </span>
          <svg className={`context-chevron ${contextExpanded ? 'is-expanded' : ''}`} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </Button>

        <div className="context-fields" id="context-fields" hidden={!contextExpanded}>
            <div className="field-grid">
              <label className="field"><span>Speaker <small>who is talking</small></span><Input value={context.speaker} onChange={(event) => setField('speaker', event.target.value)} placeholder="e.g. female" /></label>
              <label className="field"><span>Listener <small>who they're talking to</small></span><Input value={context.listener} onChange={(event) => setField('listener', event.target.value)} placeholder="e.g. male" /></label>
              <label className="field"><span>Relationship</span><select value={context.relation} onChange={(event) => setField('relation', event.target.value)}><option value="">Choose a relationship</option>{relations.map((relation) => <option key={relation} value={relation}>{relation[0].toUpperCase() + relation.slice(1)}</option>)}</select></label>
              <label className="field"><span>Pronoun <small>manual override</small></span><select value={context.pronoun} onChange={(event) => setField('pronoun', event.target.value)}><option value="">Automatic</option><option value="aap">aap · respectful</option><option value="tum">tum · familiar</option><option value="tu">tu · intimate</option></select></label>
              <label className="field field-wide"><span>Emotion</span><Input value={context.emotion} onChange={(event) => setField('emotion', event.target.value)} placeholder="e.g. grateful" /></label>
            </div>
            <p className="field-footnote">Leave any field blank if it doesn't apply.</p>
        </div>

        <div className="actions-row">
          <button type="button" className="text-button" onClick={() => setShowContext((shown) => !shown)} aria-expanded={showContext}>
            <span className="chevron">{showContext ? '⌄' : '›'}</span>{showContext ? 'Hide current context' : 'Show current context'}
          </button>
          <Button type="button" variant="ghost" className="clear-button" onClick={clearAll}><span aria-hidden="true">↺</span> Clear all</Button>
        </div>

        {showContext && (
          <div className="context-preview" aria-live="polite">
            <div className="preview-label">CURRENT CONTEXT</div>
            {contextLines.length ? <ul>{contextLines.map((line) => <li key={line}>{line}</li>)}</ul> : <p>No context details added yet.</p>}
          </div>
        )}

        <Button variant="primary" className="submit-button" type="button" onClick={adaptLine} disabled={!sourceText.trim() || isLoading || (timingMode === 'manual' && (Number(slotSeconds) < 0.1 || Number(slotSeconds) > 60))}>
          <span>{isLoading ? 'Adapting…' : 'Adapt this line'}</span>
          {isLoading ? <span className="loading-mark" aria-hidden="true">◌</span> : <svg className="button-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>}
        </Button>
        <p className="submit-note">{timingMode === 'auto' ? 'The model estimates timing from the line length.' : 'The model will fit suggestions to your duration.'}</p>
        {errorMessage && <div className="request-message error-message" role="alert">{errorMessage} <small>Make sure the backend is running.</small></div>}
        {options.length > 0 && <section className="results" aria-live="polite"><div className="results-heading"><strong>Suggestions</strong><span>{options.length} options</span></div>{options.map((option, index) => <article className="result-card" key={`${option.style}-${index}`}><div><Badge className="result-style">{option.style}</Badge><span className="result-fit">{option.timing_error_pct.toFixed(1)}% timing difference</span></div><p>{option.text}</p><small>{option.syllables} / {option.target_syllables} syllables</small></article>)}</section>}
      </Card>

      <footer><span>BUILT FOR LINES THAT LAND.</span><span>Dubstep <b>·</b> Dialogue adaptation</span></footer>
    </main>
  )
}
