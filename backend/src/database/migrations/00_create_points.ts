import Knex from 'knex';

export async function up(knex: Knex) {
	const client = knex.client.config.client;

	console.log(client);

	return knex.schema.createTable('points', (table) => {
		table.increments('id').primary();
		table.string('image').notNullable();
		table.string('name').notNullable();
		table.string('email').notNullable();
		table.string('whatsapp').notNullable();
		table.decimal('latitude').notNullable();
		table.decimal('longitude').notNullable();
		table.string('city').notNullable();
		table.string('state', 2).notNullable();
	});
}

export async function down(knex: Knex) {
	return knex.schema.dropTable('points');
}
