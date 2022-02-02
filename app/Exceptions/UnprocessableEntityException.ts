import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@adonisjs/core/build/standalone'
import StandardError from './Errors/StandardError'

export default class UnprocessableEntityException extends Exception {
  public code = 'UNPROCESSABLE_ENTITY'
  public status = 422

  constructor(message: string) {
    super(message)
  }

  public async handle(error: this, ctx: HttpContextContract) {
    return ctx.response
      .status(error.status)
      .send(new StandardError(error.code, error.status, error.message))
  }
}
