import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import { betValidator, validateAllBets } from 'App/Services/BetService'
import CreateBet from 'App/Validators/CreateBetValidator'
import Updatebet from 'App/Validators/UpdateBetValidator'

export default class BetsController {
  public async index({ response }: HttpContextContract) {
    const bets = await Bet.all()
    return response.ok(bets)
  }

  public async store({ request, response }: HttpContextContract) {
    const userId = 2
    const payload = await request.validate(CreateBet)
    const bets = await validateAllBets(userId, payload.games)
    await Bet.createMany(bets)
    return response.created()
  }

  public async show({ response, params }: HttpContextContract) {
    const bet = await this.findBet(params.id)
    if (!bet) {
      return response.notFound()
    }
    await bet.load('gameType')
    return response.ok(bet)
  }

  public async update({ request, response, params }: HttpContextContract) {
    const bet = await this.findBet(params.id)
    if (!bet) {
      return response.notFound()
    }
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

  public async destroy({ response, params }: HttpContextContract) {
    const bet = await this.findBet(params.id)
    if (!bet) {
      return response.notFound()
    }
    await bet.delete()
    return response.noContent()
  }

  private async findBet(betId: number) {
    return await Bet.find(betId)
  }
}
