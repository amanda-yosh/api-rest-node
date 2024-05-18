import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

// todo plugin do fastify precisa ser async
export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async () => {
    console.log(
      'preHandler hook to make global validations for /transactions route',
    )
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const sessionId = req.cookies.sessionId

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select('*')

      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const sessionId = req.cookies.sessionId

      const getTransactionParmasSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParmasSchema.parse(req.params)

      const transaction = await knex('transactions')
        .where({ id, session_id: sessionId })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const sessionId = req.cookies.sessionId

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/', // qualquer rota do domínio pode acessar o cookie
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    // para criação de recurso, o status é 201 - recurso criado com sucesso

    return res.status(201).send()
  })
}
