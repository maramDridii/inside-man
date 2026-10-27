import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import GlassPanel from './GlassPanel'
import Avatar from './Avatar'
import type { ChatMessage } from '../types'

type Props = {
  messages: ChatMessage[]
  onSend: (text: string) => void
}

export default function Chat({ messages, onSend }: Props) {
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    onSend(t)
    setText('')
  }

  return (
    <GlassPanel className="flex h-[520px] flex-col p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300">
        <span className="text-zinc-500">#</span> general
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-2.5">
            <Avatar name={m.from} size={28} />
            <div>
              <p className="text-xs font-medium text-zinc-300">{m.from}</p>
              <p className="text-sm text-zinc-400">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={submit} className="mt-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message #general"
          className="flex-1 rounded-xl border border-border bg-white/5 px-3 py-2 text-sm
            outline-none placeholder:text-zinc-600 focus:border-accent/60"
        />
        <button
          type="submit"
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl bg-white/10 hover:bg-white/15"
        >
          <Send size={16} />
        </button>
      </form>
    </GlassPanel>
  )
}