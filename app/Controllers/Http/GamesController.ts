import Game from 'App/Models/Game'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GamesController {
  public async index({ response }: HttpContextContract) {
    const games = await Game.all()
    return response.ok(games)
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      await Game.create(
        request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])
      )
      return response.created()
    } catch (err) {
      console.log(err)
      return response.unprocessableEntity({ message: 'The game type already exists' })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    const game = await Game.find(params.id)
    if (game) {
      return response.ok(game)
    }
    return response.notFound()
  }

  public async update({ request, response, params }: HttpContextContract) {
    const game = await Game.find(params.id)
    if (!game) {
      return response.notFound()
    }
    try {
      await game.merge(
        request.only(['type', 'description', 'range', 'price', 'max_number', 'color'])
      )
      await game.save()
      return response.noContent()
    } catch (err) {
      return response.unprocessableEntity({ message: 'The game type already exists' })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    const game = await Game.find(params.id)
    if (!game) {
      return response.notFound()
    }
    await game.delete()
    return response.noContent()
  }
}
