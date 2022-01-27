import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Game from './Game'

export default class Bet extends BaseModel {
  public static table = 'bets'

  @column({ isPrimary: true })
  public id: number

  @column()
  public chosenNumbers: string

  @column()
  public gameId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Game, {
    foreignKey: 'gameId',
  })
  public gameType: BelongsTo<typeof Game>
}
