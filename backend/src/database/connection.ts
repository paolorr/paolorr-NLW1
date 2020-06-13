import knex from 'knex';
import path from 'path';

const config = require('../../knexfile');

if (config.client === 'sqlite3') {
	config.pool = {
		afterCreate: (conn: any, cb: any) => {
			conn.run('PRAGMA foreign_keys = ON', cb);
		},
	};
}

const connection = knex(config);
// const connection = knex({
// 	client: 'sqlite3',
// 	connection: {
// 		filename: path.resolve(__dirname, 'database.sqlite'),
// 	},
// 	useNullAsDefault: true,
// });

export default connection;
