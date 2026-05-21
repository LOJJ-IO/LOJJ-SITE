type DemoMobileSnapshotProps = {
  src: string;
  alt: string;
  className?: string;
};

/** Scaled desktop screenshot for narrow viewports (Cursor / folk pattern). */
export default function DemoMobileSnapshot({ src, alt, className }: DemoMobileSnapshotProps) {
  return (
    <div className={`demo-mobile-snapshot-wrap${className ? ` ${className}` : ""}`}>
      <img className="demo-mobile-snapshot" src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}
