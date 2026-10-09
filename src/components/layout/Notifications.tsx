import { useAppStore } from '../../store/appStore'
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

export default function Notifications() {
  const { notifications, removeNotification } = useAppStore()
  if (!notifications.length) return null
  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 300, display: 'flex', flexDirection: 'column', gap: '0.5rem', pointerEvents: 'none' }}>
      {notifications.map(n => (
        <div key={n.id} className="fade-in surface-elevated" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', pointerEvents: 'all', minWidth: 280, maxWidth: 420 }}>
          {n.type === 'success' && <CheckCircle size={16} style={{ color: 'var(--success)' }} />}
          {n.type === 'info'    && <Info         size={16} style={{ color: 'var(--accent)' }} />}
          {n.type === 'warning' && <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />}
          <span style={{ flex: 1, fontSize: '0.825rem' }}>{n.text}</span>
          <button onClick={() => removeNotification(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
