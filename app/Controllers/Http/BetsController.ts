import Game from 'App/Models/Game'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
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
    const bets = await this.validateBets(userId, payload.games)
    await Bet.createMany(bets)
    return response.created()
  }

  public async validateBets(userId: number, bets: any) {
    const verifiedBets: Array<any> = []
    for await (const bet of bets) {
      const result = await this.validateBet({
        userId,
        gameId: bet.game_id,
        chosenNumbers: bet.chosen_numbers,
      })
      verifiedBets.push(result)
    }
    return verifiedBets
  }

  public async validateBet(bet: any) {
    const game = await Game.find(bet.gameId)
    if (!game) return
    const numbers = bet.chosenNumbers
    if (!(game.maxNumber === numbers.length)) {
      throw new Error('does not have the amount of numbers required by the game')
    }
    if (Math.min(...numbers) <= 0 || Math.max(...numbers) > game.range) {
      throw new Error('the array has some value outside the range allowed by the game')
    }
    bet.chosenNumbers = numbers.toString()
    return bet
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
    const resultValidation = await this.validateBet({
      gameId: bet.gameId,
      chosenNumbers: payload.chosen_numbers,
    })
    bet.merge(resultValidation)
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
