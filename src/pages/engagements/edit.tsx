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
import LoadingBackdrop from "@/lib/components/loading-backdrop";

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
    const [backdrop, setBackdrop] = useState<string | null>(null);

    const { handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<EngagementForm>({
        mode: 'onSubmit',
        defaultValues: NewEngagementForm(engagements[0]),
        resolver: yupResolver(EngagementFormSchema)
    });

    const engagementTypes = watch('ty');

    const onSubmit: SubmitHandler<EngagementForm> = async data => {
        setBackdrop('save');

        const resp = await fetch(`/api/engagement/save`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (resp.ok) {
            setBackdrop('success');
        } else {
            setBackdrop('error');
            console.error(resp.statusText);
        }
    };

    const onError: SubmitErrorHandler<EngagementForm> = e => console.error(e);

    const resetForm = () => {
        reset();
        setBackdrop(null);
    };

    return (
        <Box maxWidth='lg' sx={{ width: '100%', height: '100%', mx: 'auto' }} pt={2}>
            <LoadingBackdrop
                status={backdrop}
                loadingText="Saving Engagement"
                onClose={() => setBackdrop(null)}
                onReset={resetForm}
                redirect="/engagements"
                redirectText="Go to Engagements"
            />

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
                                label="Engagement Type"
                                value={engagementTypes}
                                options={engagements}
                                isOptionEqualToValue={(o, v) => o === v}
                                onChange={v => setValue('ty', v)}
                                error={errors['ty']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormAutocomplete
                                label="Participants"
                                multiple
                                options={contacts || []}
                                isOptionEqualToValue={(o: Contact, v: Contact) => o.id === v.id}
                                getOptionLabel={(c: Contact) => `${c.first_name} ${c.last_name} (${c.grade.name})`}
                                onChange={values => setValue('contacts', values.map((v: Contact) => v.id))}
                                error={errors['contacts']}
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