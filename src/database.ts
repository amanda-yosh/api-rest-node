import { knex as setupKnex, Knex } from 'knex'

export const knexConfig: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './tmp/app.db', // relative path to root of project
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(knexConfig)
