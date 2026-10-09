export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ position: 'relative', width: 60, height: 60 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '3px solid var(--bg-tertiary)',
          borderTop: '3px solid var(--accent)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 8, borderRadius: '50%',
          border: '2px solid var(--bg-tertiary)',
          borderBottom: '2px solid var(--accent-2)',
          animation: 'spin 1.2s linear infinite reverse',
        }} />
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading module...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
