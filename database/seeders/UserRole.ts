import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserRoles from 'App/Models/UserRoles'

export default class UserRoleSeeder extends BaseSeeder {
  public async run() {
    await UserRoles.createMany([
      {
        userId: 1,
        roleId: 1,
      },
      {
        userId: 2,
        roleId: 1,
      },
      {
        userId: 2,
        roleId: 2,
      },
      {
        userId: 3,
        roleId: 2,
      },
      {
        userId: 4,
        roleId: 2,
      },
      {
        userId: 5,
        roleId: 2,
      },
      {
        userId: 6,
        roleId: 2,
      },
      {
        userId: 7,
        roleId: 2,
      },
    ])
  }
}
