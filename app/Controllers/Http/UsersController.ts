import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUser from 'App/Validators/CreateUserValidator'
import UpdateUser from 'App/Validators/UpdateUserValidator'
import Roles from 'App/Enums/Roles'

export default class UsersController {
  public async index({ response, bouncer }: HttpContextContract) {
    const users = await User.all()
    await bouncer.authorize('isAdmin')
    return response.ok(users)
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateUser)
    await User.create({ ...payload, role: Roles.PLAYER })
    return response.created()
  }

  public async storeAdmin({ request, response, bouncer }: HttpContextContract) {
    const payload = await request.validate(CreateUser)
    await bouncer.authorize('isAdmin')
    await User.create({ ...payload, role: Roles.ADMIN })
    return response.created()
  }

  public async show({ response, params, bouncer }: HttpContextContract) {
    const user = await this.findUser(params.id)
    if (!user) {
      return response.notFound()
    }
    await bouncer.authorize('userHasAccess', user)
    await user.load('bets')
    return response.ok(user)
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const user = await this.findUser(params.id)
    if (!user) {
      return response.notFound()
    }
    const payload = await request.validate(UpdateUser)
    await bouncer.authorize('userHasAccess', user)
    user.merge(payload)
    await user.save()
    return response.noContent()
  }

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    const user = await this.findUser(params.id)
    if (!user) {
      return response.notFound()
    }
    await bouncer.authorize('userHasAccess', user)
    await user.delete()
    return response.noContent()
  }

  private async findUser(userId: number) {
    return await User.find(userId)
  }
}