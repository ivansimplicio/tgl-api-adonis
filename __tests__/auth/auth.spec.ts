import Database from '@ioc:Adonis/Lucid/Database'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Auth User', (group) => {
  const credentialsDefault = {
    email: 'user@email.com',
    password: 'secret123',
  }

  test('It should return status code 200 and a token in the response body, when the credentials are correct', async (assert) => {
    const credentials = { ...credentialsDefault }
    const response = await supertest(BASE_URL).post('/login').send(credentials)
    const EXPECTED_CODE = 200
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.exists(response.body.token)
  })

  test('It should return status code 422 and an error message in the body, when the email is in an invalid pattern', async (assert) => {
    const credentials = { ...credentialsDefault, email: 'user@email' }
    const response = await supertest(BASE_URL).post('/login').send(credentials)
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'email')
    assert.equal(response.body.errors[0].field, 'email')
  })

  test('It should return status code 422 and an error message in the body, when the password is shorter than the allowed length', async (assert) => {
    const credentials = { ...credentialsDefault, password: 'secret' }
    const response = await supertest(BASE_URL).post('/login').send(credentials)
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'minLength')
    assert.equal(response.body.errors[0].field, 'password')
  })

  test('It should return status code 400 and an error message in the body of the response, when the email is not registered', async (assert) => {
    const credentials = { ...credentialsDefault, email: 'test@email.com' }
    const response = await supertest(BASE_URL).post('/login').send(credentials)
    const EXPECTED_CODE = 400
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.message, 'Invalid credentials')
  })

  test('It should return status code 400 and an error message in the body of the response, when the password is invalid', async (assert) => {
    const credentials = { ...credentialsDefault, password: 'secret124' }
    const response = await supertest(BASE_URL).post('/login').send(credentials)
    const EXPECTED_CODE = 400
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.message, 'Invalid credentials')
  })

  test('It should return status code 422 and an error message in the body, when the email field is not passed', async (assert) => {
    const { password } = credentialsDefault
    const response = await supertest(BASE_URL).post('/login').send({ password })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'required')
    assert.equal(response.body.errors[0].field, 'email')
  })

  test('It should return status code 422 and an error message in the body, when the password field is not passed', async (assert) => {
    const { email } = credentialsDefault
    const response = await supertest(BASE_URL).post('/login').send({ email })
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    assert.equal(response.body.errors[0].rule, 'required')
    assert.equal(response.body.errors[0].field, 'password')
  })

  test('It should return status code 422 and a list of errors in the body, when no field is passed', async (assert) => {
    const response = await supertest(BASE_URL).post('/login').send({})
    const EXPECTED_CODE = 422
    assert.equal(response.statusCode, EXPECTED_CODE)
    const AMOUNT_OF_ERRORS = 2
    assert.equal(response.body.errors.length, AMOUNT_OF_ERRORS)
  })

  group.before(async () => {
    await Database.beginGlobalTransaction()
    const user = {
      name: 'user default',
      email: 'user@email.com',
      password: 'secret123',
    }
    await supertest(BASE_URL).post('/users').send(user)
  })

  group.after(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
