import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, UserPlus } from 'lucide-react'
import GlassPanel from './GlassPanel'
import Button from './Button'
import Avatar from './Avatar'
import Badge from './Badge'
import Chat from './Chat'
import { randomTitle } from '../titles'
import type { ChatMessage, Player } from '../types'

const MIN_PLAYERS = 4
const ROOM_CODE = 'ABCD'
const fakeNames = ['Sarah Kim', 'Marcus Lee', 'Yasmine B', 'Leo Park', 'Nora Vance', 'Tariq H', 'Mina Cho', 'Jules R']

const initialPlayers: Player[] = [
  { id: '1', name: 'You', title: randomTitle() },
  { id: '2', name: 'Sarah Kim', title: randomTitle() },
]

const initialMessages: ChatMessage[] = [
  { id: 'm1', from: 'Sarah Kim', text: 'Is everyone here? Standup in 2 min.' },
  { id: 'm2', from: 'Sarah Kim', text: 'Also someone left the vault open last night...' },
]

export default function Lobby() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const ready = players.length >= MIN_PLAYERS

  // countdown ticking
  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      setCountdown(null) // later: start the real game here
      return
    }
    const t = setTimeout(() => setCountdown((c) => (c === null ? null : c - 1)), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const addFakePlayer = () => {
    const used = new Set(players.map((p) => p.name))
    const name = fakeNames.find((n) => !used.has(n))
    if (!name) return
    setPlayers((p) => [...p, { id: crypto.randomUUID(), name, title: randomTitle() }])
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const send = (text: string) =>
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: 'You', text }])

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      {/* logo */}
      <div className="mb-8 flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)]" />
        <span className="text-lg font-semibold tracking-tight">Inside Man</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* roster */}
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">Team Room</h1>
              <Badge tone="accent" dot>{ROOM_CODE}</Badge>
            </div>
            <Button variant="ghost" onClick={copyLink} className="flex items-center gap-2">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy link'}
            </Button>
          </div>

          <ul className="mt-6 space-y-3">
            <AnimatePresence initial={false}>
              {players.map((p) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3"
                >
                  <Avatar name={p.name} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {p.name}
                      {p.name === 'You' && <span className="ml-2 text-xs text-zinc-500">(you)</span>}
                    </p>
                    <p className="text-xs text-zinc-400">{p.title}</p>
                  </div>
                  <Badge tone="online" dot>online</Badge>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* footer */}
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
            <p className="text-sm text-zinc-400">
              {ready
                ? 'Everyone is in. Ready when you are.'
                : `Waiting for ${MIN_PLAYERS - players.length} more employee${MIN_PLAYERS - players.length > 1 ? 's' : ''}…`}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={addFakePlayer} title="Dev only">
                <UserPlus size={16} />
              </Button>
              <Button disabled={!ready} onClick={() => setCountdown(3)}>
                Start Shift
              </Button>
            </div>
          </div>
        </GlassPanel>

        {/* chat */}
        <Chat messages={messages} onSend={send} />
      </div>

      {/* countdown overlay */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-md"
          >
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Shift begins in</p>
              <motion.p
                key={countdown}
                initial={{ scale: 1.6, opacity: 0, filter: 'blur(12px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="mt-2 text-9xl font-semibold text-white drop-shadow-[0_0_40px_var(--color-accent)]"
              >
                {countdown}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}