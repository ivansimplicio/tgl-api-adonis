import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('users', 'UsersController')
    .apiOnly()
    .middleware({
      index: ['auth'],
      show: ['auth'],
      update: ['auth'],
      destroy: ['auth'],
    })
})

Route.post('admin', 'UsersController.storeAdmin').middleware('auth')
