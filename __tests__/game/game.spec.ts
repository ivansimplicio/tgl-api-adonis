import Database from '@ioc:Adonis/Lucid/Database'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Game CRUD: Index', () => {
  test('It should return status code 200 and a body in the response', async (assert) => {
    const response = await supertest(BASE_URL).get('/games')
    const EXPECTED_CODE = 200
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body['min-cart-value'])
    assert.exists(response.body['types'])
  })
})

test.group('Game CRUD: Show', () => {
  test('It should return status code 200 and a body in the response, when the informed id is registered', async (assert) => {
    const EXISTING_ID = 1
    const response = await supertest(BASE_URL).get(`/games/${EXISTING_ID}`)
    const EXPECTED_CODE = 200
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body)
  })

  test('It should return the status code 404 and an empty body in the response, when the informed id is not registered', async (assert) => {
    const NON_EXISTENT_ID = 99
    const response = await supertest(BASE_URL).get(`/games/${NON_EXISTENT_ID}`)
    const EXPECTED_CODE = 404
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.deepEqual(response.body, {})
  })
})

const defaultGame = {
  type: 'Lotomania',
  description: 'Jogue para ganhar',
  range: 70,
  price: 3,
  max_number: 10,
  color: '#FFFFFF',
}

const credentials = {
  admin: {
    email: 'admin@email.com',
    password: 'senha123',
  },
  player: {
    email: 'joao@email.com',
    password: 'senha123',
  },
}

test.group('Game CRUD: Store', (group) => {
  const tokens = {
    admin: '',
    player: '',
  }

  test('It should return status code 201 when the game is successfully registered', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/admin/games')
      .auth(tokens.admin, { type: 'bearer' })
      .send(defaultGame)
    const EXPECTED_CODE = 201
    assert.equal(response.statusCode, EXPECTED_CODE)
  })

  test('It should return status code 401 and an error in the body, when a token is not passed', async (assert) => {
    const response = await supertest(BASE_URL).post('/admin/games').send(defaultGame)
    const EXPECTED_CODE = 401
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.errors)
  })

  test('It should return status code 401 and an error in the body, when the token passed is invalid', async (assert) => {
    const invalidToken = '123'
    const response = await supertest(BASE_URL)
      .post('/admin/games')
      .auth(invalidToken, { type: 'bearer' })
      .send(defaultGame)
    const EXPECTED_CODE = 401
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.errors)
  })

  test('It should return status code 403 and an error in the body, when the token passed is from a player', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/admin/games')
      .auth(tokens.player, { type: 'bearer' })
      .send(defaultGame)
    const EXPECTED_CODE = 403
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.message)
  })

  test('It should return status code 422 and an error in the body, when the game type is already registered', async (assert) => {
    const game = { ...defaultGame, type: 'Lotofácil' }
    const response = await supertest(BASE_URL)
      .post('/admin/games')
      .auth(tokens.admin, { type: 'bearer' })
      .send(game)
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'unique')
    assert.equal(response.body.errors[0].field, 'type')
  })

  test('It should return status code 422 and an error in the body, when invalid data is passed to some field', async (assert) => {
    const game = { ...defaultGame, range: 'seventy' }
    const response = await supertest(BASE_URL)
      .post('/admin/games')
      .auth(tokens.admin, { type: 'bearer' })
      .send(game)
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'number')
    assert.equal(response.body.errors[0].field, 'range')
  })

  test('It should return status code 422 and an error in the body, when some required field is missing', async (assert) => {
    const { color, ...rest } = defaultGame
    const response = await supertest(BASE_URL)
      .post('/admin/games')
      .auth(tokens.admin, { type: 'bearer' })
      .send(rest)
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'required')
    assert.equal(response.body.errors[0].field, 'color')
  })

  group.before(async () => {
    tokens.admin = await (
      await supertest(BASE_URL).post('/login').send(credentials.admin)
    ).body.token.token
    tokens.player = await (
      await supertest(BASE_URL).post('/login').send(credentials.player)
    ).body.token.token
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})

