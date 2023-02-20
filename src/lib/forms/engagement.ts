import { object, string, InferType, array, Schema, date } from 'yup';

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
        .of(string().uuid()),

    notes: string()
        .optional()
});

type EngagementForm = InferType<typeof EngagementFormSchema>;

function NewEngagementForm(ty: string): EngagementForm {
    return {
        topic: '',
        date: new Date(),
        ty: ty,
        contacts: [],
        notes: '',
    }
}

export default EngagementForm;
export { EngagementFormSchema, NewEngagementForm };