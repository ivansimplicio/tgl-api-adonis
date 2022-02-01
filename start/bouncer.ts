import Bet from 'App/Models/Bet'
import Roles from 'App/Enums/Roles'
import User from 'App/Models/User'

import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import { userHasRole } from 'App/Services/UserService'

export const { actions } = Bouncer.define(
  'userHasAccess',
  (authenticatedUser: User, user: User) => {
    return authenticatedUser.id === user.id
  }
)
  .define('isAdmin', async (user: User) => {
    return userHasRole(user, Roles.ADMIN)
  })
  .define('isPlayer', async (user: User) => {
    return userHasRole(user, Roles.PLAYER)
  })
  .define('haveAccessToTheGame', (user: User, bet: Bet) => {
    return user.id === bet.userId
  })

export const { policies } = Bouncer.registerPolicies({})
