import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

export default function App() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    return () => { socket.off('connect'); socket.off('disconnect') }
  }, [])

  return (
    <div className="h-full grid place-items-center">
      <div className="rounded-card border border-border bg-surface px-8 py-6 backdrop-blur-xl shadow-glow">
        <h1 className="text-2xl font-semibold">Inside Man</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Server: {connected ? '🟢 connected' : '🔴 offline'}
        </p>
      </div>
    </div>
  )
}