import { object, string, InferType } from 'yup';

const DelGroupMemberFormSchema = object().shape({
    userId: string()
        .required()
        .uuid(),
});

type DelGroupMemberForm = InferType<typeof DelGroupMemberFormSchema>;

function NewDelGroupMemberForm(): DelGroupMemberForm {
    return {
        userId: '',
    }
}

export default DelGroupMemberForm;
export { DelGroupMemberFormSchema, NewDelGroupMemberForm };