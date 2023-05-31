export interface ServerToClientEvents {
  // noArg: () => void;
  // 'message_from_client':(data:string) =>void;
  // withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  message_from_server:(data:string) =>void;
  notify: (message:string) => void;
}
