### criando uma migration
```
$ npm run knex -- migrate:make create-documents

// exemplo 2
$ npm run knex -- migrate:make add-session-id-to-transaction
```

### executar a criação da tabela

```
$ npm run knex -- migrate:latest
```

### CASO ainda não tenha enviado a migration para o time e precise dar um rollback

```
$ npm run knex -- migrate:rollback
```