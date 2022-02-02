import Cart from 'App/Models/Cart'

const getMinCartValue = async () => {
  const DEFAULT_ID = 1
  const cart = await Cart.findOrFail(DEFAULT_ID)
  return cart.minCartValue
}

export default getMinCartValue
