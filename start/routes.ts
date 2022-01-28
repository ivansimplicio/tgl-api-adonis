import Route from '@ioc:Adonis/Core/Route'

import 'App/Modules/User/routes'
import 'App/Modules/Game/routes'
import 'App/Modules/Bet/routes'

Route.post('login', 'AuthController.login')

Route.get('/', async () => {
  return { hello: 'world' }
})
