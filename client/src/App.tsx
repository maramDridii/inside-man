import Background from './components/Background'
import GlassPanel from './components/GlassPanel'
import Button from './components/Button'
import Avatar from './components/Avatar'
import Badge from './components/Badge'

const people = [
  { name: 'Sarah Kim', title: 'Head of Vibes' },
  { name: 'Marcus Lee', title: 'Senior DevOps' },
  { name: 'Yasmine B', title: 'Product Designer' },
]

export default function App() {
  return (
    <>
      <Background />
      <div className="grid min-h-full place-items-center p-6">
        <GlassPanel className="w-full max-w-md p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Team Room</h1>
            <Badge tone="accent" dot>ABCD</Badge>
          </div>

          <ul className="mt-5 space-y-3">
            {people.map((p) => (
              <li key={p.name} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <Avatar name={p.name} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-zinc-400">{p.title}</p>
                </div>
                <Badge tone="online" dot>online</Badge>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-3">
            <Button className="flex-1">Start Shift</Button>
            <Button variant="ghost">Copy link</Button>
            <Button variant="danger" disabled>Vote</Button>
          </div>
        </GlassPanel>
      </div>
    </>
  )
}