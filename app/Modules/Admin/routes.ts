import Route from '@ioc:Adonis/Core/Route'

Route.post('admin', 'AdminsController.store').middleware('auth')
