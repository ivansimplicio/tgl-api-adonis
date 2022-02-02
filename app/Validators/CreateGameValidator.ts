import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateGameValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({}, [
      rules.maxLength(30),
      rules.unique({ table: 'games', column: 'type' }),
    ]),
    description: schema.string({}, [rules.maxLength(255)]),
    range: schema.number(),
    price: schema.number(),
    max_number: schema.number(),
    color: schema.string({}, [rules.maxLength(15)]),
  })

  public messages = {}
}
