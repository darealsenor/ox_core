import { ClassInterface } from 'classInterface'
import { Dict } from 'types'
import { GetCurrencies } from './db'

export class OxPlayer extends ClassInterface {
  source: number | string
  userId: number
  username: string
  identifier: string

  protected static members: Dict<OxPlayer> = {}
  protected static keys: Dict<Dict<OxPlayer>> = {
    userId: {},
  }

  /** Get an instance of OxPlayer with the matching playerId. */
  static get(id: string | number) {
    return this.members[id]
  }

  /** Get an instance of OxPlayer with the matching userId. */
  static getFromUserId(id: number) {
    return this.keys.userId[id]
  }

  /** Gets all instances of OxPlayer, optionally comparing against a filter. */
  static getAll(filter?: Dict<any>, asArray?: false): Dict<OxPlayer>
  static getAll(filter?: Dict<any>, asArray?: true): OxPlayer[]
  static getAll(filter?: Dict<any>, asArray = false): Dict<OxPlayer> | OxPlayer[] {
    if (!filter) return asArray ? Object.values(this.members) : this.members

    const obj: Dict<OxPlayer> = {}

    for (const id in this.members) {
      const player = this.members[id].filter(filter)
      if (player) obj[id] = player
    }

    return asArray ? Object.values(obj) : obj
  }

  /** Saves all players to the database, and optionally kicks them from the server. */
  static saveAll(kickWithReason?: string) {}

  constructor(source: number) {
    super()
    this.source = source
  }

  /** Triggers an event on the player's client. */
  emit(eventName: string, ...args: any[]) {
    emitNet(eventName, this.source, ...args)
  }

  /** Adds the player to the player registry and starts character selection. */
  async setAsJoined() {
    if (!OxPlayer.getFromUserId(this.userId)) {
      OxPlayer.add(this.source, this)
      Player(this.source).state.set('userId', this.userId, true)
    }

    DEV: console.info(`Starting character selection for OxPlayer<${this.userId}>`)

    const playerCurrnecies = await GetCurrencies(this.userId)
    console.log(playerCurrnecies);
  }
}

OxPlayer.init()

exports('SaveAllPlayers', (arg: any) => OxPlayer.saveAll(arg))
exports('GetPlayerFromUserId', (arg: any) => OxPlayer.getFromUserId(arg))
exports('GetPlayers', (arg: any) => OxPlayer.getAll(arg, true))
