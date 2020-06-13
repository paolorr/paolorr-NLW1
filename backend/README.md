## Initialize TypeScript Project

1. `npm i -D typescript`
2. `npm i -D ts-node`
3. `npx tsc --init`
4. `npm i -D ts-node-dev` (this package does the same as nodemon, but for typescript)

## Run TypeScript Project

`npx ts-node src/server.ts`  
or  
`npx ts-node-dev src/server.ts`

If the lib doesn't have types definition, add it via npm as dev dependency (e.g. `npm i -D @types/express`)

## Create SQLite database

1. `npm run knex:migrate`
2. `npm run knex:seed`
