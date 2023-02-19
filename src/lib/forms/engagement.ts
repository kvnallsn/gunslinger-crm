import { Engagement } from '@next/font/google';
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
});

type EngagementForm = InferType<typeof EngagementFormSchema>;

function NewEngagementForm(ty: string): EngagementForm {
    return {
        id: '',
        topic: '',
        date: new Date(),
        ty: ty,
    }
}

export default EngagementForm;
export { EngagementFormSchema, NewEngagementForm };