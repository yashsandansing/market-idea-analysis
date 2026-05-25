export default function SectionSkeleton({ streaming = true }) {
  return (
    <div className={'section-skeleton' + (streaming ? ' shimmer-block' : ' section-skeleton--error')}>
      {streaming ? null : <span className="section-skeleton-msg">No data available</span>}
    </div>
  )
}
