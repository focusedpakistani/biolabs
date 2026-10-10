import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { Sparkles, Send, Settings, Trash2, ChevronDown } from 'lucide-react'

interface Message { role: 'user' | 'assistant' | 'system'; content: string }

const LEVEL_PROMPTS: Record<string, string> = {
  K12:      'Explain in very simple words a child can understand. Use fun analogies like LEGO, toys, or cartoons.',
  undergrad:'Explain at an undergraduate biology/chemistry/physics level with appropriate terminology.',
  grad:     'Explain at a graduate research level with technical depth, mechanisms, and citations when relevant.',
  phd:      'Respond at PhD/researcher level with full technical detail, current research context, methodologies, and frontier knowledge.',
}

export default function AIAssistant() {
  const { aiPanelOpen, toggleAI, level } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'Welcome! I am your Bio-Labs AI Tutor — ask me anything about biology, chemistry, physics, medicine, or science discovery!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('biolabs_api_key') ?? '')
  const [provider, setProvider] = useState<'gemini' | 'openai' | 'anthropic'>('gemini')
  const [showSettings, setShowSettings] = useState(!apiKey)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const saveKey = () => {
    localStorage.setItem('biolabs_api_key', apiKey)
    setShowSettings(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (!apiKey) { setShowSettings(true); return }

    const userMsg: Message = { role: 'user', content: input }
    const systemCtx = LEVEL_PROMPTS[level] ?? LEVEL_PROMPTS.undergrad
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      let reply = ''
      if (provider === 'gemini') {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemCtx}\n\nUser: ${input}` }] }
            ],
          })
        })
        const data = await res.json()
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, no response received.'
      } else if (provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemCtx },
              ...messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: input }
            ],
          })
        })
        const data = await res.json()
        reply = data.choices?.[0]?.message?.content ?? 'No response.'
      } else {
        // Anthropic Claude
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            system: systemCtx,
            messages: [
              ...messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: input }
            ],
          })
        })
        const data = await res.json()
        reply = data.content?.[0]?.text ?? 'No response.'
      }
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  if (!aiPanelOpen) {
    return (
      <button
        onClick={toggleAI}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 100,
          width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, var(--accent-3), var(--accent))',
          color: '#060d1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px var(--purple-glow)',
          animation: 'float 4s ease-in-out infinite',
        }}
        aria-label="Open AI Assistant"
      >
        <Sparkles size={22} />
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 100,
      width: 380, maxWidth: 'calc(100vw - 2rem)',
      height: 560, maxHeight: 'calc(100vh - 5rem)',
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '1.25rem',
      boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(34,211,238,0.05))',
      }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-3), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={16} color="#060d1a" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Bio-Labs AI Tutor</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Level: {level.toUpperCase()} · {provider.charAt(0).toUpperCase() + provider.slice(1)}</div>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
          <Settings size={15} />
        </button>
        <button onClick={() => setMessages([messages[0]])} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
          <Trash2 size={15} />
        </button>
        <button onClick={toggleAI} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>🔑 Bring Your Own API Key (BYOK)</p>
          <select className="input" style={{ marginBottom: '0.4rem', fontSize: '0.8rem' }} value={provider} onChange={e => setProvider(e.target.value as any)}>
            <option value="gemini">Google Gemini</option>
            <option value="openai">OpenAI (GPT-4o)</option>
            <option value="anthropic">Anthropic Claude</option>
          </select>
          <input className="input" type="password" placeholder="Paste API key..." value={apiKey} onChange={e => setApiKey(e.target.value)} style={{ fontSize: '0.8rem', marginBottom: '0.4rem' }} />
          <button className="btn btn-primary" onClick={saveKey} style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>Save & Start Chatting</button>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%',
              padding: '0.55rem 0.8rem',
              borderRadius: m.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
              background: m.role === 'user' ? 'var(--accent)' : m.role === 'system' ? 'rgba(168,85,247,0.12)' : 'var(--bg-tertiary)',
              color: m.role === 'user' ? '#060d1a' : 'var(--text-primary)',
              fontSize: '0.8rem', lineHeight: 1.55,
              border: m.role === 'system' ? '1px solid rgba(168,85,247,0.3)' : m.role === 'assistant' ? '1px solid var(--border)' : 'none',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '0.4rem', padding: '0.55rem 0.8rem' }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: `shimmer 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
        <input
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask anything..."
          style={{ flex: 1, fontSize: '0.82rem' }}
        />
        <button
          className="btn btn-primary"
          style={{ padding: '0.5rem 0.75rem', flexShrink: 0 }}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  )
}
