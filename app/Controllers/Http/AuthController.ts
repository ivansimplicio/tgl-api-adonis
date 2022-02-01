import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StandardError from 'App/Exceptions/Errors/StandardError'
import LoginUser from 'App/Validators/LoginUserValidator'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(LoginUser)
    try {
      const user = await User.findBy('email', payload.email)
      const token = await auth.use('api').attempt(payload.email, payload.password, {
        expiresIn: '7days',
        name: user?.serialize().email,
      })
      return { token, user: user?.serialize() }
    } catch {
      return response.badRequest(new StandardError('BAD_REQUEST', 400, 'Invalid credentials'))
    }
  }
}
