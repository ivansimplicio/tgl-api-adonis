import Database from '@ioc:Adonis/Lucid/Database'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create User', (group) => {
  const userDefault = {
    name: 'user default',
    email: 'user@email.com',
    password: 'secret123',
  }

  test('It should create the user, returning status code 201 and empty body', async (assert) => {
    const user = { ...userDefault }
    const response = await supertest(BASE_URL).post('/users').send(user)
    const EXPECTED_CODE = 201
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.deepEqual(response.body, {})
  })

  test('It should return status code 422 and an error message in the body, when the email is already registered', async (assert) => {
    const user = { ...userDefault }
    await supertest(BASE_URL).post('/users').send(user)
    const response = await supertest(BASE_URL).post('/users').send(user)
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'unique')
    assert.equal(response.body.errors[0].field, 'email')
  })

  test('It should return status code 422 and an error message in the body, when the email is in an invalid pattern', async (assert) => {
    const user = { ...userDefault, email: 'user@email' }
    const response = await supertest(BASE_URL).post('/users').send(user)
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'email')
    assert.equal(response.body.errors[0].field, 'email')
  })

  test('It should return status code 422 and an error message in the body, when the name field is empty', async (assert) => {
    const user = { ...userDefault, name: '' }
    const response = await supertest(BASE_URL).post('/users').send(user)
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'required')
    assert.equal(response.body.errors[0].field, 'name')
  })

  test('It should return status code 422 and an error message in the body, when the password is shorter than the allowed length', async (assert) => {
    const user = { ...userDefault, password: 'secret' }
    const response = await supertest(BASE_URL).post('/users').send(user)
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'minLength')
    assert.equal(response.body.errors[0].field, 'password')
  })

  test('It should return status code 422 and an error message in the body, when the name field is not passed', async (assert) => {
    const { email, password } = userDefault
    const response = await supertest(BASE_URL).post('/users').send({ email, password })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'required')
    assert.equal(response.body.errors[0].field, 'name')
  })

  test('It should return status code 422 and an error message in the body, when the email field is not passed', async (assert) => {
    const { name, password } = userDefault
    const response = await supertest(BASE_URL).post('/users').send({ name, password })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'required')
    assert.equal(response.body.errors[0].field, 'email')
  })

  test('It should return status code 422 and an error message in the body, when the password field is not passed', async (assert) => {
    const { name, email } = userDefault
    const response = await supertest(BASE_URL).post('/users').send({ name, email })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'required')
    assert.equal(response.body.errors[0].field, 'password')
  })

  test('It should return status code 422 and a list of errors in the body, when no field is passed', async (assert) => {
    const response = await supertest(BASE_URL).post('/users').send({})
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    const AMOUNT_OF_ERRORS = 3
    assert.equal(response.body.errors.length, AMOUNT_OF_ERRORS)
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
