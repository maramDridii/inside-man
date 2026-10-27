import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { randomTitle } from './titles.js'

const app = express()
app.use(cors())
app.get('/', (_, res) => res.send('Inside Man server is alive'))

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

const MAX_PLAYERS = 8
const MIN_PLAYERS = 4
const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // no I or O, easy to read out loud

const rooms = new Map() // code -> room

function makeCode() {
  let code
  do {
    code = Array.from({ length: 4 }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]).join('')
  } while (rooms.has(code))
  return code
}

const cleanName = (n) => String(n ?? '').trim().slice(0, 16) || 'Player'

// what we send to clients (no internal fields)
const publicRoom = (r) => ({
  code: r.code,
  hostId: r.hostId,
  players: r.players,
  messages: r.messages,
})

function leaveRoom(socket) {
  const code = socket.data.code
  if (!code) return
  socket.leave(code)
  socket.data.code = null

  const room = rooms.get(code)
  if (!room) return

  room.players = room.players.filter((p) => p.id !== socket.id)
  if (room.players.length === 0) {
    rooms.delete(code)
    return
  }
  if (room.hostId === socket.id) room.hostId = room.players[0].id
  io.to(code).emit('room:update', publicRoom(room))
}

function joinRoom(socket, room, name) {
  const player = { id: socket.id, name: cleanName(name), title: randomTitle() }
  room.players.push(player)
  socket.join(room.code)
  socket.data.code = room.code
  io.to(room.code).emit('room:update', publicRoom(room))
}

io.on('connection', (socket) => {
  console.log('connected:', socket.id)

  socket.on('room:create', ({ name }, ack) => {
    leaveRoom(socket)
    const code = makeCode()
    const room = { code, hostId: socket.id, players: [], messages: [], counting: false }
    rooms.set(code, room)
    joinRoom(socket, room, name)
    ack?.({ room: publicRoom(room) })
  })

  socket.on('room:join', ({ code, name }, ack) => {
    const room = rooms.get(String(code ?? '').toUpperCase().trim())
    if (!room) return ack?.({ error: 'Room not found' })
    if (room.players.length >= MAX_PLAYERS) return ack?.({ error: 'Room is full' })
    leaveRoom(socket)
    joinRoom(socket, room, name)
    ack?.({ room: publicRoom(room) })
  })

  socket.on('room:leave', () => leaveRoom(socket))

  socket.on('chat:send', (text) => {
    const room = rooms.get(socket.data.code)
    const player = room?.players.find((p) => p.id === socket.id)
    const clean = String(text ?? '').trim().slice(0, 200)
    if (!room || !player || !clean) return

    room.messages.push({ id: crypto.randomUUID(), from: player.name, text: clean })
    room.messages = room.messages.slice(-100)
    io.to(room.code).emit('room:update', publicRoom(room))
  })

  socket.on('game:start', () => {
    const room = rooms.get(socket.data.code)
    if (!room || room.hostId !== socket.id) return
    if (room.players.length < MIN_PLAYERS || room.counting) return

    room.counting = true
    let n = 3
    io.to(room.code).emit('countdown', n)
    const timer = setInterval(() => {
      n--
      io.to(room.code).emit('countdown', n)
      if (n === 0) {
        clearInterval(timer)
        room.counting = false
        // Week 2: the real game starts here
      }
    }, 1000)
  })

  socket.on('disconnect', () => {
    console.log('left:', socket.id)
    leaveRoom(socket)
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => console.log(`Server on :${PORT}`))