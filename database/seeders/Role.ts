import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    const uniqueKey = 'role'
    await Role.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        role: 'admin',
      },
      {
        id: 2,
        role: 'player',
      },
    ])
  }
}
