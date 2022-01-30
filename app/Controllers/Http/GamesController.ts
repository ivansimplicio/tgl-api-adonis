import Game from 'App/Models/Game'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateGame from 'App/Validators/CreateGameValidator'
import UpdateGame from 'App/Validators/UpdateGameValidator'

export default class GamesController {
  public async index({ response }: HttpContextContract) {
    const games = await Game.all()
    return response.ok(games)
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    const payload = await request.validate(CreateGame)
    await bouncer.authorize('isAdmin')
    await Game.create(payload)
    return response.created()
  }

  public async show({ response, params }: HttpContextContract) {
    const game = await this.findGame(params.id)
    if (!game) {
      return response.notFound()
    }
    return response.ok(game)
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const game = await this.findGame(params.id)
    if (!game) {
      return response.notFound()
    }
    const payload = await request.validate(UpdateGame)
    await bouncer.authorize('isAdmin')
    game.merge(payload)
    await game.save()
    return response.noContent()
  }

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    const game = await this.findGame(params.id)
    if (!game) {
      return response.notFound()
    }
    await bouncer.authorize('isAdmin')
    await game.delete()
    return response.noContent()
  }

  private async findGame(gameId: number) {
    return await Game.find(gameId)
  }
}
