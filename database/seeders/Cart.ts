import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cart from 'App/Models/Cart'

export default class CartSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'id'
    await Cart.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        minCartValue: 30,
      },
    ])
  }
}
