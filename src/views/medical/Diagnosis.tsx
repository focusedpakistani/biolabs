import { useAppStore } from '../../store/appStore'

export default function Diagnosis() {
  const { level, toggleAI } = useAppStore()

  return (
    <div className="fade-in surface-elevated" style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}><span className="gradient-text">AI Diagnosis Assistant</span></h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 600, margin: '0 auto 2rem' }}>
        {level === 'K12' ? 'Play doctor and figure out what is making the patient sick!' : 'Symptom-to-disease AI engine. Input patient vitals, symptoms, and lab results for differential diagnosis.'}
      </p>
      
      <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
        <p style={{ marginBottom: '1rem' }}>This module integrates directly with the AI Tutor.</p>
        <button className="btn btn-primary" onClick={toggleAI}>Open AI Assistant</button>
      </div>
    </div>
  )
}
