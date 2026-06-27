'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Nav from '@/components/Nav'
import ArtistCard from '@/components/ArtistCard'

const STYLES = [
  'All Styles', 'Traditional', 'Blackwork', 'Realism', 'Japanese',
  'Neo-Traditional', 'Geometric', 'Watercolor', 'Fine Line', 'Illustrative',
  'Tribal', 'Chicano', 'Surrealism', 'Dotwork',
]

export default function Home() {
  const [artists, setArtists] = useState([])
  const [cities, setCities] = useState(['All Cities'])
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedStyle, setSelectedStyle] = useState('All Styles')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase.from('artists').select('*').order('name')

      if (selectedCity !== 'All Cities') query = query.eq('city', selectedCity)
      if (selectedStyle !== 'All Styles') query = query.contains('styles', [selectedStyle])

      const { data, error } = await query
      if (!error && data) {
        setArtists(data)
        if (cities.length === 1) {
          const { data: cityData } = await supabase.from('artists').select('city').order('city')
          const unique = ['All Cities', ...new Set(cityData?.map(a => a.city).filter(Boolean))]
          setCities(unique)
        }
      }
      setLoading(false)
    }
    load()
  }, [selectedCity, selectedStyle])

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 32px 48px' }}>
          <div style={{
            fontSize: 11, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
          }}>
            Find tattoo artists · anywhere
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.05,
            margin: '0 0 16px', maxWidth: 700,
          }}>
            The work speaks.<br />
            <span style={{ color: '#2a2a2a' }}>No algorithm required.</span>
          </h1>
          <p style={{
            fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
            maxWidth: 420, lineHeight: 1.6,
          }}>
            A curated directory of tattoo artists. Browse by city and style.
            No ads, no followers, no noise.
          </p>
        </div>

        {/* Filters */}
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px 32px' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div>
              <div style={{ fontSize: 10, color: '#2a2a2a', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>City</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {cities.map(c => (
                  <button key={c} onClick={() => setSelectedCity(c)} style={{
                    background: selectedCity === c ? 'var(--bg-hover)' : 'none',
                    border: `1px solid ${selectedCity === c ? 'var(--border-active)' : 'var(--border)'}`,
                    color: selectedCity === c ? '#bbb' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '6px 12px', cursor: 'pointer', transition: 'all 0.15s',
                  }}>{c}</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, color: '#2a2a2a', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Style</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {STYLES.map(s => (
                  <button key={s} onClick={() => setSelectedStyle(s)} style={{
                    background: selectedStyle === s ? 'var(--bg-hover)' : 'none',
                    border: `1px solid ${selectedStyle === s ? 'var(--border-active)' : 'var(--border)'}`,
                    color: selectedStyle === s ? '#bbb' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '6px 12px', cursor: 'pointer', transition: 'all 0.15s',
                  }}>{s}</button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Results */}
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px 80px' }}>
          <div style={{
            fontSize: 11, color: '#2a2a2a', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20,
          }}>
            {loading ? 'Loading...' : `${artists.length} artist${artists.length !== 1 ? 's' : ''} · ${selectedCity} · ${selectedStyle}`}
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>—</div>
          ) : artists.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 0',
              color: '#222', fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.06em',
            }}>
              No artists found. Try a different city or style.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 3,
            }}>
              {artists.map(a => <ArtistCard key={a.id} artist={a} />)}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #111', padding: '32px', marginTop: 40 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#222' }}>The Ink Atlas</span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['About', 'Submit an Artist', 'Claim Your Page', 'Contact'].map(l => (
              <span key={l} style={{
                fontSize: 11, color: '#222', fontFamily: 'var(--font-mono)',
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
              }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}
