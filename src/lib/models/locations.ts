import type { SqlClient } from './db';
import { v4 as uuidv4 } from 'uuid';

interface ILocation {
	id: string;
	city: string;
	state: string;
}

class Location {
	// unique identifier
	id: string;

	// name of city / base
	city: string;

	// name of state
	state: string;

	constructor(city: string, state: string, id?: string) {
		this.id = id ?? uuidv4();
		this.city = city;
		this.state = state;
	}

	/// Returns all locations
	static async fetchAll(client: SqlClient) {
		const locations = await client.query('SELECT * FROM locations ORDER BY state ASC, city ASC');
		return locations.rows.map((l: ILocation) => new Location(l.city, l.state, l.id));
	}

	/// Returns the location with the corresponding id
	static async fetch(client: SqlClient, id: string) {
		const locations = await client.query('SELECT * FROM locations WHERE id = $1', [id]);
		if (locations.rows.length == 0) {
			throw new Error(`no location with id '${id}' found`)
		} 

		return locations.rows.map((l: ILocation) => new Location(l.city, l.state, l.id))[0];
	}

	toJSON() {
		return { ...this };
	}

	async save(client: SqlClient) {
		await client.query('INSERT INTO locations (id, city, state) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET city = EXCLUDED.city, state = EXCLUDED.state', [this.id, this.city, this.state]);
	}
};

export default Location;
