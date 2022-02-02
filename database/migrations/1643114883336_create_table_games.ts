import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateTableGames extends BaseSchema {
  protected tableName = 'games'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('type', 30).unique().notNullable()
      table.string('description', 255).notNullable()
      table.integer('range').unsigned().notNullable()
      table.double('price').notNullable()
      table.integer('max_number').unsigned().notNullable()
      table.string('color', 15).notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
