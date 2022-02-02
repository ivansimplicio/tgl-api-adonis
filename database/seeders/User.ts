import { DateTime } from 'luxon'
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
        createdAt: DateTime.local(2021, 12, 1, 0, 0, 0),
      },
      {
        name: 'Ivan Simplício',
        email: 'ivan@email.com',
        password: 'senha123',
        createdAt: DateTime.local(2021, 12, 1, 0, 0, 0),
      },
      {
        name: 'José Alves',
        email: 'jose@email.com',
        password: 'senha123',
        createdAt: DateTime.local(2021, 12, 1, 0, 0, 0),
      },
      {
        name: 'Maria Silva',
        email: 'maria@email.com',
        password: 'senha123',
        createdAt: DateTime.local(2021, 12, 1, 0, 0, 0),
      },
      {
        name: 'João Pereira',
        email: 'joao@email.com',
        password: 'senha123',
        createdAt: DateTime.local(2021, 12, 1, 0, 0, 0),
      },
      {
        name: 'Kaio Alves',
        email: 'kaio@email.com',
        password: 'senha123',
        createdAt: DateTime.local(2022, 1, 20, 0, 0, 0),
      },
      {
        name: 'Madalena',
        email: 'madalena@email.com',
        password: 'senha123',
        createdAt: DateTime.local(2022, 1, 31, 0, 0, 0),
      },
    ])
  }
}
