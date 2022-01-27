import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateBetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    games: schema.array().members(
      schema.object().members({
        game_id: schema.number([rules.exists({ table: 'games', column: 'id' })]),
        chosen_numbers: schema.array([rules.distinct('*')]).members(schema.number()),
      })
    ),
  })
  public messages = {}
}
