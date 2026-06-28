'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
const STYLES_OPTIONS = [
  'Traditional', 'Blackwork', 'Realism', 'Japanese',
  'Neo-Traditional', 'Geometric', 'Watercolor', 'Fine Line',
  'Illustrative', 'Tribal', 'Chicano', 'Surrealism', 'Dotwork',
]

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const [form, setForm] = useState({
    name: '',
    city: '',
    neighborhood: '',
    bio: '',
    availability: '',
    contact: '',
    website: '',
    instagram: '',
    location_note: '',
    styles: [],
  })
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  function handlePasswordSubmit() {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      setPasswordError(true)
      setTimeout(() => setPasswordError(false), 2000)
    }
  }

  function handleField(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function toggleStyle(style) {
    setForm(f => ({
      ...f,
      styles: f.styles.includes(style)
        ? f.styles.filter(s => s !== style)
        : [...f.styles, style]
    }))
  }

  function handleImageSelect(e) {
    const files = Array.from(e.target.files)
    const combined = [...images, ...files].slice(0, 10)
    setImages(combined)
    const previews = combined.map(f => URL.createObjectURL(f))
    setImagePreviews(previews)
  }

  function removeImage(index) {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  async function handleSubmit() {
    if (!form.name || !form.city) {
      setError('Name and city are required.')
      return
    }
    setSaving(true)
    setError(null)

    try {
      const slug = slugify(form.name)

      // Upload images to Supabase storage
      const works = []
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const ext = file.name.split('.').pop()
        const path = `${slug}/${Date.now()}-${i}.${ext}`
        const { error: uploadError } = await supabase.storage
  .from('artist-images')
  .upload(path, file, { upsert: true })

if (uploadError) throw uploadError

const supabaseBase = process.env.NEXT_PUBLIC_SUPABASE_URL
const publicUrl = `${supabaseBase}/storage/v1/object/public/artist-images/${path}`

works.push({ image_url: publicUrl, label: '' })
      }

      // Insert artist record
      const { error: insertError } = await supabase.from('artists').insert({
        name: form.name,
        slug,
        city: form.city,
        neighborhood: form.neighborhood,
        bio: form.bio,
        styles: form.styles,
        availability: form.availability,
        contact: form.contact,
        website: form.website,
        instagram: form.instagram,
        location_note: form.location_note,
        claimed: false,
        works,
      })

      if (insertError) throw insertError

      setSuccess(true)
      setForm({
        name: '', city: '', neighborhood: '', bio: '',
        availability: '', contact: '', website: '',
        instagram: '', location_note: '', styles: [],
      })
      setImages([])
      setImagePreviews([])
      setTimeout(() => setSuccess(false), 4000)

    } catch (err) {
      setError(err.message || 'Something went wrong.')
    }

    setSaving(false)
  }

  // Password screen
  if (!authed) {
    return (
      <div style={{
        background: '#0a0a0a', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 24, color: '#f0ece4', marginBottom: 8,
          }}>The Ink Atlas</div>
          <div style={{ fontSize: 11, color: '#333', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Admin Access</div>
          <input
            type="password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
            placeholder="Password"
            style={{
              background: '#111', border: `1px solid ${passwordError ? '#8c4a4a' : '#222'}`,
              color: '#888', fontFamily: 'monospace', fontSize: 13,
              padding: '10px 14px', outline: 'none', transition: 'border-color 0.2s',
            }}
          />
          {passwordError && (
            <div style={{ fontSize: 11, color: '#8c4a4a', fontFamily: 'monospace' }}>Incorrect password</div>
          )}
          <button onClick={handlePasswordSubmit} style={{
            background: '#1a1a1a', border: '1px solid #2a2a2a',
            color: '#888', fontFamily: 'monospace', fontSize: 11,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '10px', cursor: 'pointer',
          }}>Enter</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '40px 24px 80px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&display=swap');`}</style>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, color: '#f0ece4', marginBottom: 4 }}>
            Add Artist
          </div>
          <div style={{ fontSize: 11, color: '#333', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            The Ink Atlas · Admin
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Basic info */}
          <Section label="Basic Info">
            <Row>
              <Field label="Artist Name *" value={form.name} onChange={v => handleField('name', v)} placeholder="e.g. Mara Voss" />
              <Field label="City *" value={form.city} onChange={v => handleField('city', v)} placeholder="e.g. San Diego" />
            </Row>
            <Row>
              <Field label="Neighborhood" value={form.neighborhood} onChange={v => handleField('neighborhood', v)} placeholder="e.g. North Park" />
              <Field label="Studio / Shop Name" value={form.location_note} onChange={v => handleField('location_note', v)} placeholder="e.g. Anchor & Rose Tattoo" />
            </Row>
          </Section>

          {/* Bio */}
          <Section label="Bio">
            <textarea
              value={form.bio}
              onChange={e => handleField('bio', e.target.value)}
              placeholder="A few sentences about the artist, their background, specialties, approach..."
              rows={4}
              style={{
                width: '100%', background: '#111', border: '1px solid #1e1e1e',
                color: '#888', fontFamily: 'monospace', fontSize: 12,
                padding: '10px 12px', outline: 'none', resize: 'vertical',
                boxSizing: 'border-box', lineHeight: 1.6,
              }}
            />
          </Section>

          {/* Styles */}
          <Section label="Styles">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {STYLES_OPTIONS.map(s => (
                <button key={s} onClick={() => toggleStyle(s)} style={{
                  background: form.styles.includes(s) ? '#1e1e1e' : 'none',
                  border: `1px solid ${form.styles.includes(s) ? '#444' : '#1e1e1e'}`,
                  color: form.styles.includes(s) ? '#bbb' : '#444',
                  fontFamily: 'monospace', fontSize: 11,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '6px 12px', cursor: 'pointer',
                }}>{s}</button>
              ))}
            </div>
          </Section>

          {/* Contact & Links */}
          <Section label="Contact & Links">
            <Row>
              <Field label="Booking / Contact" value={form.contact} onChange={v => handleField('contact', v)} placeholder="email or booking link" />
              <Field label="Website" value={form.website} onChange={v => handleField('website', v)} placeholder="https://..." />
            </Row>
            <Row>
              <Field label="Instagram" value={form.instagram} onChange={v => handleField('instagram', v)} placeholder="@handle" />
              <Field label="Availability" value={form.availability} onChange={v => handleField('availability', v)} placeholder="e.g. Booking 3 weeks out" />
            </Row>
          </Section>

          {/* Images */}
          <Section label={`Portfolio Images (${images.length}/10)`}>
            {imagePreviews.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 3, marginBottom: 12 }}>
                {imagePreviews.map((src, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => removeImage(i)}
                      style={{
                        position: 'absolute', top: 4, right: 4,
                        background: 'rgba(0,0,0,0.7)', border: 'none',
                        color: '#fff', fontSize: 12, width: 20, height: 20,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >×</button>
                  </div>
                ))}
              </div>
            )}
            {images.length < 10 && (
              <label style={{
                display: 'block', border: '1px dashed #222', padding: '20px',
                textAlign: 'center', cursor: 'pointer', color: '#333',
                fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {images.length === 0 ? 'Click to select images' : 'Add more images'}
                <input
                  type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={handleImageSelect}
                />
              </label>
            )}
          </Section>

          {/* Submit */}
          {error && (
            <div style={{ fontSize: 12, color: '#8c4a4a', fontFamily: 'monospace', padding: '10px 0' }}>{error}</div>
          )}
          {success && (
            <div style={{ fontSize: 12, color: '#4a8c6a', fontFamily: 'monospace', padding: '10px 0' }}>
              ✓ Artist added successfully.
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              background: saving ? '#111' : '#1a1a1a',
              border: '1px solid #2a2a2a', color: saving ? '#333' : '#888',
              fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '14px', cursor: saving ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {saving ? 'Saving...' : 'Add Artist'}
          </button>

        </div>
      </div>
    </div>
  )
}

function Section({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#2a2a2a', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
    </div>
  )
}

function Row({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 10, color: '#333', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: '#111', border: '1px solid #1e1e1e',
          color: '#888', fontFamily: 'monospace', fontSize: 12,
          padding: '8px 10px', outline: 'none',
        }}
      />
    </div>
  )
}
