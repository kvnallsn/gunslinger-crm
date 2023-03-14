import type { SqlClient } from './db';
import { Location, Grade, Organization, User } from '.';
import { v4 as uuidv4 } from 'uuid';
import { InferType, object, string } from 'yup';
import { ContactForm } from '../forms';

const ContactPhoneSchema = object().shape({
	id: string()
		.required()
		.uuid(),

	system: string()
		.required()
		.min(2),

	number: string()
		.required()
		.min(7, 'Phone number must be at least 7 characters'),
});

interface IContactPhone extends InferType<typeof ContactPhoneSchema> { }

const ContactEmailSchema = object().shape({
	id: string()
		.required()
		.uuid(),

	system: string()
		.required()
		.min(2),

	address: string()
		.required()
		.email('Address must be an email address'),
});

interface IContactEmail extends InferType<typeof ContactEmailSchema> { }

interface IContactSocial {
	service: string;
	username: string;
}

interface IContact {
	id?: string;
	user_id?: string;
	last_name: string;
	first_name: string;
	grade: Grade;
	location: Location;
	org: Organization;
	title: string;
	last_contact?: Date;
	phones?: IContactPhone[];
	emails?: IContactEmail[];
}

export interface ContactNote {
	id: string;
	contact_id: string;
	creator: {
		id: string;
		username: string;
	};
	note: string;
	created_at: Date;
	groups: {
		id: string;
		name: string;
	}
}

class Contact {
	// unique identifier
	id: string;

	// id of user (if linked)
	user_id?: string;

	// contact bio details
	last_name: string;
	first_name: string;
	grade: Grade;
	location: Location;
	org: Organization;
	title: string;
	last_contact?: Date;

	// contact methods
	phones: IContactPhone[];
	emails: IContactEmail[];

	constructor({
		id = uuidv4(),
		user_id,
		last_name,
		first_name,
		grade,
		location,
		org,
		title,
		last_contact,
		phones = [],
		emails = [],
	}: IContact) {
		this.id = id;
		this.user_id = user_id;
		this.last_name = last_name;
		this.first_name = first_name;
		this.grade = grade;
		this.location = location;
		this.org = org;
		this.title = title;
		this.last_contact = last_contact;
		this.emails = emails;
		this.phones = phones;
	}

	static async fetch(client: SqlClient, userId: string, id: string): Promise<Contact> {
		const contact = await client.query<Contact>("SELECT * FROM user_contact_details($1) WHERE id=$2 LIMIT 1", [userId, id]);
		if (contact.rows.length > 0) {
			return new Contact(contact.rows[0]);
		} else {
			throw new Error(`Contact not found, id = ${id}`);
		}
	}

	static async fetchMany(client: SqlClient, userId: string, ids: string[]): Promise<Contact[]> {
		const contacts = await client.query<Contact>("SELECT * FROM user_contact_details($1) WHERE id = ANY($2::uuid[])", [userId, ids]);
		return contacts.rows.map(c => new Contact(c));
	}

	static async fetchAll(client: SqlClient, userId: string): Promise<Contact[]> {
		const contacts = await client.query<Contact>('SELECT * FROM user_contact_details($1) ORDER BY last_name ASC', [userId]);
		return contacts.rows.map(c => new Contact(c));
	}

	static async fetchByUser(client: SqlClient, user: User): Promise<Contact> {
		const contact = await client.query('SELECT * FROM user_contact_details($1) WHERE user_id = $1', [user.id]);
		if (contact.rows.length == 0) {
			throw new Error('no contact found');
		} else {
			return new Contact(contact.rows[0]);
		}
	}

	static async fetchNote(client: SqlClient, userId: string, noteId: string): Promise<ContactNote[]> {
		const notes = await client.query<ContactNote>(`
			SELECT DISTINCT ON (id)
				contact_note_details.*
			FROM
				contact_note_details
			WHERE
				id = $1
				AND
				user_id = $2
		`,
			[noteId, userId]
		);

		return notes.rows;
	}

	static async fetchNotes(client: SqlClient, userId: string, contactId: string): Promise<ContactNote[]> {
		const notes = await client.query<ContactNote>(`
			SELECT DISTINCT ON (id)
				contact_note_details.*
			FROM
				contact_note_details
			WHERE
				contact_id = $1
				AND
				user_id = $2
		`,
			[contactId, userId]
		);

		return notes.rows;
	}

	static async createNote(client: SqlClient, userId: string, contactId: string, note: string, groups: string[], noteId?: string): Promise<ContactNote[]> {
		const id = noteId ?? uuidv4();

		await client.query(`
			INSERT INTO contact_notes	
				(id, contact_id, created_by, note)	
			VALUES
				($1, $2, $3, $4)
		`, [id, contactId, userId, note]);

		for (const group of groups) {
			await client.query(`
				INSERT INTO contact_note_permissions
					(note_id, group_id)
				VALUES
					($1, $2)	
			`, [id, group]);
		}

		return this.fetchNote(client, userId, id)
	}

	toJSON() {
		return {
			id: this.id,
			user_id: this.user_id,
			last_name: this.last_name,
			first_name: this.first_name,
			grade: this.grade,
			location: this.location,
			org: this.org,
			title: this.title,
			last_contact: this.last_contact,
			phones: this.phones,
			emails: this.emails,
		};
	}

	asForm(): ContactForm {
		return {
			id: this.id,
			lastName: this.last_name,
			firstName: this.first_name,
			title: this.title,
			grade: this.grade,
			location: this.location,
			org: this.org,
			phones: this.phones,
			emails: this.emails
		}
	}

	async save(client: SqlClient) {
		// update contact record
		await client.query(`
			INSERT INTO
				contacts (id, last_name, first_name, grade, location, org, title)
			VALUES
				($1, $2, $3, $4, $5, $6, $7)
			ON CONFLICT(id) DO UPDATE
			SET
				last_name = EXCLUDED.last_name,
				first_name = EXCLUDED.first_name,
				grade = EXCLUDED.grade,
				location = EXCLUDED.location,
				org = EXCLUDED.org
			`,
			[
				this.id,
				this.last_name,
				this.first_name,
				this.grade.id,
				this.location.id,
				this.org.id,
				this.title,
			]
		);

		// add phones
		for (const phone of this.phones) {
			await client.query(`
				INSERT INTO
					contact_phones (contact_id, system_id, number)
				VALUES
					($1, $2, $3)
			`,
				[this.id, phone.id, phone.number]
			);
		}

		// add emails
		for (const email of this.emails) {
			await client.query(`
				INSERT INTO
					contact_emails (contact_id, system_id, address)
				VALUES
					($1, $2, $3)
			`,
				[this.id, email.id, email.address]
			);
		}
	}
};

export default Contact;
export { ContactEmailSchema, ContactPhoneSchema };
export type { IContact, IContactEmail, IContactPhone, IContactSocial };
