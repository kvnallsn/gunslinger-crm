import EngagementForm, { EngagementFormSchema, NewEngagementForm } from "@/lib/forms/engagement";
import { useContacts } from "@/lib/utils/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Box, Button, Checkbox, Grid, Paper, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler, Controller, SubmitErrorHandler } from 'react-hook-form';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Contact } from "@/lib/models";
import FormHidden from "@/lib/components/form-hidden";
import FormTextField from "@/lib/components/form-textfield";
import FormDatepicker from "@/lib/components/form-datepicker";
import FormAutocomplete from "@/lib/components/form-autocomplete";

type Props = {
    engagements: string[];
}

export function getServerSideProps() {
    return {
        props: {
            engagements: ['Phone', 'Email', 'Text / SMS', 'Meeting', 'Conference'],
        }
    }
}

export default function EditEngagement({ engagements }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const { contacts, loading, error } = useContacts();

    const { handleSubmit, control, watch, setValue, reset, resetField, formState: { errors } } = useForm<EngagementForm>({
        mode: 'onSubmit',
        defaultValues: NewEngagementForm(engagements[0]),
        resolver: yupResolver(EngagementFormSchema)
    });

    const onSubmit: SubmitHandler<EngagementForm> = async data => {
        console.log(data);

        const resp = await fetch(`/api/engagement/save`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (resp.ok) {
            console.log('success!');
        } else {
            console.error(resp.statusText);
        }
    };

    const onError: SubmitErrorHandler<EngagementForm> = e => console.error(e);

    return (
        <Box maxWidth='lg' sx={{ width: '100%', height: '100%', mx: 'auto' }} pt={2}>
            <Paper elevation={3} sx={{ margin: 2, padding: 2 }}>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <FormHidden field="id" control={control} />
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <FormTextField field="topic" control={control} label="Topic" />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormDatepicker control={control} field='date' label="Date" />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <FormAutocomplete
                                control={control}
                                field='ty'
                                label="Engagement Type"
                                options={engagements}
                                isOptionEqualToValue={(o, v) => o === v}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormAutocomplete
                                control={control}
                                field="contacts"
                                label="Participants"
                                multiple
                                options={contacts || []}
                                isOptionEqualToValue={(o: Contact, v: string) => o.id === v}
                                getOptionLabel={(c: Contact | string) => {
                                    let contact = (typeof c === 'string') ? contacts?.find(e => e.id === c) : c;
                                    return `${contact?.first_name} ${contact?.last_name} (${contact?.grade.name})`;
                                }}
                                onChanged={values => values.map((v: Contact) => v.id)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormTextField control={control} field='notes' label='Notes' rows={7} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type='submit' variant="contained" fullWidth>Save</Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}