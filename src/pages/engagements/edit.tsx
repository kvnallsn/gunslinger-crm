import EngagementForm, { EngagementFormSchema, NewEngagementForm } from "@/lib/forms/engagement";
import { useContacts } from "@/lib/utils/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Box, Button, Checkbox, Grid, Paper, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler, Controller, SubmitErrorHandler } from 'react-hook-form';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Contact } from "@/lib/models";

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
                    <Controller
                        name="id"
                        control={control}
                        render={({ field: { value } }) => (
                            <input type="hidden" value={value} />
                        )}
                    />
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="topic"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        fullWidth label="Topic"
                                        error={Boolean(error)}
                                        helperText={error && error.message}
                                        {...field}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        {...field}
                                        label="Date"
                                        renderInput={params => <TextField fullWidth {...params} />}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Controller
                                name="ty"
                                control={control}
                                render={({ field: { value }, fieldState: { error } }) => (
                                    <Autocomplete
                                        onChange={(_e, v) => v ? setValue('ty', v) : resetField('ty')}
                                        value={value}
                                        disablePortal
                                        options={engagements}
                                        getOptionLabel={e => e}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label="Engagement Type"
                                                error={Boolean(error)}
                                                helperText={error && error.message}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                onChange={(_event: any, newValue: Contact[] | null) => {
                                    if (newValue) {
                                        setValue('contacts', newValue.map(c => c.id));
                                    } else {
                                        resetField('contacts');
                                    }
                                }}
                                multiple
                                disablePortal
                                disableCloseOnSelect
                                options={contacts ? contacts : []}
                                getOptionLabel={c => `${c.first_name} ${c.last_name} (${c.grade.name})`}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {`${option.first_name} ${option.last_name} (${option.grade.name})`}
                                    </li>
                                )}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Add Contacts"
                                        error={Boolean(error)}
                                        helperText={error && error.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={7}
                                        label="Notes"
                                        error={Boolean(error)}
                                        helperText={error && error.message}
                                        {...field}
                                    />
                                )}
                            />
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