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
    const createTransactionResponse = await request(app.server)
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

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Test transaction',
        amount: 100,
      }),
    ])
  })

  test('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
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

    const transactionID = listTransactionResponse.body.transactions[0].id

    const transactionResponse = await request(app.server)
      .get(`/transactions/${transactionID}`)
      .set('Cookie', cookie)
      .expect(200)

    console.log(transactionResponse)

    expect(transactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Test transaction',
        amount: 100,
      }),
    )
  })

  test('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 400,
        type: 'credit',
      })

    const cookie = createTransactionResponse.get('Set-Cookie')

    await request(app.server).post('/transactions').set('Cookie', cookie).send({
      title: 'Debit transaction',
      amount: 100,
      type: 'debit',
    })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie)
      .expect(200)

    console.log(summaryResponse)

    expect(summaryResponse.body.summary).toEqual(
      expect.objectContaining({
        amount: 300,
      }),
    )
  })
})
