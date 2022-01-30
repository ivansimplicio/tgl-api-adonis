import { DateTime } from 'luxon'
import Bet from 'App/Models/Bet'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class BetSeeder extends BaseSeeder {
  public async run() {
    await Bet.createMany([
      {
        chosenNumbers: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15',
        gameId: 1,
        userId: 2,
        createdAt: DateTime.local(2022, 1, 30, 0, 0, 0),
        updatedAt: DateTime.local(2022, 1, 30, 0, 0, 0),
      },
      {
        chosenNumbers: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15',
        gameId: 1,
        userId: 2,
        createdAt: DateTime.local(2022, 1, 15, 0, 0, 0),
        updatedAt: DateTime.local(2022, 1, 15, 0, 0, 0),
      },
      {
        chosenNumbers: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15',
        gameId: 1,
        userId: 2,
        createdAt: DateTime.local(2022, 1, 1, 0, 0, 0),
        updatedAt: DateTime.local(2022, 1, 1, 0, 0, 0),
      },
      {
        chosenNumbers: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15',
        gameId: 1,
        userId: 2,
        createdAt: DateTime.local(2021, 12, 31, 0, 0, 0),
        updatedAt: DateTime.local(2021, 12, 31, 0, 0, 0),
      },
      {
        chosenNumbers: '1,2,3,4,5,6',
        gameId: 2,
        userId: 3,
        createdAt: DateTime.local(2021, 12, 30, 0, 0, 0),
        updatedAt: DateTime.local(2021, 12, 30, 0, 0, 0),
      },
      {
        chosenNumbers: '1,2,3,4,5,6',
        gameId: 2,
        userId: 3,
        createdAt: DateTime.local(2021, 12, 29, 0, 0, 0),
        updatedAt: DateTime.local(2021, 12, 29, 0, 0, 0),
      },
    ])
  }
}
