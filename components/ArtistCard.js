import Link from 'next/link'
import Image from 'next/image'

export default function ArtistCard({ artist }) {
  const primaryImage = artist.works?.[0]?.image_url

  return (
    <Link href={`/artists/${artist.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        transition: 'border-color 0.2s',
        display: 'flex', flexDirection: 'column',
        height: '100%',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-active)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        {/* Primary image */}
        <div style={{ aspectRatio: '4/3', background: '#111', overflow: 'hidden', position: 'relative' }}>
          {primaryImage ? (
            <Image src={primaryImage} alt={`${artist.name} tattoo work`} fill style={{ objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 10, color: '#222', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                No image yet
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '16px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 20,
              color: 'var(--text-primary)', fontWeight: 500,
            }}>{artist.name}</span>
            {artist.claimed && (
              <span style={{ fontSize: 10, color: '#555', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                ✦ verified
              </span>
            )}
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            {artist.neighborhood ? `${artist.neighborhood} · ` : ''}{artist.city}
          </div>

          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 2 }}>
            {artist.styles?.map(s => (
              <span key={s} style={{
                fontSize: 10, color: '#666',
                border: '1px solid var(--border-mid)',
                padding: '2px 7px', fontFamily: 'var(--font-mono)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>{s}</span>
            ))}
          </div>

          {artist.availability && (
            <div style={{ fontSize: 12, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', marginTop: 'auto', paddingTop: 8 }}>
              {artist.availability}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
