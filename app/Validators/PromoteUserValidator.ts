import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PromoteUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    role: schema.string({}, [rules.exists({ table: 'roles', column: 'role' })]),
  })

  public messages = {}
}
