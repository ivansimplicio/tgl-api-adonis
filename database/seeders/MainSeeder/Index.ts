import Application from '@ioc:Adonis/Core/Application'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(seeder: { default: typeof BaseSeeder }) {
    if (seeder.default.developmentOnly && !Application.inDev) {
      return
    }
    await new seeder.default(this.client).run()
  }

  public async run() {
    await this.runSeeder(await import('../Cart'))
    await this.runSeeder(await import('../Game'))
    await this.runSeeder(await import('../User'))
    await this.runSeeder(await import('../Bet'))
    await this.runSeeder(await import('../Role'))
    await this.runSeeder(await import('../UserRole'))
  }
}
