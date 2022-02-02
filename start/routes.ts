import Route from '@ioc:Adonis/Core/Route'

import 'App/Modules/User/routes'
import 'App/Modules/Admin/routes'
import 'App/Modules/Game/routes'
import 'App/Modules/Bet/routes'

Route.post('login', 'AuthController.login')
Route.post('forgot-password', 'PasswordsController.forgotPassword')
Route.post('reset-password', 'PasswordsController.resetPassword')

Route.get('/', async () => {
  return { api: 'tgl' }
})
