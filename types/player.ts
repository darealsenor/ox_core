export enum PlayerEvents {
    playerJoined = 'playerJoined',
    playerConnecting = 'playerConnecting'
}

export interface PlayerCurrency {
    userId?: number
    vp: number
    rp: number
    xp: number
  }