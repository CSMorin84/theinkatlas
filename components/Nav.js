'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [showSubmit, setShowSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [input, setInput] = useState('')

  function handleSubmit() {
    if (!input.trim()) return
    // TODO: wire to Supabase submissions table
    setSubmitted(true)
    setInput('')
    setTimeout(() => { setSubmitted(false); setShowSubmit(false) }, 3000)
  }

  return (
    <>
      <nav style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 32px',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 64,
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 22,
              color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '0.02em',
            }}>The Ink Atlas</span>
            <span style={{
              fontSize: 10, color: 'var(--text-faint)',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>beta</span>
          </Link>
          <button
            onClick={() => setShowSubmit(s => !s)}
            style={{
              background: 'none', border: '1px solid var(--border-mid)',
              color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
              fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '8px 16px', cursor: 'pointer',
            }}
          >
            Submit an Artist
          </button>
        </div>
      </nav>

      {showSubmit && (
        <div style={{
          background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
          padding: '20px 32px',
        }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>
                Know an artist we should add?
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Share their name, city, and a link to their work. We review every submission.
              </div>
            </div>
            {submitted ? (
              <div style={{ fontSize: 12, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                ✓ Got it — we'll take a look.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="name, city, instagram or website..."
                  style={{
                    background: 'var(--bg)', border: '1px solid var(--border-mid)',
                    color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)',
                    fontSize: 12, padding: '8px 12px', outline: 'none', width: 280,
                  }}
                />
                <button onClick={handleSubmit} style={{
                  background: 'var(--bg-hover)', border: '1px solid var(--border-active)',
                  color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)',
                  fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '8px 16px', cursor: 'pointer',
                }}>Send</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
