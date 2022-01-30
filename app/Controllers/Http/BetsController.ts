import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import { betValidator, validateAllBets } from 'App/Services/BetService'
import CreateBet from 'App/Validators/CreateBetValidator'
import Updatebet from 'App/Validators/UpdateBetValidator'

export default class BetsController {
  public async index({ response, bouncer }: HttpContextContract) {
    await bouncer.authorize('isAdmin')
    const bets = await Bet.all()
    return response.ok(bets)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(CreateBet)
    const { id } = await auth.use('api').authenticate()
    const bets = await validateAllBets(id, payload.games)
    await Bet.createMany(bets)
    return response.created()
  }

  public async show({ response, params, bouncer }: HttpContextContract) {
    const bet = await this.findBet(params.id)
    if (!bet) {
      return response.notFound()
    }
    await bouncer.authorize('haveAccessToTheGame', bet)
    await bet.load('gameType')
    return response.ok(bet)
  }

  public async update({ request, response, params, bouncer }: HttpContextContract) {
    const bet = await this.findBet(params.id)
    if (!bet) {
      return response.notFound()
    }
    await bouncer.authorize('haveAccessToTheGame', bet)
    const payload = await request.validate(Updatebet)
    const resultValidation = await betValidator({
      gameId: bet.gameId,
      chosenNumbers: payload.chosen_numbers,
    })
    const { price, ...result } = resultValidation
    bet.merge(result)
    await bet.save()
    return response.noContent()
  }

  public async destroy({ response, params, bouncer }: HttpContextContract) {
    const bet = await this.findBet(params.id)
    if (!bet) {
      return response.notFound()
    }
    await bouncer.authorize('haveAccessToTheGame', bet)
    await bet.delete()
    return response.noContent()
  }

  private async findBet(betId: number) {
    return await Bet.find(betId)
  }
}
