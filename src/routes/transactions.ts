import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

// todo plugin do fastify precisa ser async
export async function transactionRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')

    return { transactions }
  })

  app.get('/:id', async (req) => {
    const getTransactionParmasSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParmasSchema.parse(req.params)

    const transaction = await knex('transactions').where('id', id).first()

    return { transaction }
  })

  app.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    // para criação de recurso, o status é 201 - recurso criado com sucesso

    return res.status(201).send()
  })
}
