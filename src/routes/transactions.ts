import { FastifyInstance } from 'fastify'
import { knex } from '../database'

// todo plugin do fastify precisa ser async
export async function transactionRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    // fazendo uma transação
    // const transaction = await knex('transactions')
    //   .insert({
    //     id: crypto.randomUUID(),
    //     title: 'Transação de teste',
    //     amount: 1000,
    //   })
    //   .returning('*')
    // return transaction

    // fazendo um select, busca
    const transactions = await knex('transactions').select('*')

    return transactions
  })
}
