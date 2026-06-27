import { supabase } from '@/lib/supabase'
import Nav from '@/components/Nav'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
  const { data: artist } = await supabase
    .from('artists')
    .select('name, city, bio')
    .eq('slug', params.slug)
    .single()

  if (!artist) return { title: 'Artist not found — The Ink Atlas' }

  return {
    title: `${artist.name} — ${artist.city} · The Ink Atlas`,
    description: artist.bio || `Tattoo artist based in ${artist.city}.`,
  }
}

export default async function ArtistPage({ params }) {
  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!artist) notFound()

  return (
    <>
      <Nav />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Back */}
        <Link href="/" style={{
          display: 'inline-block', padding: '32px 0 28px',
          fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          ← All Artists
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1,
          }}>{artist.name}</h1>
          {artist.claimed && (
            <span style={{ fontSize: 11, color: '#555', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              ✦ verified
            </span>
          )}
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 20, letterSpacing: '0.04em' }}>
          {artist.neighborhood ? `${artist.neighborhood} · ` : ''}{artist.city}
        </div>

        {/* Style tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
          {artist.styles?.map(s => (
            <span key={s} style={{
              fontSize: 11, color: '#666', border: '1px solid var(--border-mid)',
              padding: '3px 10px', fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>{s}</span>
          ))}
        </div>

        {/* Bio */}
        {artist.bio && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 15,
            color: 'var(--text-secondary)', lineHeight: 1.75,
            maxWidth: 560, marginBottom: 36,
          }}>{artist.bio}</p>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 40, marginBottom: 52, flexWrap: 'wrap' }}>
          {artist.availability && (
            <div>
              <div style={{ fontSize: 10, color: '#333', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>Availability</div>
              <div style={{ fontSize: 13, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{artist.availability}</div>
            </div>
          )}
          {artist.contact && (
            <div>
              <div style={{ fontSize: 10, color: '#333', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>Contact</div>
              <div style={{ fontSize: 13, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>{artist.contact}</div>
            </div>
          )}
          {artist.location_note && (
            <div>
              <div style={{ fontSize: 10, color: '#333', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>Studio</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{artist.location_note}</div>
            </div>
          )}
        </div>

        {/* Portfolio */}
        {artist.works && artist.works.length > 0 && (
          <>
            <div style={{ fontSize: 10, color: '#2a2a2a', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Portfolio
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 3 }}>
              {artist.works.map((work, i) => (
                <div key={i} style={{ aspectRatio: '1', position: 'relative', background: '#111', overflow: 'hidden' }}>
                  {work.image_url ? (
                    <Image
                      src={work.image_url}
                      alt={work.label || `${artist.name} tattoo work`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'flex-end', padding: 12 }}>
                      <span style={{ fontSize: 10, color: '#222', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {work.label}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Claim prompt */}
        {!artist.claimed && (
          <div style={{
            marginTop: 56, borderTop: '1px solid var(--border)',
            paddingTop: 32, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                Is this your page?
              </div>
              <div style={{ fontSize: 12, color: '#333', fontFamily: 'var(--font-mono)' }}>
                Claim it to update your info, add portfolio work, and manage inquiries.
              </div>
            </div>
            <Link href={`/claim/${artist.slug}`} style={{
              background: 'none', border: '1px solid var(--border-mid)',
              color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)',
              fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '10px 20px', display: 'inline-block',
            }}>
              Claim This Page
            </Link>
          </div>
        )}

      </main>
    </>
  )
}
