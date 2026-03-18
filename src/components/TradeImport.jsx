import { useState, useRef, useCallback } from 'react'
import useIsMobile from '../hooks/useIsMobile'

// ── Broker presets ────────────────────────────────────────────────────────────
// Each preset maps: { symbol, entryPrice, exitPrice, quantity, tradeType, date, pnl, notes }
// "col" = exact CSV column header (case-insensitive match)
// "transform" = optional value transformer
const BROKERS = [
  {
    id: 'richby21',
    name: 'RichBy21',
    description: 'Re-import a previous export',
    icon: '◈',
    map: {
      symbol:     { col: 'symbol' },
      entryPrice: { col: 'entry_price' },
      exitPrice:  { col: 'exit_price' },
      quantity:   { col: 'quantity' },
      tradeType:  { col: 'trade_type' },
      date:       { col: 'date' },
      pnl:        { col: 'pnl' },
      notes:      { col: 'notes' },
    },
  },
  {
    id: 'robinhood',
    name: 'Robinhood',
    description: 'Account > Statements & History > Export',
    icon: '🪶',
    map: {
      symbol:     { col: 'symbol' },
      entryPrice: { col: 'average buy price' },
      exitPrice:  { col: 'average sell price' },
      quantity:   { col: 'quantity' },
      tradeType:  { col: 'side', transform: v => v?.toLowerCase().includes('sell') ? 'short' : 'long' },
      date:       { col: 'date', transform: v => v?.split('T')[0] },
      pnl:        { col: 'realized equity change' },
      notes:      { col: 'description' },
    },
  },
  {
    id: 'ibkr',
    name: 'Interactive Brokers',
    description: 'Reports > Flex Queries > Trades CSV',
    icon: '🏦',
    map: {
      symbol:     { col: 'symbol' },
      entryPrice: { col: 'tradeprice', fallback: 'open' },
      exitPrice:  { col: 'close' },
      quantity:   { col: 'quantity' },
      tradeType:  { col: 'buysell', transform: v => v?.toLowerCase().startsWith('b') ? 'long' : 'short' },
      date:       { col: 'tradedate', transform: v => {
        if (!v) return ''
        const s = String(v).replace(/\//g, '-')
        if (s.length === 8) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`
        return s
      }},
      pnl:        { col: 'fifopnlrealized', fallback: 'realized p/l' },
      notes:      { col: 'description', fallback: 'notes' },
    },
  },
  {
    id: 'tdameritrade',
    name: 'TD Ameritrade',
    description: 'My Account > History & Statements > Export',
    icon: '🟢',
    map: {
      symbol:     { col: 'symbol' },
      entryPrice: { col: 'price' },
      exitPrice:  { col: 'price' },
      quantity:   { col: 'quantity' },
      tradeType:  { col: 'action', transform: v => v?.toLowerCase().includes('sell') ? 'short' : 'long' },
      date:       { col: 'date', transform: v => v?.split(' ')[0] },
      pnl:        { col: 'amount' },
      notes:      { col: 'description' },
    },
  },
  {
    id: 'webull',
    name: 'Webull',
    description: 'More > Orders > Export Trade History',
    icon: '📊',
    map: {
      symbol:     { col: 'ticker' },
      entryPrice: { col: 'avg cost' },
      exitPrice:  { col: 'avg price' },
      quantity:   { col: 'qty' },
      tradeType:  { col: 'side', transform: v => v?.toLowerCase() === 'sell' ? 'short' : 'long' },
      date:       { col: 'filled time', transform: v => v?.split(' ')[0] },
      pnl:        { col: 'realized p&l' },
      notes:      { col: 'description' },
    },
  },
  {
    id: 'generic',
    name: 'Generic CSV',
    description: 'Map your own columns manually',
    icon: '📄',
    map: null, // handled separately with manual mapping UI
  },
]

// ── CSV parser ────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return { headers: [], rows: [] }
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase())
  const rows = lines.slice(1).map(line => {
    const vals = []
    let cur = '', inQ = false
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ }
      else if (line[i] === ',' && !inQ) { vals.push(cur.trim()); cur = '' }
      else cur += line[i]
    }
    vals.push(cur.trim())
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
  }).filter(r => Object.values(r).some(v => v !== ''))
  return { headers, rows }
}

function applyMapping(rows, mapping) {
  return rows.map(row => {
    const get = (fieldDef) => {
      if (!fieldDef) return ''
      const keys = Object.keys(row)
      const col = keys.find(k => k === fieldDef.col) ?? keys.find(k => k === fieldDef.fallback)
      const raw = col ? row[col] : ''
      return fieldDef.transform ? fieldDef.transform(raw) : raw
    }

    const symbol     = get(mapping.symbol)     || ''
    const entryPrice = parseFloat(get(mapping.entryPrice)) || 0
    const exitPrice  = parseFloat(get(mapping.exitPrice))  || 0
    const quantity   = parseFloat(get(mapping.quantity))   || 0
    const tradeType  = get(mapping.tradeType) || 'long'
    const date       = get(mapping.date)      || ''
    const notes      = get(mapping.notes)     || ''
    let pnl          = parseFloat(get(mapping.pnl))
    if (isNaN(pnl)) {
      pnl = tradeType === 'long'
        ? (exitPrice - entryPrice) * quantity
        : (entryPrice - exitPrice) * quantity
    }

    return { symbol, entryPrice, exitPrice, quantity, tradeType, date, pnl: pnl.toFixed(2), notes }
  }).filter(t => t.symbol && t.date)
}

// ── Generic manual mapping UI ────────────────────────────────────────────────
const FIELDS = [
  { key: 'symbol',     label: 'Symbol',      required: true  },
  { key: 'date',       label: 'Date',        required: true  },
  { key: 'entryPrice', label: 'Entry Price', required: false },
  { key: 'exitPrice',  label: 'Exit Price',  required: false },
  { key: 'quantity',   label: 'Quantity',    required: false },
  { key: 'tradeType',  label: 'Trade Type',  required: false },
  { key: 'pnl',        label: 'PnL',         required: false },
  { key: 'notes',      label: 'Notes',       required: false },
]

function ManualMapper({ headers, onMap }) {
  const [map, setMap] = useState(() =>
    Object.fromEntries(FIELDS.map(f => [f.key, headers.find(h => h.includes(f.key.toLowerCase()) || f.key.toLowerCase().includes(h)) ?? '']))
  )
  const setField = (key, val) => setMap(m => ({ ...m, [key]: val }))
  const colOptions = ['(ignore)', ...headers]

  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 18 }}>
        Match your CSV columns to the trade fields below.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 20 }}>
        {FIELDS.map(f => (
          <div key={f.key}>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
              {f.label}{f.required && <span style={{ color: 'var(--accent)', marginLeft: 3 }}>*</span>}
            </label>
            <select className="glass-input" value={map[f.key]} onChange={e => setField(f.key, e.target.value)} style={{ fontSize: '0.82rem' }}>
              {colOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        ))}
      </div>
      <button onClick={() => {
        const mapping = Object.fromEntries(
          FIELDS.map(f => [f.key, map[f.key] && map[f.key] !== '(ignore)' ? { col: map[f.key] } : null])
        )
        onMap(mapping)
      }} style={{
        width: '100%', padding: '10px', borderRadius: 10, cursor: 'pointer',
        border: '1px solid rgba(var(--accent-rgb),0.3)', background: 'rgba(var(--accent-rgb),0.09)',
        color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600,
      }}>
        Preview Import →
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TradeImport({ onClose, onImportComplete }) {
  const isMobile = useIsMobile()
  const fileRef = useRef()

  const [step, setStep] = useState('broker')   // broker | upload | map | preview | importing | done
  const [broker, setBroker] = useState(null)
  const [csvData, setCsvData] = useState(null)   // { headers, rows }
  const [preview, setPreview] = useState([])     // mapped trades
  const [selected, setSelected] = useState(new Set())
  const [progress, setProgress] = useState({ done: 0, total: 0, errors: 0 })
  const [dragOver, setDragOver] = useState(false)

  // ── File handling
  const handleFile = useCallback((file) => {
    if (!file || !file.name.endsWith('.csv')) return
    const reader = new FileReader()
    reader.onload = e => {
      const parsed = parseCSV(e.target.result)
      setCsvData(parsed)
      if (broker?.id === 'generic') {
        setStep('map')
      } else {
        const mapped = applyMapping(parsed.rows, broker.map)
        setPreview(mapped)
        setSelected(new Set(mapped.map((_, i) => i)))
        setStep('preview')
      }
    }
    reader.readAsText(file)
  }, [broker])

  const onDrop = e => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  // ── Import
  const handleImport = async () => {
    const toImport = preview.filter((_, i) => selected.has(i))
    setProgress({ done: 0, total: toImport.length, errors: 0 })
    setStep('importing')
    let errors = 0
    for (let i = 0; i < toImport.length; i++) {
      const t = toImport[i]
      try {
        const res = await fetch('/api/trades.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(t),
        })
        const data = await res.json()
        if (!data.success) errors++
      } catch { errors++ }
      setProgress({ done: i + 1, total: toImport.length, errors })
    }
    setProgress(p => ({ ...p, errors }))
    setStep('done')
    setTimeout(() => { onImportComplete(); onClose() }, 1800)
  }

  // ── Styles helpers
  const btnBase = { padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s', border: 'none' }
  const accentBtn = { ...btnBase, background: 'rgba(var(--accent-rgb),0.12)', border: '1px solid rgba(var(--accent-rgb),0.3)', color: 'var(--accent)' }
  const ghostBtn  = { ...btnBase, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass fade-up" onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: step === 'preview' ? 760 : 520,
        maxHeight: '90vh', overflowY: 'auto',
        padding: isMobile ? '24px 18px' : '32px 32px',
        transition: 'max-width 0.3s ease',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>Import Trades</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 5 }}>
              {step === 'broker'   && 'Step 1 of 3 — Select your broker or source'}
              {step === 'upload'   && `Step 2 of 3 — Upload your CSV from ${broker?.name}`}
              {step === 'map'      && 'Step 2 of 3 — Map your columns'}
              {step === 'preview'  && `Step 3 of 3 — Review ${preview.length} trades`}
              {step === 'importing'&& 'Importing trades…'}
              {step === 'done'     && 'Import complete!'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.3rem', lineHeight: 1, padding: '0 0 0 12px' }}>✕</button>
        </div>

        {/* ── Step 1: Broker select */}
        {step === 'broker' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
            {BROKERS.map(b => (
              <button key={b.id} onClick={() => { setBroker(b); setStep('upload') }} style={{
                display: 'flex', alignItems: 'flex-start', gap: 13,
                padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.18s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--accent-rgb),0.07)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb),0.25)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <span style={{ fontSize: '1.4rem', lineHeight: 1, marginTop: 1 }}>{b.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{b.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 3, lineHeight: 1.4 }}>{b.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── Step 2: Upload */}
        {step === 'upload' && (
          <div>
            {broker?.id !== 'generic' && (
              <div className="glass-deep" style={{ padding: '12px 16px', marginBottom: 20, borderLeft: '2px solid rgba(var(--accent-rgb),0.4)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--accent)' }}>How to export from {broker?.name}:</strong><br />
                  {broker?.description}
                </p>
              </div>
            )}

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current.click()}
              style={{
                border: `2px dashed ${dragOver ? 'rgba(var(--accent-rgb),0.6)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 14, padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
                background: dragOver ? 'rgba(var(--accent-rgb),0.05)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 12, opacity: 0.5 }}>📂</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Drop your CSV here</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>or click to browse files</div>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button style={ghostBtn} onClick={() => setStep('broker')}>← Back</button>
            </div>
          </div>
        )}

        {/* ── Step 2b: Manual mapping */}
        {step === 'map' && csvData && (
          <div>
            <ManualMapper headers={csvData.headers} onMap={(mapping) => {
              const mapped = applyMapping(csvData.rows, mapping)
              setPreview(mapped)
              setSelected(new Set(mapped.map((_, i) => i)))
              setStep('preview')
            }} />
            <button style={{ ...ghostBtn, marginTop: 12 }} onClick={() => setStep('upload')}>← Back</button>
          </div>
        )}

        {/* ── Step 3: Preview */}
        {step === 'preview' && (
          <div>
            {/* Select all bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox"
                  checked={selected.size === preview.length}
                  onChange={e => setSelected(e.target.checked ? new Set(preview.map((_,i)=>i)) : new Set())}
                  style={{ accentColor: 'var(--accent)', width: 15, height: 15 }}
                />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {selected.size} of {preview.length} selected
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--win-text)', fontSize: '0.78rem' }}>
                  {preview.filter(t => parseFloat(t.pnl) >= 0).length} wins
                </span>
                <span style={{ color: 'var(--loss-text)', fontSize: '0.78rem' }}>
                  {preview.filter(t => parseFloat(t.pnl) < 0).length} losses
                </span>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', marginBottom: 18 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['', 'Symbol', 'Date', 'Type', 'Entry', 'Exit', 'Qty', 'PnL'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-subtle)', fontWeight: 500, letterSpacing: '0.08em', fontSize: '0.68rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((t, i) => {
                    const isWin = parseFloat(t.pnl) >= 0
                    const checked = selected.has(i)
                    return (
                      <tr key={i} onClick={() => {
                        const s = new Set(selected)
                        s.has(i) ? s.delete(i) : s.add(i)
                        setSelected(s)
                      }} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        opacity: checked ? 1 : 0.35, cursor: 'pointer',
                        background: checked ? 'rgba(255,255,255,0.01)' : 'transparent',
                        transition: 'opacity 0.15s',
                      }}>
                        <td style={{ padding: '9px 10px' }}>
                          <input type="checkbox" checked={checked} onChange={() => {}} onClick={e => e.stopPropagation()} style={{ accentColor: 'var(--accent)' }} />
                        </td>
                        <td style={{ padding: '9px 10px', fontWeight: 600 }}>{t.symbol}</td>
                        <td style={{ padding: '9px 10px', color: 'var(--text-muted)' }}>{t.date}</td>
                        <td style={{ padding: '9px 10px' }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: 20, fontSize: '0.68rem',
                            background: t.tradeType === 'long' ? 'rgba(var(--accent-rgb),0.12)' : 'rgba(239,68,68,0.1)',
                            color: t.tradeType === 'long' ? 'var(--accent)' : 'var(--loss-text)',
                          }}>{t.tradeType}</span>
                        </td>
                        <td style={{ padding: '9px 10px', color: 'var(--text-muted)' }}>{t.entryPrice || '—'}</td>
                        <td style={{ padding: '9px 10px', color: 'var(--text-muted)' }}>{t.exitPrice || '—'}</td>
                        <td style={{ padding: '9px 10px', color: 'var(--text-muted)' }}>{t.quantity || '—'}</td>
                        <td style={{ padding: '9px 10px', fontWeight: 600, color: isWin ? 'var(--win-text)' : 'var(--loss-text)' }}>
                          {isWin ? '+' : ''}{t.pnl}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button style={ghostBtn} onClick={() => setStep('upload')}>← Back</button>
              <button style={{ ...accentBtn, opacity: selected.size === 0 ? 0.4 : 1 }}
                disabled={selected.size === 0} onClick={handleImport}>
                Import {selected.size} Trade{selected.size !== 1 ? 's' : ''} →
              </button>
            </div>
          </div>
        )}

        {/* ── Importing progress */}
        {step === 'importing' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ marginBottom: 20, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Importing {progress.done} / {progress.total}…
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 6, transition: 'width 0.3s ease',
                background: 'var(--accent)',
                width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`,
                boxShadow: '0 0 10px rgba(var(--accent-rgb),0.4)',
              }} />
            </div>
          </div>
        )}

        {/* ── Done */}
        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>✓</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
              {progress.done - progress.errors} trades imported
            </div>
            {progress.errors > 0 && (
              <div style={{ color: 'var(--loss-text)', fontSize: '0.8rem' }}>
                {progress.errors} failed — check your CSV format
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
