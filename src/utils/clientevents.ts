export enum ClientEvents {
  subscribe_room = "subscribe_room", // Connection is opened or re-opened
  unsubscribe_room = "unsubscribe_room", // Connection is closed
  message = "message", // A message was received
}
