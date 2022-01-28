import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('bets', 'BetsController')
    .apiOnly()
    .middleware({
      index: ['auth'],
      store: ['auth'],
      show: ['auth'],
      update: ['auth'],
      destroy: ['auth'],
    })
})
