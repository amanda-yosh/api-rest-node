import { afterAll, beforeEach, beforeAll, describe, expect, test } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { execSync } from 'node:child_process'

describe('/transactions', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('should be able to create a new transaction', async () => {
    await request(app.server) // server is a property of app - node
      .post('/transactions')
      .send({
        title: 'Test transaction',
        amount: 100,
        type: 'credit',
      })
      .expect(201)
  })

  test('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server) // server is a property of app - node
      .post('/transactions')
      .send({
        title: 'Test transaction',
        amount: 100,
        type: 'credit',
      })

    const cookie = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
      .expect(200)

    console.log(listTransactionResponse.body)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Test transaction',
        amount: 100,
      }),
    ])
  })
})
