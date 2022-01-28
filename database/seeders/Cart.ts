import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cart from 'App/Models/Cart'

export default class CartSeeder extends BaseSeeder {
  public async run() {
    await Cart.createMany([
      {
        minCartValue: 30,
      },
    ])
  }
}
