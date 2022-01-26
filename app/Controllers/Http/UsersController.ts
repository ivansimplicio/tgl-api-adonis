import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const users = await User.all()
    return response.ok(users)
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      await User.create(request.only(['name', 'email', 'password', 'role']))
      return response.created()
    } catch (err) {
      return response.unprocessableEntity({ message: 'The email is already registered' })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    const user = await User.find(params.id)
    if (user) {
      await user.load('bets')
      return response.ok(user)
    }
    return response.notFound()
  }

  public async update({ request, response, params }: HttpContextContract) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound()
    }
    try {
      await user.merge(request.only(['name', 'email']))
      await user.save()
      return response.noContent()
    } catch (err) {
      return response.unprocessableEntity({ message: 'The email is already registered' })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound()
    }
    await user.delete()
    return response.noContent()
  }
}
