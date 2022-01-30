import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('games', 'GamesController')
    .only(['store', 'update', 'destroy'])
    .middleware({
      store: ['auth'],
      update: ['auth'],
      destroy: ['auth'],
    })
}).prefix('admin')

Route.group(() => {
  Route.resource('games', 'GamesController').only(['index', 'show'])
})
