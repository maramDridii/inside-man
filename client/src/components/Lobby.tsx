import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { socket } from '../socket'
import GlassPanel from './GlassPanel'
import Button from './Button'
import Avatar from './Avatar'
import Badge from './Badge'
import Chat from './Chat'
import type { Room } from '../types'

const MIN_PLAYERS = 4

export default function Lobby({ room }: { room: Room }) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const me = socket.id
  const isHost = room.hostId === me
  const missing = MIN_PLAYERS - room.players.length
  const ready = missing <= 0

  useEffect(() => {
    const onCountdown = (n: number) => setCountdown(n === 0 ? null : n)
    socket.on('countdown', onCountdown)
    return () => {
      socket.off('countdown', onCountdown)
    }
  }, [])

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/?room=${room.code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <div className="mb-8 flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)]" />
        <span className="text-lg font-semibold tracking-tight">Inside Man</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">Team Room</h1>
              <Badge tone="accent" dot>{room.code}</Badge>
            </div>
            <Button variant="ghost" onClick={copyLink} className="flex items-center gap-2">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy link'}
            </Button>
          </div>

          <ul className="mt-6 space-y-3">
            <AnimatePresence initial={false}>
              {room.players.map((p) => (
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
                      {p.id === me && <span className="ml-2 text-xs text-zinc-500">(you)</span>}
                    </p>
                    <p className="text-xs text-zinc-400">{p.title}</p>
                  </div>
                  {p.id === room.hostId && <Badge tone="accent">host</Badge>}
                  <Badge tone="online" dot>online</Badge>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
            <p className="text-sm text-zinc-400">
              {!ready
                ? `Waiting for ${missing} more employee${missing > 1 ? 's' : ''}…`
                : isHost
                  ? 'Everyone is in. Ready when you are.'
                  : 'Waiting for the host to start the shift…'}
            </p>
            {isHost && (
              <Button disabled={!ready} onClick={() => socket.emit('game:start')}>
                Start Shift
              </Button>
            )}
          </div>
        </GlassPanel>

        <Chat messages={room.messages} onSend={(text) => socket.emit('chat:send', text)} />
      </div>

      <AnimatePresence>
        {countdown !== null && (
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