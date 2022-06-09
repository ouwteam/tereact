export enum WebsocketEvents {
  open = "open", // Connection is opened or re-opened
  close = "close", // Connection is closed
  error = "error", // An error occurred
  message = "message", // A message was received
  retry = "retry", // A try to re-connect is made
}
