import { object, string, InferType, array, Schema } from 'yup';
import { ContactEmailSchema, ContactPhoneSchema } from '../models/contact';

const ContactFormSchema = object().shape({
    id: string()
        .uuid()
        .optional(),

    lastName: string()
        .required('Must enter a first name')
        .min(2, 'Last name must be at least 2 characters'),

    firstName: string()
        .required('Must enter a last name')
        .min(2, 'First name must be at least 2 characters'),

    grade: object({
        id: string()
            .required()
            .uuid('grade must be a uuid'),

        name: string()
            .required()
    }),

    org: object({
        id: string()
            .required("Organization ID is required")
            .uuid("Must be a UUID"),

        name: string()
            .required("Organization Name is required")
            .min(2, 'Organization number must be at least 2 characeters')
    }).required('organization is required'),

    title: string()
        .required(' Must enter a title / duty description')
        .min(2, 'Title must be at least two characters'),

    location: object({
        id: string()
            .required()
            .uuid('location must be a uuid'),

        city: string()
            .min(2, 'City must be at least two characters')
            .required(),

        state: string()
            .min(2, 'State must be at least two characters')
            .required(),
    }),

    phones: array()
        .of(ContactPhoneSchema),

    emails: array()
        .of(ContactEmailSchema),
})

type ContactForm = InferType<typeof ContactFormSchema>;

function NewContactForm(): ContactForm {
    return {
        lastName: '',
        firstName: '',
        grade: {
            id: '',
            name: '',
        },
        org: {
            id: '',
            name: '',
        },
        title: '',
        location: {
            id: '',
            city: '',
            state: '',
        },
        phones: [],
        emails: [],
    }
}

export default ContactForm;
export { ContactFormSchema, NewContactForm };