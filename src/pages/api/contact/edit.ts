import type { NextApiRequest, NextApiResponse } from 'next'
import { SqlClient, runDatabaseTx } from '@/lib/db'
import { ContactForm, ContactFormSchema } from '@/lib/forms';
import { Contact, Grade, Location, Organization } from '@/lib/models';
import { BLANK_UUID } from '@/lib/utils';
import { err, checkPost, AppError } from '@/lib/utils/api';

type Data = {
    name: string
}

async function handleForm(db: SqlClient, form: ContactForm): Promise<Contact> {
    let grade: Grade;
    let org: Organization;
    let loc: Location;

    // lookup grade/org/location
    grade = await Grade.fetch(db, form.grade.id);

    if (form.org.id === BLANK_UUID) {
        // create a new organization
        console.debug(`creating new organization: ${form.org.name}`)
        org = new Organization(form.org.name);
        await org.save(db);
    } else {
        org = await Organization.fetch(db, form.org.id);
    }

    if (form.location.id === BLANK_UUID) {
        // create a new location
        console.debug(`creating new location: ${form.location.city}, ${form.location.state}`)
        loc = new Location(form.location.city, form.location.state);
        await loc.save(db);
    } else {
        loc = await Location.fetch(db, form.location.id);
    }

    const contact = new Contact({
        id: form.id,
        last_name: form.lastName,
        first_name: form.firstName,
        grade: grade,
        org: org,
        location: loc,
        title: form.title,
        phones: form.phones,
        emails: form.emails,
    });

    await contact.save(db);
    return contact;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | AppError>
) {
    const e = checkPost(req);
    if (e) {
        return err(res, e.code, e.msg);
    }

    try {
        const form: ContactForm = await ContactFormSchema.validate(req.body);
        const contact = await runDatabaseTx(async tx => await handleForm(tx, form));

        res.status(201).json({ name: `${contact.first_name} ${contact.last_name}` });
    } catch (error: any) {
        console.error(error);
        switch (true) {
            case error instanceof SyntaxError:
                err(res, 400, 'Bad Request');
                break;
            default:
                err(res, 500, 'Internal Server Error');
        }
    }
}