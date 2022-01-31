import Roles from 'App/Enums/Roles'
import CreateUser from 'App/Validators/CreateUserValidator'
import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminsController {
  public async store({ request, response, bouncer }: HttpContextContract) {
    const payload = await request.validate(CreateUser)
    await bouncer.authorize('isAdmin')
    await User.create({ ...payload, role: Roles.ADMIN })
    return response.created()
  }
}
