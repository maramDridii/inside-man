import { motion } from 'framer-motion'

const blobs = [
  { color: '#8b5cf6', size: 520, top: '-10%', left: '-5%', x: [0, 120, -40], y: [0, 80, 40], d: 22 },
  { color: '#38bdf8', size: 460, top: '40%', left: '60%', x: [0, -140, 30], y: [0, -60, 90], d: 26 },
  { color: '#2dd4bf', size: 400, top: '65%', left: '5%', x: [0, 100, -60], y: [0, -90, 20], d: 30 },
]

const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-bg">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: b.color,
            opacity: 0.28,
            filter: 'blur(110px)',
          }}
          animate={{ x: b.x, y: b.y }}
          transition={{ duration: b.d, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
      ))}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: grain }}
      />
    </div>
  )
}