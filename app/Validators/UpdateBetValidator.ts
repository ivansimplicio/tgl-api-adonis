import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateBetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    chosen_numbers: schema.array([rules.distinct('*')]).members(schema.number()),
  })

  public messages = {}
}
