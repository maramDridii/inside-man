import type { ReactNode } from 'react'

const tones = {
  neutral: 'bg-white/10 text-zinc-300',
  accent: 'bg-accent/20 text-violet-300',
  online: 'bg-emerald-500/15 text-emerald-300',
  danger: 'bg-danger/20 text-rose-300',
}

export default function Badge({
  tone = 'neutral',
  dot = false,
  children,
}: {
  tone?: keyof typeof tones
  dot?: boolean
  children: ReactNode
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />}
      {children}
    </span>
  )
}