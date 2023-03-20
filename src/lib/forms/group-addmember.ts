import { object, string, InferType } from 'yup';

const AddGroupMemberFormSchema = object().shape({
    userId: string()
        .required()
        .uuid(),

    username: string()
        .required(),

    level: string()
        .required()
});

type AddGroupMemberForm = InferType<typeof AddGroupMemberFormSchema>;

function NewAddGroupMemberForm(): AddGroupMemberForm {
    return {
        userId: '',
        username: '',
        level: ''
    }
}

export default AddGroupMemberForm;
export { AddGroupMemberFormSchema, NewAddGroupMemberForm };