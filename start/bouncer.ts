import Bet from 'App/Models/Bet'
import Roles from 'App/Enums/Roles'
import User from 'App/Models/User'

import Bouncer from '@ioc:Adonis/Addons/Bouncer'

export const { actions } = Bouncer.define(
  'userHasAccess',
  (authenticatedUser: User, user: User) => {
    return authenticatedUser.id === user.id
  }
)
  .define('isAdmin', async (user: User) => {
    await user.load('roles')
    const roles: Array<number> = []
    user.roles.forEach((element) => {
      roles.push(element.roleId)
    })
    return roles.includes(Roles.ADMIN)
  })
  .define('haveAccessToTheGame', (user: User, bet: Bet) => {
    return user.id === bet.userId
  })

export const { policies } = Bouncer.registerPolicies({})
