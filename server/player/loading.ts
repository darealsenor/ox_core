import { Dict, PlayerEvents } from 'types'
import { OxPlayer } from './class'
import { GetIdentifiers, GetPlayerLicense } from 'utils'
import { CreateUser, GetUserIdFromIdentifier, UpdateUserTokens } from './db'
import { DEBUG, SV_LAN } from 'config'

const connectingPlayers: Dict<OxPlayer> = {}

async function loadPlayer(playerId: number) {
  let player: OxPlayer | undefined

  try {
    player = new OxPlayer(playerId)
    const license = SV_LAN ? 'fayoum' : GetPlayerLicense(playerId)

    if (!license) return 'No License'

    const identifier = license.substring(license.indexOf(':') + 1)
    let userId: number

    userId = (await GetUserIdFromIdentifier(identifier)) ?? 0

    if (userId && OxPlayer.getFromUserId(userId)) {
      const kickReason = 'User is active'

      if (!DEBUG) return kickReason

      userId = (await GetUserIdFromIdentifier(identifier, 1)) ?? 0
      if (userId && OxPlayer.getFromUserId(userId)) return kickReason
    }

    const tokens = getPlayerTokens(playerId)
    await UpdateUserTokens(userId, tokens)

    player.username = GetPlayerName(player.source as string)
    player.userId = userId ? userId : await CreateUser(player.username, GetIdentifiers(playerId))
    player.identifier = identifier

    DEV: console.info(`Loaded player data for OxPlayer<${player.userId}>`)

    return player
  } catch (err) {
    console.error('Error loading player:', err)

    if (player?.userId) {
      try {
        OxPlayer.remove(player.source)
      } catch (cleanupErr) {
        console.error('Error during cleanup:', cleanupErr)
      }
    }

    return err.message
  }
}

on(PlayerEvents.playerConnecting, async (username: string, _: any, deferrals: any) => {
  const tempId = source

  deferrals.defer()

  const player = await loadPlayer(tempId)

  if (!(player instanceof OxPlayer)) return deferrals.done(player || 'Failed to load player.')

  connectingPlayers[tempId] = player

  deferrals.done()
})

onNet(PlayerEvents.playerJoined, async () => {
  const playerSrc = source
  const player = connectingPlayers[playerSrc] || (await loadPlayer(playerSrc))
  delete connectingPlayers[playerSrc]

  if (!(player instanceof OxPlayer)) return DropPlayer(playerSrc.toString(), player || 'Failed to load player.')

  player.setAsJoined()
})