test.group('Game CRUD: Update', (group) => {
  const tokens = {
    admin: '',
    player: '',
  }

  test('It should return status code 200 and game updated in response body, when game is updated successfully', async (assert) => {
    const EXISTING_ID = 1
    const response = await supertest(BASE_URL)
      .put(`/admin/games/${EXISTING_ID}`)
      .auth(tokens.admin, { type: 'bearer' })
      .send(defaultGame)
    const EXPECTED_CODE = 200
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body)
  })

  test('It should return status code 401 and an error in the body, when a token is not passed', async (assert) => {
    const EXISTING_ID = 1
    const response = await supertest(BASE_URL).put(`/admin/games/${EXISTING_ID}`).send(defaultGame)
    const EXPECTED_CODE = 401
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.errors)
  })

  test('It should return status code 401 and an error in the body, when the token passed is invalid', async (assert) => {
    const invalidToken = 'token123'
    const EXISTING_ID = 1
    const response = await supertest(BASE_URL)
      .put(`/admin/games/${EXISTING_ID}`)
      .auth(invalidToken, { type: 'bearer' })
      .send(defaultGame)
    const EXPECTED_CODE = 401
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.errors)
  })

  test('It should return status code 403 and an error in the body, when the token passed is from a player', async (assert) => {
    const EXISTING_ID = 1
    const response = await supertest(BASE_URL)
      .put(`/admin/games/${EXISTING_ID}`)
      .auth(tokens.player, { type: 'bearer' })
      .send(defaultGame)
    const EXPECTED_CODE = 403
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.message)
  })

  test('It should return 404 status code and empty response body, when id passed is non-existent', async (assert) => {
    const NON_EXISTENT_ID = 99
    const response = await supertest(BASE_URL)
      .put(`/admin/games/${NON_EXISTENT_ID}`)
      .auth(tokens.admin, { type: 'bearer' })
      .send(defaultGame)
    const EXPECTED_CODE = 404
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.deepEqual(response.body, {})
  })

  test('It should return status code 422 and an error in the body, when the game type is already registered', async (assert) => {
    const EXISTING_ID = 1
    const game = { ...defaultGame, type: 'Mega-Sena' }
    const response = await supertest(BASE_URL)
      .put(`/admin/games/${EXISTING_ID}`)
      .auth(tokens.admin, { type: 'bearer' })
      .send(game)
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'unique')
    assert.equal(response.body.errors[0].field, 'type')
  })

  test('It should return status code 422 and an error in the body, when invalid data is passed to some field', async (assert) => {
    const EXISTING_ID = 1
    const game = { range: 'seventy' }
    const response = await supertest(BASE_URL)
      .put(`/admin/games/${EXISTING_ID}`)
      .auth(tokens.admin, { type: 'bearer' })
      .send(game)
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'number')
    assert.equal(response.body.errors[0].field, 'range')
  })

  group.before(async () => {
    tokens.admin = await (
      await supertest(BASE_URL).post('/login').send(credentials.admin)
    ).body.token.token
    tokens.player = await (
      await supertest(BASE_URL).post('/login').send(credentials.player)
    ).body.token.token
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})

test.group('Game CRUD: Delete', (group) => {
  const tokens = {
    admin: '',
    player: '',
  }

  test('It should return status code 204 and empty response body, when the game is successfully deleted', async (assert) => {
    const EXISTING_ID = 1
    const response = await supertest(BASE_URL)
      .delete(`/admin/games/${EXISTING_ID}`)
      .auth(tokens.admin, { type: 'bearer' })
    const EXPECTED_CODE = 204
    assert.equal(response.statusCode, EXPECTED_CODE)
  })

  test('It should return status code 401 and an error in the body, when a token is not passed', async (assert) => {
    const EXISTING_ID = 1
    const response = await supertest(BASE_URL).delete(`/admin/games/${EXISTING_ID}`)
    const EXPECTED_CODE = 401
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.errors)
  })

  test('It should return status code 401 and an error in the body, when the token passed is invalid', async (assert) => {
    const EXISTING_ID = 1
    const invalidToken = 'token123'
    const response = await supertest(BASE_URL)
      .delete(`/admin/games/${EXISTING_ID}`)
      .auth(invalidToken, { type: 'bearer' })
    const EXPECTED_CODE = 401
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.errors)
  })

  test('It should return status code 403 and an error in the body, when the token passed is from a player', async (assert) => {
    const EXISTING_ID = 1
    const response = await supertest(BASE_URL)
      .delete(`/admin/games/${EXISTING_ID}`)
      .auth(tokens.player, { type: 'bearer' })
    const EXPECTED_CODE = 403
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.message)
  })

  test('It should return 404 status code and empty response body, when id passed is non-existent', async (assert) => {
    const NON_EXISTENT_ID = 99
    const response = await supertest(BASE_URL)
      .delete(`/admin/games/${NON_EXISTENT_ID}`)
      .auth(tokens.admin, { type: 'bearer' })
    const EXPECTED_CODE = 404
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.deepEqual(response.body, {})
  })

  group.before(async () => {
    tokens.admin = await (
      await supertest(BASE_URL).post('/login').send(credentials.admin)
    ).body.token.token
    tokens.player = await (
      await supertest(BASE_URL).post('/login').send(credentials.player)
    ).body.token.token
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
