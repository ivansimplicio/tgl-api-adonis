import Game from 'App/Models/Game'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'

export default class BetsController {
  public async index({ response }: HttpContextContract) {
    const bets = await Bet.all()
    return response.ok(bets)
  }

  public async store({ request, response }: HttpContextContract) {
    const userId = 2
    const body = request.body()
    const bets = await this.validateBets(userId, body)
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
    if (!game) {
      throw new Error('game type not found')
    }
    const numbers = bet.chosenNumbers
    if (!this.arrayContainsOnlyNumbers(numbers)) {
      throw new Error('there is some value passed in the array which is different from number')
    }
    if (!(game.maxNumber === numbers.length)) {
      throw new Error('does not have the amount of numbers required by the game')
    }
    if (Math.min(...numbers) <= 0 || Math.max(...numbers) > game.range) {
      throw new Error('the array has some value outside the range allowed by the game')
    }
    if (!this.arrayHasUniqueElements(numbers)) {
      throw new Error('there cannot be repeated numbers in the game')
    }
    let { userId, gameId, chosenNumbers } = bet
    chosenNumbers = chosenNumbers.toString()
    return { userId, gameId, chosenNumbers }
  }

  public arrayContainsOnlyNumbers(numbers: []) {
    const regex = /^[\d,]+$/
    return regex.test(numbers.toString())
  }

  public arrayHasUniqueElements(numbers: []) {
    return numbers.every((elem, index, arr) => arr.indexOf(elem) === index)
  }

  public async show({ response, params }: HttpContextContract) {
    const bet = await Bet.find(params.id)
    if (bet) {
      await bet.load('gameType')
      return response.ok(bet)
    }
    return response.notFound()
  }

  public async update({}: HttpContextContract) {}

  public async destroy({ response, params }: HttpContextContract) {
    const bet = await Bet.find(params.id)
    if (!bet) {
      return response.notFound()
    }
    await bet.delete()
    return response.noContent()
  }
}
