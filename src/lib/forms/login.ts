import { object, string, InferType, array, Schema } from 'yup';

const LoginFormSchema = object().shape({
    email: string()
        .required('An email address is required')
        .email('Must be a valid email address'),

    password: string()
        .required('A password is required')
});

type LoginForm = InferType<typeof LoginFormSchema>;

export default LoginForm;
export { LoginFormSchema };