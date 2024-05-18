import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'
import { transactionRoutes } from './routes/transactions'

const app = fastify()

// a ordem dos plugins importa
app.register(cookie)
app.addHook('preHandler', async () => {
  console.log('preHandler hook to make global validations for all routes')
})
app.register(transactionRoutes, { prefix: '/transactions' })

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server is running on port 3333')
  })
