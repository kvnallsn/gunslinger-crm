import type { SqlClient } from './db';
import { v4 as uuidv4 } from 'uuid';

interface IPhoneSystem {
	id: string;
	name: string;
}

class PhoneSystem {
	// unique identifier
	id: string;

	// name of phone system
	name: string;

	constructor(name: string, id?: string) {
		this.id = id ?? uuidv4();
		this.name = name;
	}


	static async fetchAll(client: SqlClient) {
		const phones = await client.query('SELECT * FROM contact_phone_types ORDER BY name ASC');
		return phones.rows.map((p: IPhoneSystem) => new PhoneSystem(p.name, p.id));
	}

	toJSON() {
		return { ...this };
	}
};

export default PhoneSystem;
