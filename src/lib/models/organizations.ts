import type { SqlClient } from './db';
import { v4 as uuidv4 } from 'uuid';

class Organization {
	// unique identifier
	id: string;

	// name of organization
	name: string;

	constructor(name: string, id?: string) {
		this.id = id ?? uuidv4();
		this.name = name;
	}


	static async fetchAll(client: SqlClient) {
		const orgs = await client.query('SELECT * FROM organizations ORDER BY name ASC');
		return orgs.rows.map((o: any) => new Organization(o.name, o.id));
	}

	static async fetch(client: SqlClient, id: string) {
		const orgs = await client.query('SELECT * FROM organizations WHERE id = $1', [id]);
		if (orgs.rows.length == 0) {
			throw new Error(`no organization found with id '${id}'`)
		}

		return orgs.rows.map((o: any) => new Organization(o.name, o.id))[0];
	}

	toJSON() {
		return { ...this };
	}

	async save(client: SqlClient) {
		await client.query(
			'INSERT INTO organizations (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name',
			[this.id, this.name]
		)
	}
};

export default Organization;
