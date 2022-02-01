import Game from 'App/Models/Game'
import UnprocessableEntity from 'App/Exceptions/UnprocessableEntityException'
import getMinCartValue from './CartService'

const validateAllBets = async (userId: number, bets: any) => {
  const verifiedBets: Array<any> = []
  const allBetsInfo: Array<any> = []
  let amount: number = 0
  for await (const bet of bets) {
    const validatedBet = await betValidator({
      userId,
      gameId: bet.game_id,
      chosenNumbers: bet.chosen_numbers,
    })
    const { type, price, ...result } = validatedBet
    amount += price
    allBetsInfo.push(validatedBet)
    verifiedBets.push(result)
  }
  const minCartValue = await getMinCartValue()
  if (minCartValue && minCartValue > amount) {
    throw new UnprocessableEntity(
      `the value of your bets must total at least ${minCartValue}, but total only ${amount}`
    )
  }
  return { verifiedBets, amount, allBetsInfo }
}

const betValidator = async (bet: any) => {
  const game = await Game.find(bet.gameId)
  if (!game) return
  const numbers = bet.chosenNumbers
  if (!(game.maxNumber === numbers.length)) {
    throw new UnprocessableEntity('does not have the amount of numbers required by the game')
  }
  if (Math.min(...numbers) <= 0 || Math.max(...numbers) > game.range) {
    throw new UnprocessableEntity('the array has some value outside the range allowed by the game')
  }
  bet.chosenNumbers = sort(numbers).toString()
  return { type: game.type, price: game.price, ...bet }
}

const sort = (numbers: Array<number>) => {
  return numbers.sort((x, y) => x - y)
}

export { betValidator }
export { validateAllBets }
