import { useEffect, useState } from 'react'
import { socket } from './socket'
import Background from './components/Background'
import Home from './components/Home'
import Lobby from './components/Lobby'
import type { Room } from './types'

export default function App() {
  const [room, setRoom] = useState<Room | null>(null)

  useEffect(() => {
    const onUpdate = (r: Room) => setRoom(r)
    const onDisconnect = () => setRoom(null)
    socket.on('room:update', onUpdate)
    socket.on('disconnect', onDisconnect)
    return () => {
      socket.off('room:update', onUpdate)
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  return (
    <>
      <Background />
      {room ? <Lobby room={room} /> : <Home onJoined={setRoom} />}
    </>
  )
}