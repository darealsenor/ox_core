import { db } from 'db'
import { Dict, PlayerCurrency } from 'types'

export function GetUserIdFromIdentifier(identifier: string, offset?: number) {
  return db.column<number>('SELECT userId FROM users WHERE license2 = ? LIMIT ?, 1', [identifier, offset || 0])
}

export async function UpdateUserTokens(userId: number, tokens: string[]) {
  const parameters = tokens.map((token) => [userId, token])

  await db.batch('INSERT IGNORE INTO user_tokens (userId, token) VALUES (?, ?)', parameters)
}

export async function CreateUser(username: string, { license2, steam, fivem, discord }: Dict<string>) {
  const userId = await db.insert(
    'INSERT INTO users (username, license2, steam, fivem, discord) VALUES (?, ?, ?, ?, ?)',
    [username, license2, steam, fivem, discord],
  )

  await db.insert(`INSERT INTO user_currencies (userId, vp, rp, xp) VALUES (?, ?, ?, ?)`, [userId, 1000, 0, 0])

  return userId
}

export async function GetCurrencies(userId: number): Promise<PlayerCurrency> {
  const result = await db.execute<PlayerCurrency[]>('SELECT * FROM user_currencies WHERE userId = ?', [userId])
  return db.single(result)
}
