import Database from '@ioc:Adonis/Lucid/Database'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

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

test.group('Create Bets', (group) => {
  const tokens = {
    admin: '',
    player: '',
  }
  let bets: Array<any> = []

  test('It should return status code 201, when the bet is valid', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(tokens.player, { type: 'bearer' })
      .send({ games: bets })
    const EXPECTED_CODE = 201
    assert.equal(response.statusCode, EXPECTED_CODE)
  })

  test('It should return status code 401 and an error in the body, when a token is not passed', async (assert) => {
    const response = await supertest(BASE_URL).post('/bets').send({ games: bets })
    const EXPECTED_CODE = 401
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.errors)
  })

  test('It should return status code 401 and an error in the body, when the token passed is invalid', async (assert) => {
    const invalidToken = 'token123'
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(invalidToken, { type: 'bearer' })
      .send({ games: bets })
    const EXPECTED_CODE = 401
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.errors)
  })

  test('It should return status code 403 and an error in the body, when the token passed is not from a player', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(tokens.admin, { type: 'bearer' })
      .send({ games: bets })
    const EXPECTED_CODE = 403
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.message)
  })

  test('It should return status code 422 and an error in the response body, when the bet amount is less than allowed', async (assert) => {
    bets.pop()
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(tokens.player, { type: 'bearer' })
      .send({ games: bets })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.message)
  })

  test('It should return status code 422 and an error in the response body, when not passed the games array', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(tokens.player, { type: 'bearer' })
      .send({})
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'required')
    assert.equal(response.body.errors[0].field, 'games')
  })

  test('It should return status code 422 and an error in the response body, when some game array object is in invalid pattern', async (assert) => {
    bets.push({ gameId: 2, chosen_numbers: [1, 2, 3, 4, 5, 6] })
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(tokens.player, { type: 'bearer' })
      .send({ games: bets })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'required')
  })

  test('It should return status code 422 and an error in the response body, when passed a non-existent game id', async (assert) => {
    const NON_EXISTENT_GAME_ID = 4
    bets.push({ game_id: NON_EXISTENT_GAME_ID, chosen_numbers: [1, 2, 3, 4, 5, 6] })
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(tokens.player, { type: 'bearer' })
      .send({ games: bets })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'exists')
  })

  test('It should return status code 422 and an error in the response body, when a value other than number is passed', async (assert) => {
    const GAME_ID = 2
    bets.push({ game_id: GAME_ID, chosen_numbers: [1, 2, 3, 4, 5, 'six'] })
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(tokens.player, { type: 'bearer' })
      .send({ games: bets })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'number')
  })

  test('It should return status code 422 and an error in the response body, when passed repeated values ​​to a game', async (assert) => {
    const GAME_ID = 2
    bets.push({ game_id: GAME_ID, chosen_numbers: [1, 2, 3, 4, 5, 5] })
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(tokens.player, { type: 'bearer' })
      .send({ games: bets })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'distinct')
  })

  test('It should return status code 422 and an error in the response body, when fewer numbers are passed than the game allows', async (assert) => {
    const GAME_ID = 2
    bets.push({ game_id: GAME_ID, chosen_numbers: [1, 2, 3, 4, 5] })
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(tokens.player, { type: 'bearer' })
      .send({ games: bets })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.message)
  })

  test('It should return status code 422 and an error in the response body when more numbers are passed than the game allows', async (assert) => {
    const GAME_ID = 2
    bets.push({ game_id: GAME_ID, chosen_numbers: [1, 2, 3, 4, 5, 6, 7] })
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(tokens.player, { type: 'bearer' })
      .send({ games: bets })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.message)
  })

  test('It should return status code 422 and an error in the body of the response, when a number with a value greater than what the game allows is passed', async (assert) => {
    const GAME_ID = 2
    bets.push({ game_id: GAME_ID, chosen_numbers: [1, 2, 3, 4, 5, 61] })
    const response = await supertest(BASE_URL)
      .post('/bets')
      .auth(tokens.player, { type: 'bearer' })
      .send({ games: bets })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.message)
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
    bets = []
    const GAME_ID = 2
    for (let i = 0; i < 7; i++) {
      bets.push({ game_id: GAME_ID, chosen_numbers: randomBetGenerator() })
    }
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})

const randomBetGenerator = () => {
  const quantity = 6
  const range = 60
  const finalArray: Array<number> = []
  let cont = 0
  while (cont < quantity) {
    const number = Math.floor(Math.random() * range) + 1
    if (!finalArray.includes(number)) {
      finalArray.push(number)
      cont++
    }
  }
  return finalArray.sort((x, y) => x - y)
}
