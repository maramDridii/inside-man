export type Player = { id: string; name: string; title: string }
export type ChatMessage = { id: string; from: string; text: string }
export type Room = {
  code: string
  hostId: string
  players: Player[]
  messages: ChatMessage[]
}