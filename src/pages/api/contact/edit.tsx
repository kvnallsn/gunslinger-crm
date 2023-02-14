import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect, beginTransation, commitTranscation, rollbackTransaction, SqlClient } from '@/lib/db'
import { ContactForm, ContactFormSchema } from '@/lib/forms';
import { Contact, Grade, Location, Organization } from '@/lib/models';
import { BLANK_UUID } from '@/lib/utils';

type Error = {
    code: number;
    msg: string;
}

type Data = {
    name: string
}

function err(res: NextApiResponse<Error>, code: number, msg: string) {
    res.status(code).json({ code, msg })
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | Error>
) {
    if (req.method !== "POST") {
        err(res, 405, 'Method Not Allowed');
        return;
    }

    if (req.body === null || req.body === undefined) {
        err(res, 400, 'Bad Request');
        return;
    }

    let db: SqlClient | undefined = undefined;

    try {
        const form: ContactForm = await ContactFormSchema.validate(req.body);
        db = await dbConnect();
        await beginTransation(db);

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
            socials: [],
            tags: [],
        });

        console.log(contact);
        await contact.save(db);
        await commitTranscation(db);

        res.status(201).json({ name: 'John Doe' })
    } catch (error: any) {
        console.log(error);

        await rollbackTransaction(db);

        switch (true) {
            case error instanceof SyntaxError:
                err(res, 400, 'Bad Request');
                break;
            default:
                err(res, 500, 'Internal Server Error');
        }
    } finally {
        if (db !== undefined) {
            db.release()
        }
    }
}