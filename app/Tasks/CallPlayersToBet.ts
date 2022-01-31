import Roles from 'App/Enums/Roles'
import User from 'App/Models/User'
import { BaseTask } from 'adonis5-scheduler/build'
import { dateSevenDaysAgo } from 'App/Services/DateService'
import CallPlayerToPlay from 'App/Mailers/CallPlayerToPlayEmail'

export default class CallPlayersToBet extends BaseTask {
  public static get schedule() {
    return '0 0 9 * * *'
  }
  public static get useLock() {
    return false
  }

  public async handle() {
    const date = dateSevenDaysAgo()
    const usersWithBets = await User.query().whereHas('bets', (query) => {
      query.where('created_at', '>', date)
    })
    const userIdWithGames: number[] = []
    usersWithBets.forEach((user) => {
      userIdWithGames.push(user.id)
    })
    const allUsers = await User.query()
    allUsers.forEach(async (user) => {
      if (!userIdWithGames.includes(user.id) && user.role === Roles.PLAYER) {
        await new CallPlayerToPlay(user.email, user.name).sendLater()
      }
    })
  }
}