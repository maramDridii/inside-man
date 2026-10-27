import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
app.use(cors())
app.get('/', (_, res) => res.send('Inside Man server is alive'))

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log('connected:', socket.id)
  socket.on('disconnect', () => console.log('left:', socket.id))
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => console.log(`Server on :${PORT}`))