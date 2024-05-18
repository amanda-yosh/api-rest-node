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

# Requisitos da Aplicação

## Requisitos Funcionais

- [x] o usuário deve poder criar uma nova transação;
- [x] o usuário deve poder obter um resumo da sua conta;
- [x] o usuário deve poder listar todas transações que já ocorreram;
- [x] o usuário deve poder visualizar uma transação única.

## Regras de negócio

- [ ] a transação pode ser do tipo crédito que somará ao valor total ou débito que subtrairá.
- [ ] deve ser possível identificarmos o usuário entre as requisições;
- [ ] o usuário só pode visualizar transações as quais ele criou.

## Requisitos não funcionais

- [ ] quais?


### cookies

- forma de manter contexto entre requisições