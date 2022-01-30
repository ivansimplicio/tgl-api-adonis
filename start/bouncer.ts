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
  .define('isAdmin', (user: User) => {
    return user.role === Roles.ADMIN
  })
  .define('haveAccessToTheGame', (user: User, bet: Bet) => {
    return user.id === bet.userId
  })

export const { policies } = Bouncer.registerPolicies({})
