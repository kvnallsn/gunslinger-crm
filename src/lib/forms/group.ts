import { object, string, InferType, array, Schema, boolean } from 'yup';

const CreateGroupFormSchema = object().shape({
    name: string()
        .required('An name is required')
        .min(2, "Must be at least two characters"),

    users: array()
        .of(object({
            id: string().uuid().required(),
            username: string().required(),
            level: string().required()
        }))
});

type CreateGroupForm = InferType<typeof CreateGroupFormSchema>;

function NewCreateGroupForm(): CreateGroupForm {
    return {
        name: '',
        users: [],
    }
}

export default CreateGroupForm;
export { CreateGroupFormSchema, NewCreateGroupForm };