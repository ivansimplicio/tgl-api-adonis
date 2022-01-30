import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'email'

    await User.updateOrCreateMany(uniqueKey, [
      {
        name: 'User Admin',
        email: 'admin@email.com',
        password: 'senha123',
        role: 'admin',
      },
      {
        name: 'Ivan Simplício',
        email: 'ivan@email.com',
        password: 'senha123',
        role: 'user',
      },
    ])
  }
}