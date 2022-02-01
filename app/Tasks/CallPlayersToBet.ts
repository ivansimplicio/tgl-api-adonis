import Roles from 'App/Enums/Roles'
import User from 'App/Models/User'
import { BaseTask } from 'adonis5-scheduler/build'
import { dateSevenDaysAgo } from 'App/Services/DateService'
import CallPlayerToPlay from 'App/Mailers/CallPlayerToPlayEmail'
import moment from 'moment'
import { DateTime } from 'luxon'

export default class CallPlayersToBet extends BaseTask {
  public static get schedule() {
    return '0 * * * * *'
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
    const dateNow = moment(DateTime.now().toJSDate())
    allUsers.forEach(async (user) => {
      await user.load('roles')
      const roles: Array<number> = []
      user.roles.forEach((element) => {
        roles.push(element.roleId)
      })
      const dateCreate = moment(user.createdAt.toJSDate())
      if (
        !userIdWithGames.includes(user.id) &&
        dateNow.diff(dateCreate, 'days') >= 7 &&
        roles.includes(Roles.PLAYER)
      ) {
        await new CallPlayerToPlay(user.email, user.name).sendLater()
      }
    })
  }
}
