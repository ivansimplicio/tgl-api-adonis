import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Game from './Game'

export default class Bet extends BaseModel {
  public static table = 'bets'

  @column({ isPrimary: true })
  public id: number

  @column()
  public chosen_numbers: string

  @column()
  public game_id: number

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Game, {
    foreignKey: 'game_id',
  })
  public gameType: BelongsTo<typeof Game>
}
