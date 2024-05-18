import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL, // relative path to root of project
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: env.MIGRATIONS_PATH,
  },
}

export const knex = setupKnex(config)
