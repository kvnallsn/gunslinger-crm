import type { SqlClient } from './db';
import { v4 as uuidv4 } from 'uuid';

interface IEmailSystem {
	id: string;
	name: string;
}

class EmailSystem {
	// unique identifier
	id: string;

	// name of email system
	name: string;

	constructor(name: string, id?: string) {
		this.id = id ?? uuidv4();
		this.name = name;
	}


	static async fetchAll(client: SqlClient) {
		const emails = await client.query('SELECT * FROM contact_email_types ORDER BY name ASC');
		return emails.rows.map((e: IEmailSystem) => new EmailSystem(e.name, e.id));
	}

	toJSON() {
		return { ...this };
	}
};

export default EmailSystem;
