import { object, string, InferType, array, Schema } from 'yup';

const ContactNoteFormSchema = object().shape({
    text: string().required(),
    groups: array().of(string().uuid().required()).required()
});

type ContactNoteForm = InferType<typeof ContactNoteFormSchema>;

export function NewContactNoteForm() {
    return {
        text: '',
        groups: [],
    }
}

export default ContactNoteForm;
export { ContactNoteFormSchema };