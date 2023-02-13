import type { SqlClient } from './db';
import { v4 as uuidv4 } from 'uuid';

class Grade {
	// unique identifier
	id: string;

	// rank or grade identifier
	name: string;

	constructor(name: string, id?: string) {
		this.id = id ?? uuidv4();
		this.name = name;
	}


	static async fetchAll(client: SqlClient) {
		const grades = await client.query('SELECT * FROM grades ORDER BY name ASC');
		return grades.rows.map((g: any) => new Grade(g.name, g.id));
	}

	static async fetch(client: SqlClient, id: string) {
		const grades = await client.query('SELECT * FROM grades WHERE id = $1', [id]);
		if (grades.rows.length == 0) {
			throw new Error(`no grade found with id '${id}'`)
		}

		return grades.rows.map((g: any) => new Grade(g.name, g.id))[0];
	}

	toJSON() {
		return { ...this };
	}
};

export default Grade;
