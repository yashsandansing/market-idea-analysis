export default function HowToUsePage({ onBack }) {
  return (
    <div className="htu-page">
      <div className="htu-inner">
        <button className="htu-back" onClick={onBack}>← Back</button>

        <div className="htu-hero">
          <div className="htu-glyph">◉</div>
          <h1 className="htu-title">How to use <em>subconscious.ai</em></h1>
          <p className="htu-sub">A quick guide to get you from setup to insights.</p>
        </div>

        <div className="htu-steps">

          <div className="htu-step">
            <div className="htu-step-num">01</div>
            <div className="htu-step-body">
              <h2 className="htu-step-title">Configure your API key &amp; model</h2>
              <p className="htu-step-desc">
                Open <strong>Settings</strong> from the sidebar. Paste in your OpenAI or Anthropic API key — this is stored only in your browser and never sent anywhere except the AI provider. While you're there, pick the model you'd like to use for generation.
              </p>
            </div>
          </div>

          <div className="htu-step">
            <div className="htu-step-num">02</div>
            <div className="htu-step-body">
              <h2 className="htu-step-title">Explore &amp; control your population</h2>
              <p className="htu-step-desc">
                Head to <strong>Segments</strong> in the sidebar to browse the synthetic respondent panel. Each cohort represents a distinct audience group — you can inspect individual respondents, filter by cohort, and see attribute fingerprints in the 3D latent space. The population is mock data, so no real respondents are used.
              </p>
            </div>
          </div>

          <div className="htu-step">
            <div className="htu-step-num">03</div>
            <div className="htu-step-body">
              <h2 className="htu-step-title">Customise your prompts</h2>
              <p className="htu-step-desc">
                The <strong>Prompts</strong> section in the sidebar lets you tweak the prompt used for each analysis section — OKRs, SWOT, positioning, persona, investment opportunities, and distribution channels. Edited prompts are highlighted so you always know what's been changed.
              </p>
            </div>
          </div>

          <div className="htu-step">
            <div className="htu-step-num">04</div>
            <div className="htu-step-body">
              <h2 className="htu-step-title">Create a new analysis</h2>
              <p className="htu-step-desc">
                Click <strong>+ New analysis</strong> in the sidebar (or the button on this page). Fill in your product name, objective, target segments, and cohort size, then hit Generate. Results stream in section by section across all selected segments.
              </p>
            </div>
          </div>

          <div className="htu-step">
            <div className="htu-step-num">05</div>
            <div className="htu-step-body">
              <h2 className="htu-step-title">Regenerate individual sections</h2>
              <p className="htu-step-desc">
                Not happy with a particular section? Click the <strong>Regenerate</strong> button at the top-right of any section card to re-run just that section without touching the rest of the analysis.
              </p>
            </div>
          </div>

          <div className="htu-step htu-step--warn">
            <div className="htu-step-num">!</div>
            <div className="htu-step-body">
              <h2 className="htu-step-title">Data is stored client-side only</h2>
              <p className="htu-step-desc">
                All analysis results, saved sessions, and your API key live in your browser's local storage. Refreshing the page or closing the tab will wipe your current session. There is no account, no cloud sync, and no server-side persistence.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
