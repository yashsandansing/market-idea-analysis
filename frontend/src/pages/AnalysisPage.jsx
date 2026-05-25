import { useState, useEffect } from "react";
import { SEGMENTS } from "../data";
import SegmentTabs from "../components/SegmentTabs";
import OKRsSection from "../components/sections/OKRsSection";
import SwotSection from "../components/sections/SwotSection";
import PositioningSection from "../components/sections/PositioningSection";
import PersonaSection from "../components/sections/PersonaSection";
import InvestmentSection from "../components/sections/InvestmentSection";
import ChannelsSection from "../components/sections/ChannelsSection";

const SECTION_PROMPT_TYPES = {
  okrs: ["marketing_okrs"],
  swot: ["strengths", "weaknesses", "opportunities", "threats"],
  positioning: ["market_positioning"],
  persona: ["buyer_persona"],
  investment: ["investment_opportunities"],
  channels: ["channels_distribution"],
};

function EmptyState({ onNew }) {
  return (
    <div className="empty-state">
      <div className="empty-state-inner">
        <div className="empty-glyph">◉</div>
        <h2 className="empty-title">No analysis yet</h2>
        <p className="empty-body">
          Create a new analysis to generate insights across OKRs, SWOT,
          positioning, personas, and more.
        </p>
        <button className="na-btn primary" onClick={onNew}>
          + New analysis
        </button>
      </div>
    </div>
  );
}

export default function AnalysisPage({
  config,
  getSegmentData,
  isSectionStreaming,
  isRunning,
  onNew,
  onRerun,
  onRerunSection,
}) {
  const [activeSegment, setActiveSegment] = useState(null);

  // Reset active segment when a new analysis starts
  useEffect(() => {
    if (config?.segments?.length) {
      setActiveSegment(config.segments[0]);
    }
  }, [config?.id]);

  if (!config) return <EmptyState onNew={onNew} />;

  const segmentObj = SEGMENTS.find((s) => s.id === activeSegment);
  const segmentName = segmentObj?.name ?? activeSegment ?? "";
  const data = getSegmentData(activeSegment);
  const running = isRunning();

  const streaming = (sectionId) =>
    isSectionStreaming(
      activeSegment,
      ...(SECTION_PROMPT_TYPES[sectionId] ?? []),
    );

  const rerun = (sectionId) => () =>
    onRerunSection(activeSegment, SECTION_PROMPT_TYPES[sectionId] ?? []);

  return (
    <div className="canvas-inner">
      <div className="analysis-head">
        <div className="ah-left">
          <div className="ah-eyebrow">
            <span className="tag-soft">{config.objective}</span>
            <span className="ah-meta">Generated {config.createdAt}</span>
          </div>
          <h1 className="page-title">
            <em>{config.product}</em>
          </h1>
          <p className="page-sub">
            Synthesised across {config.segments.length} segment
            {config.segments.length === 1 ? "" : "s"} ·{" "}
            {config.segments.length * 9} prompts
          </p>
        </div>
        <div className="ah-right">
          <button
            className="cb-download"
            onClick={() =>
              alert("Download coming soon — report export is a mock.")
            }
          >
            ↓ Download report
          </button>
          <button
            className={"cb-run " + (running ? "running" : "")}
            onClick={onRerun}
            disabled={running}
          >
            <span className="ind" />
            {running ? "Generating…" : "Re-run analysis"}
          </button>
        </div>
      </div>

      <SegmentTabs
        segments={config.segments}
        active={activeSegment}
        cohortN={config.cohortN}
        onChange={setActiveSegment}
      />

      <div className="sections-host">
        <div className="sections-segment-banner">
          <span className="ssb-label">Showing results for</span>
          <span className="ssb-name">{segmentName}</span>
        </div>

        <OKRsSection
          data={data}
          streaming={streaming("okrs")}
          seg={segmentName}
          onRerun={rerun("okrs")}
        />
        <SwotSection
          data={data}
          streaming={streaming("swot")}
          seg={segmentName}
          onRerun={rerun("swot")}
        />
        <PositioningSection
          data={data}
          streaming={streaming("positioning")}
          seg={segmentName}
          onRerun={rerun("positioning")}
        />
        <PersonaSection
          data={data}
          streaming={streaming("persona")}
          seg={segmentName}
          onRerun={rerun("persona")}
        />
        <InvestmentSection
          data={data}
          streaming={streaming("investment")}
          seg={segmentName}
          onRerun={rerun("investment")}
        />
        <ChannelsSection
          data={data}
          streaming={streaming("channels")}
          seg={segmentName}
          onRerun={rerun("channels")}
        />
      </div>

      <div className="analysis-footer">
        End of analysis ·{" "}
        <span className="analysis-footer-link" onClick={onNew}>
          Start a new analysis
        </span>
      </div>
    </div>
  );
}
