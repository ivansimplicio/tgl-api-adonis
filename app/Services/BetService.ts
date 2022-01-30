import Game from 'App/Models/Game'
import Cart from 'App/MOdels/Cart'

const validateAllBets = async (userId: number, bets: any) => {
  const verifiedBets: Array<any> = []
  let amount: number = 0
  for await (const bet of bets) {
    const validatedBet = await betValidator({
      userId,
      gameId: bet.game_id,
      chosenNumbers: bet.chosen_numbers,
    })
    const { price, ...result } = validatedBet
    amount += price
    verifiedBets.push(result)
  }
  const minCartValue = await getMinCartValue(1)
  if (minCartValue && minCartValue > amount) {
    throw new Error(
      `the value of your bets must total at least ${minCartValue}, but total only ${amount}`
    )
  }
  return { amount, verifiedBets }
}

const betValidator = async (bet: any) => {
  const game = await Game.find(bet.gameId)
  if (!game) return
  const numbers = bet.chosenNumbers
  if (!(game.maxNumber === numbers.length)) {
    throw new Error('does not have the amount of numbers required by the game')
  }
  if (Math.min(...numbers) <= 0 || Math.max(...numbers) > game.range) {
    throw new Error('the array has some value outside the range allowed by the game')
  }
  bet.chosenNumbers = sort(numbers).toString()
  return { price: game.price, ...bet }
}

const sort = (numbers: Array<number>) => {
  return numbers.sort((x, y) => x - y)
}

const getMinCartValue = async (cartId: number) => {
  const cart = await Cart.find(cartId)
  if (cart) {
    return cart.minCartValue
  }
}

export { betValidator }
export { validateAllBets }
