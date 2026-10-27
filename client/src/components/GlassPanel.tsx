import type { HTMLAttributes } from 'react'

export default function GlassPanel({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-border bg-surface backdrop-blur-xl
        shadow-[0_8px_32px_rgb(0_0_0/0.35),inset_0_1px_0_rgb(255_255_255/0.06)] ${className}`}
      {...props}
    />
  )
}