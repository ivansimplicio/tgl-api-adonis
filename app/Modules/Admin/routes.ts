import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('', 'AdminsController.store').middleware('auth')
  Route.put('promote/:id', 'AdminsController.promote').middleware('auth')
}).prefix('admin')
