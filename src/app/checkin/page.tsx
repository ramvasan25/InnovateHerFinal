'use client'
import { inputBase } from '@/lib/ui-classes'
import { useEffect, useState, useCallback } from 'react'

interface Session {
  sessionId: string
  venueName: string
  startTime: number
  expectedEnd: number
  status: 'active' | 'checked_out' | 'overdue'
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function formatTime(ms: number) {
  if (ms <= 0) return '00:00:00'
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map((v) => String(v).padStart(2, '0')).join(':')
}

export default function CheckInPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [venueName, setVenueName] = useState('')
  const [duration, setDuration] = useState(120)
  const [remaining, setRemaining] = useState(0)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('checkin_session')
    if (saved) {
      const s: Session = JSON.parse(saved)
      if (s.status === 'active') {
        setSession(s)
      }
    }
  }, [])

  useEffect(() => {
    if (!session || session.status !== 'active') return
    const tick = () => {
      const left = session.expectedEnd - Date.now()
      setRemaining(left)
      if (left <= 0 && session.status === 'active') {
        const updated = { ...session, status: 'overdue' as const }
        setSession(updated)
        localStorage.setItem('checkin_session', JSON.stringify(updated))
        fetch(`/api/checkin/${session.sessionId}`, { method: 'PATCH' }).catch(() => {})
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [session])

  const startSession = useCallback(async () => {
    if (!venueName.trim()) return
    setStarting(true)
    const sessionId = generateId()
    const startTime = Date.now()
    const expectedEnd = startTime + duration * 60 * 1000

    try {
      await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, venueName, durationMinutes: duration }),
      })
    } catch {
      // Continue with localStorage even if server fails
    }

    const s: Session = { sessionId, venueName, startTime, expectedEnd, status: 'active' }
    setSession(s)
    localStorage.setItem('checkin_session', JSON.stringify(s))
    setStarting(false)
  }, [venueName, duration])

  const checkOut = useCallback(async () => {
    if (!session) return
    const updated = { ...session, status: 'checked_out' as const }
    setSession(updated)
    localStorage.setItem('checkin_session', JSON.stringify(updated))
    try {
      await fetch(`/api/checkin/${session.sessionId}`, { method: 'PATCH' })
    } catch {
      // ok
    }
  }, [session])

  const reset = () => {
    localStorage.removeItem('checkin_session')
    setSession(null)
    setVenueName('')
    setDuration(120)
  }

  if (!session || session.status === 'checked_out') {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Safety Check-In</h1>
          <p className="mt-2 text-slate-600">
            Start a timed session before visiting an art space. If you don&apos;t check out, an alert gets logged.
          </p>
        </div>

        {session?.status === 'checked_out' && (
          <div className="glass-card rounded-2xl p-4 text-center border-success/40 bg-success-bg">
            <p className="font-medium text-success">You checked out safely from {session.venueName}!</p>
            <button
              onClick={reset}
              className="mt-2 text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Start new session
            </button>
          </div>
        )}

        <div className="glass-card space-y-4 rounded-2xl p-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Venue / Location</label>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="e.g. Downtown Pottery Studio"
              className={`mt-1 ${inputBase}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Expected Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={`mt-1 ${inputBase}`}
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={180}>3 hours</option>
              <option value={240}>4 hours</option>
              <option value={360}>6 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>
          <button
            onClick={startSession}
            disabled={starting || !venueName.trim()}
            className="w-full rounded-xl bg-danger py-3 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 disabled:opacity-50"
          >
            {starting ? 'Starting...' : 'Start Check-In'}
          </button>
        </div>
      </div>
    )
  }

  const isOverdue = session.status === 'overdue' || remaining <= 0
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Safety Check-In</h1>
      </div>

      <div
        className={`glass-card rounded-2xl border-2 p-8 text-center ${
          isOverdue ? 'border-danger bg-danger-bg' : 'border-primary/50 bg-surface'
        }`}
      >
        {isOverdue && (
          <div className="mb-4 rounded-xl bg-danger px-4 py-2 text-sm font-bold text-white">
            OVERDUE — Alert has been logged!
          </div>
        )}
        <p className="text-sm text-slate-500">Checked in at</p>
        <p className="text-lg font-bold text-gray-900">{session.venueName}</p>
        <div
          className={`my-6 font-mono text-5xl font-bold ${
            isOverdue ? 'text-danger' : 'text-primary'
          }`}
        >
          {isOverdue ? 'OVERDUE' : formatTime(remaining)}
        </div>
        <p className="text-sm text-slate-500">
          Started: {new Date(session.startTime).toLocaleTimeString()}
          {' · '}
          Expected: {new Date(session.expectedEnd).toLocaleTimeString()}
        </p>
      </div>

      <button
        onClick={checkOut}
        className="w-full rounded-xl bg-success py-3 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2"
      >
        Check Out Safely
      </button>

      <button
        onClick={reset}
        className="w-full rounded-xl border border-border bg-white/80 py-3 font-semibold text-slate-600 transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Cancel Session
      </button>
    </div>
  )
}
