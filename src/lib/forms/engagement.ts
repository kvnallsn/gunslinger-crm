import { object, string, InferType, array, Schema, date, boolean } from 'yup';

const EngagementFormSchema = object().shape({
    id: string()
        .optional()
        .uuid("must to a uuid"),

    topic: string()
        .required("A topic is required")
        .min(2, "Must be at least two characters"),

    date: date()
        .required("A date/time is required"),

    ty: string()
        .required('An engagment type is required'),

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

function NewEngagementForm(ty: string): EngagementForm {
    return {
        topic: '',
        date: new Date(),
        ty: ty,
        contacts: [],
        notes: [],
    }
}

export default EngagementForm;
export { EngagementFormSchema, NewEngagementForm };