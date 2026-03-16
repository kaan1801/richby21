import { useState, useEffect } from 'react'

export default function ConsoleText({ text }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!text) return
    let i = 0, current = ''
    const iv = setInterval(() => {
      current += text[i]; setDisplayed(current); i++
      if (i === text.length) clearInterval(iv)
    }, 45)
    return () => clearInterval(iv)
  }, [text])

  return (
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
      {displayed}<span className="pulse-dot" style={{ opacity: 0.6 }}>▌</span>
    </p>
  )
}
