export default function TopBar({ onHome }) {
  return (
    <div className="topbar">
      <div className="brand" onClick={onHome} style={{ cursor: "default" }}>
        <span className="brand-mark" />
        SegmentIQ
      </div>
      <div className="topbar-spacer" />
    </div>
  );
}
