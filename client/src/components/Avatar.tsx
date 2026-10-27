function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export default function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const h = hash(name)
  const hue1 = h % 360
  const hue2 = (hue1 + 50) % 360
  const initials = name.trim().slice(0, 2).toUpperCase() || '?'

  return (
    <div
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white
        shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, hsl(${hue1} 80% 60%), hsl(${hue2} 80% 45%))`,
      }}
    >
      {initials}
    </div>
  )
}