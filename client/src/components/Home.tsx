import { useState } from 'react'
import { socket } from '../socket'
import GlassPanel from './GlassPanel'
import Button from './Button'
import type { Room } from '../types'

type Ack = { error?: string; room?: Room }

const input =
  'w-full rounded-xl border border-border bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-accent/60'

export default function Home({ onJoined }: { onJoined: (r: Room) => void }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState(
    new URLSearchParams(window.location.search).get('room')?.toUpperCase() ?? ''
  )
  const [error, setError] = useState('')

  const handle = (res: Ack) => {
    if (res.error || !res.room) return setError(res.error ?? 'Something went wrong')
    onJoined(res.room)
  }

  const create = () => socket.emit('room:create', { name }, handle)
  const join = () => socket.emit('room:join', { code, name }, handle)

  return (
    <div className="grid min-h-full place-items-center p-6">
      <GlassPanel className="w-full max-w-sm p-7">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)]" />
          <span className="text-lg font-semibold tracking-tight">Inside Man</span>
        </div>

        <p className="mb-5 text-sm text-zinc-400">One of your coworkers is leaking. Find them before launch.</p>

        <input
          className={input}
          placeholder="Your name"
          maxLength={16}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button className="mt-3 w-full" disabled={!name.trim()} onClick={create}>
          Create team room
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-zinc-600">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex gap-2">
          <input
            className={`${input} uppercase tracking-widest`}
            placeholder="CODE"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <Button variant="ghost" disabled={!name.trim() || code.length < 4} onClick={join}>
            Join
          </Button>
        </div>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
      </GlassPanel>
    </div>
  )
}