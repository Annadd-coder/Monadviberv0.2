// pages/submit.js

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Submit() {
  const [name, setName]         = useState('')
  const [twitter, setTwitter]   = useState('')
  const [files, setFiles]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  const handleFileChange = e => {
    const selected = Array.from(e.target.files).slice(0, 10)
    setFiles(selected)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!name.trim() || !twitter.trim() || files.length === 0) {
      setError('Please fill all fields and select at least one image.')
      return
    }

    setLoading(true)
    try {
      // 1) Upload images to Supabase Storage
      const paths = await Promise.all(files.map(async file => {
        const ext = file.name.split('.').pop()
        const filename = `collection-${Date.now()}-${Math.random().toString(36).substr(2,5)}.${ext}`
        const { data, error: upErr } = await supabase
          .storage
          .from('collection-art')
          .upload(filename, file, { cacheControl: '3600', upsert: false })
        if (upErr) throw upErr
        return data.path
      }))

      // 2) Insert record into 'collections' table
      const { error: insertErr } = await supabase
        .from('collections')
        .insert([{ name, twitter, images: paths }])
      if (insertErr) throw insertErr

      setSuccess(true)
      setName('')
      setTwitter('')
      setFiles([])
    } catch (err) {
      console.error(err)
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Submit Collection</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Collection submitted!</p>}

        <label>
          Collection Name
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
            required
          />
        </label>

        <label>
          Twitter Handle
          <input
            type="text"
            placeholder="@username"
            value={twitter}
            onChange={e => setTwitter(e.target.value)}
            disabled={loading}
            required
          />
        </label>

        <label>
          Up to 10 PNG Images
          <input
            type="file"
            accept="image/png"
            multiple
            onChange={handleFileChange}
            disabled={loading}
            required
          />
        </label>
        {files.length > 0 && (
          <ul className="file-list">
            {files.map((f, i) => <li key={i}>{f.name}</li>)}
          </ul>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Collection'}
        </button>
      </form>

      <style jsx>{`
        .container {
          max-width: 480px;
          margin: 2rem auto;
          padding: 1rem;
          font-family: 'Lato', sans-serif;
        }
        h1 {
          text-align: center;
          margin-bottom: 1rem;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          font-weight: 600;
        }
        input[type="text"],
        input[type="file"] {
          margin-top: 0.5rem;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .file-list {
          list-style: none;
          padding-left: 0;
          margin: 0.5rem 0;
        }
        .file-list li {
          font-size: 0.9rem;
          color: #555;
        }
        button {
          padding: 0.75rem;
          background: #8e44ad;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          font-weight: 600;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .error   { color: #c0392b; text-align:center; }
        .success { color: #27ae60; text-align:center; }
      `}</style>
    </div>
  )
}