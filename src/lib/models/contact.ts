import type { SqlClient } from './db';
import { Location, Grade, Organization } from '.';
import { v4 as uuidv4 } from 'uuid';
import { InferType, object, string } from 'yup';
import { ContactForm } from '../forms';

const ContactPhoneSchema = object().shape({
	system: string()
		.required()
		.min(2, 'Phone System must be at least two characters'),

	number: string()
		.required()
		.min(7, 'Phone number must be at least 7 characters'),
});

interface IContactPhone extends InferType<typeof ContactPhoneSchema> { }

const ContactEmailSchema = object().shape({
	system: string()
		.required()
		.min(2, 'Email System must be at least two characters'),

	address: string()
		.required()
		.email('Address must be an email address'),
});

interface IContactEmail extends InferType<typeof ContactEmailSchema> { }

interface IContactSocial {
	service: string;
	username: string;
}

interface IContactMetadata {
	phones: IContactPhone[];
	emails: IContactEmail[];
	social: IContactSocial[];
	tags: string[];
}

interface IContact {
	id?: string;
	last_name: string;
	first_name: string;
	grade: Grade;
	location: Location;
	org: Organization;
	title: string;
	phones?: IContactPhone[];
	emails?: IContactEmail[];
	socials?: IContactSocial[];
	tags?: string[];
}

interface IContactView {
	id: string;
	last_name: string;
	first_name: string;
	grade_id: string;
	grade: string;
	location_id: string;
	city: string;
	state: string;
	org_id: string;
	org: string;
	title: string;
	metadata: IContactMetadata,
}

class Contact {
	// unique identifier
	id: string;

	// contact bio details
	last_name: string;
	first_name: string;
	grade: Grade;
	location: Location;
	organization: Organization;
	title: string;
	tags: string[];

	// contact methods
	phones: IContactPhone[];
	emails: IContactEmail[];
	socials: IContactSocial[];

	constructor({
		id = uuidv4(),
		last_name,
		first_name,
		grade,
		location,
		org,
		title,
		phones = [],
		emails = [],
		socials = [],
		tags = []
	}: IContact) {
		this.id = id;
		this.last_name = last_name;
		this.first_name = first_name;
		this.grade = grade;
		this.location = location;
		this.organization = org;
		this.title = title;
		this.emails = emails;
		this.phones = phones,
			this.socials = socials;
		this.tags = tags;
	}

	private static fromInterface(c: IContactView): Contact {
		return new Contact({
			id: c.id,
			last_name: c.last_name,
			first_name: c.first_name,
			title: c.title,
			grade: new Grade(c.grade, c.grade_id),
			location: new Location(c.city, c.state, c.location_id),
			org: new Organization(c.org, c.org_id),
			phones: c.metadata.phones,
			emails: c.metadata.emails,
			socials: c.metadata.social,
			tags: c.metadata.tags,
		})
	}

	static async fetch(client: SqlClient, id: string): Promise<Contact> {
		const contact = await client.query("SELECT * FROM contact_details WHERE id=$1 LIMIT 1", [id]);
		if (contact.rows.length > 0) {
			return this.fromInterface(contact.rows[0]);
		} else {
			throw new Error(`Contact not found, id = ${id}`);
		}
	}

	static async fetchMany(client: SqlClient, ids: string[]): Promise<Contact[]> {
		const contacts = await client.query("SELECT * FROM contact_details WHERE id = ANY($1::uuid[])", [ids]);
		return contacts.rows.map(r => this.fromInterface(r));
	}

	static async fetchAll(client: SqlClient) {
		const contacts = await client.query('SELECT * FROM contact_details');
		return contacts.rows.map(Contact.fromInterface);
	}

	toJSON() {
		return {
			id: this.id,
			last_name: this.last_name,
			first_name: this.first_name,
			grade: this.grade.toJSON(),
			location: this.location.toJSON(),
			organization: this.organization.toJSON(),
			title: this.title,
			phones: this.phones,
			emails: this.emails,
			socials: this.socials,
			tags: this.tags,
		};
	}

	asForm(): ContactForm {
		return {
			id: this.id,
			lastName: this.last_name,
			firstName: this.first_name,
			title: this.title,
			grade: this.grade.toJSON(),
			location: this.location.toJSON(),
			org: this.organization.toJSON(),
			phones: this.phones,
			emails: this.emails
		}
	}

	async save(client: SqlClient) {
		// update contact record
		await client.query(`
			INSERT INTO
				contacts (id, last_name, first_name, grade, location, org, title, metadata)
			VALUES
				($1, $2, $3, $4, $5, $6, $7, $8)
			ON CONFLICT(id) DO UPDATE
			SET
				last_name = EXCLUDED.last_name,
				first_name = EXCLUDED.first_name,
				grade = EXCLUDED.grade,
				location = EXCLUDED.location,
				org = EXCLUDED.org,
				title = EXCLUDED.title,
				metadata = EXCLUDED.metadata
			`,
			[
				this.id,
				this.last_name,
				this.first_name,
				this.grade.id,
				this.location.id,
				this.organization.id,
				this.title,
				{ emails: this.emails, phones: this.phones, socials: this.socials, tags: this.tags }
			]
		)
	}
};

export default Contact;
export { ContactEmailSchema, ContactPhoneSchema };
export type { IContact, IContactEmail, IContactPhone, IContactSocial };
