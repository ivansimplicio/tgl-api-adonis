import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUser from 'App/Validators/CreateUserValidator'
import UpdateUser from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const users = await User.all()
    return response.ok(users)
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateUser)
    await User.create(payload)
    return response.created()
  }

  public async show({ response, params }: HttpContextContract) {
    const user = await this.findUser(params.id)
    if (!user) {
      return response.notFound()
    }
    await user.load('bets')
    return response.ok(user)
  }

  public async update({ request, response, params }: HttpContextContract) {
    const user = await this.findUser(params.id)
    if (!user) {
      return response.notFound()
    }
    const payload = await request.validate(UpdateUser)
    user.merge(payload)
    await user.save()
    return response.noContent()
  }

  public async destroy({ response, params }: HttpContextContract) {
    const user = await this.findUser(params.id)
    if (!user) {
      return response.notFound()
    }
    await user.delete()
    return response.noContent()
  }

  private async findUser(userId: number) {
    return await User.find(userId)
  }
}
