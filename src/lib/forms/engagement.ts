import { title } from 'process';
import { object, string, InferType, array, Schema, date, boolean } from 'yup';
import { EngagementMethod } from '../models/engagement';

const EngagementFormSchema = object().shape({
    id: string()
        .optional()
        .uuid("must to a uuid"),

    topics: array()
        .of(string().required("A topic is required").min(2, "Must be at least two characters"))
        .min(1, "Must be at least one topic")
        .required(),

    date: date()
        .required("A date/time is required"),

    title: string()
        .required()
        .min(2),

    method: object({
        id: string().required().uuid(),
        name: string().required()
    })
        .required(),

    contacts: array()
        .required('at least on contact must be specified')
        .of(string().required().uuid()),

    notes: array()
        .of(object({
            text: string().required(),
            public: boolean().required().default(false),
            groups: array().of(string().uuid().required())
        }))
});

type EngagementForm = InferType<typeof EngagementFormSchema>;

function NewEngagementForm(method: EngagementMethod): EngagementForm {
    return {
        topics: [],
        date: new Date(),
        method: method,
        title: '',
        contacts: [],
        notes: [],
    }
}

export default EngagementForm;
export { EngagementFormSchema, NewEngagementForm };