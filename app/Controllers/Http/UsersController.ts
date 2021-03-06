import loadUserRoles from 'App/Services/UserService'
import UserRoles from 'App/Models/UserRoles'
import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUser from 'App/Validators/CreateUserValidator'
import UpdateUser from 'App/Validators/UpdateUserValidator'
import Roles from 'App/Enums/Roles'
import { startDateLastMonth } from 'App/Services/DateService'
import ProducerService from 'App/Services/kafka/ProducerService'

export default class UsersController {
  public async index({ response, bouncer }: HttpContextContract) {
    const users = await User.all()
    await bouncer.authorize('isAdmin')
    return response.ok(users)
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(CreateUser)
    const user = await User.create(payload)
    await UserRoles.create({ userId: user.id, roleId: Roles.PLAYER })
    await new ProducerService().produceTopicWelcomeEmail(user)
    return response.created()
  }

  public async show({ response, params, bouncer }: HttpContextContract) {
    const user = await this.findUser(params.id)
    if (!user) {
      return response.notFound()
    }
    await bouncer.authorize('userHasAccess', user)
    await user.load('bets', (query) => {
      query.where('created_at', '>=', startDateLastMonth().toString())
    })
    await new ProducerService().produceTopicCallPlayersEmail({
      name: user.name,
      email: user.email,
    })
    const result = await loadUserRoles(user)
    return response.ok(result)
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const user = await this.findUser(params.id)
    if (!user) {
      return response.notFound()
    }
    const payload = await request.validate(UpdateUser)
    await bouncer.authorize('userHasAccess', user)
    user.merge(payload)
    const updatedUser = await user.save()
    const result = await loadUserRoles(updatedUser)
    return response.ok(result)
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
