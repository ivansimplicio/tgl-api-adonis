import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateGameValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string.optional({}, [
      rules.maxLength(30),
      rules.unique({ table: 'games', column: 'type' }),
    ]),
    description: schema.string.optional({}, [rules.maxLength(255)]),
    range: schema.number.optional(),
    price: schema.number.optional(),
    max_number: schema.number.optional(),
    color: schema.string.optional({}, [rules.maxLength(15)]),
  })

  public messages = {}
}
