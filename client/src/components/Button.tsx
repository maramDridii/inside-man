import { motion, type HTMLMotionProps } from 'framer-motion'

type Props = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'ghost' | 'danger'
}

const variants = {
  primary:
    'bg-accent text-white shadow-glow hover:brightness-110 disabled:shadow-none',
  ghost:
    'bg-surface border border-border text-zinc-200 hover:bg-white/10',
  danger:
    'bg-danger text-white shadow-[0_0_40px_rgb(244_63_94/0.35)] hover:brightness-110',
}

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`rounded-xl px-5 py-2.5 text-sm font-medium cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
        shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]
        ${variants[variant]} ${className}`}
      {...props}
    />
  )
}