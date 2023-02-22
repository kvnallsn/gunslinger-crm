import { object, string, InferType, array, Schema, boolean } from 'yup';

const CreateUserFormSchema = object().shape({
    email: string()
        .required('An email address is required')
        .email('Must be a valid email address'),

    username: string()
        .required('An username is required')
        .min(2)
        .max(30),

    password: string()
        .required('A password is required'),

    active: boolean()
        .default(true),

    admin: boolean()
        .default(false)
});

type CreateUserForm = InferType<typeof CreateUserFormSchema>;

function NewCreateUserForm(): CreateUserForm {
    return {
        email: '',
        username: '',
        password: '',
        active: true,
        admin: false
    }
}

export default CreateUserForm;
export { CreateUserFormSchema, NewCreateUserForm };