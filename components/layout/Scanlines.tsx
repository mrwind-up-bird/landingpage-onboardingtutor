export function Scanlines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }}
      aria-hidden="true"
    />
  );
}
