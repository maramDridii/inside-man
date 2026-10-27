let ctx: AudioContext | null = null
let muted = false

export const setMuted = (m: boolean) => { muted = m }

function tone(freq: number, duration = 0.12, type: OscillatorType = 'sine', gain = 0.06, delay = 0) {
  if (muted) return
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()

  const t = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(g).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

export const sfx = {
  join: () => { tone(660, 0.1); tone(880, 0.14, 'sine', 0.06, 0.08) },
  leave: () => { tone(440, 0.12); tone(330, 0.16, 'sine', 0.06, 0.08) },
  message: () => tone(1000, 0.06, 'triangle', 0.04),
  tick: () => tone(520, 0.1, 'triangle'),
  go: () => { tone(523, 0.12); tone(659, 0.12, 'sine', 0.06, 0.1); tone(784, 0.3, 'sine', 0.06, 0.2) },
}