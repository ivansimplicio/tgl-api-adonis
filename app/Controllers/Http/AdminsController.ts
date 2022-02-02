import { userHasRole } from 'App/Services/UserService'
import UserRoles from 'App/Models/UserRoles'
import Roles from 'App/Enums/Roles'
import CreateUser from 'App/Validators/CreateUserValidator'
import PromoteUser from 'App/Validators/PromoteUserValidator'
import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import UnprocessableEntity from 'App/Exceptions/UnprocessableEntityException'

export default class AdminsController {
  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('isAdmin')
    const payload = await request.validate(CreateUser)
    const user = await User.create(payload)
    await UserRoles.create({ userId: user.id, roleId: Roles.ADMIN })
    return response.created()
  }

  public async promote({ request, response, params, bouncer }: HttpContextContract) {
    await bouncer.authorize('isAdmin')
    const payload = await request.validate(PromoteUser)
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound()
    }
    const role = await Role.findByOrFail('role', payload.role)
    if (await userHasRole(user, role.id)) {
      throw new UnprocessableEntity(`the user is already ${payload.role}`)
    }
    await UserRoles.create({ userId: user.id, roleId: role.id })
    return response.noContent()
  }
}
