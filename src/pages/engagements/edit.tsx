import EngagementForm, { EngagementFormSchema, NewEngagementForm } from "@/lib/forms/engagement";
import { useContacts, useMe, useTopics, useUsers } from "@/lib/utils/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Box, Button, Checkbox, Divider, Grid, IconButton, Paper, Rating, Slider, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler, Controller, SubmitErrorHandler } from 'react-hook-form';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Contact, User } from "@/lib/models";
import FormHidden from "@/lib/components/form-hidden";
import FormTextField from "@/lib/components/form-textfield";
import FormDatepicker from "@/lib/components/form-datepicker";
import FormAutocomplete from "@/lib/components/form-autocomplete";
import AddIcon from "@mui/icons-material/Add";
import FormCheckbox from "@/lib/components/form-checkbox";
import { useSession } from "next-auth/react";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getDatabaseConn } from "@/lib/db";
import FormSentiment from '@/lib/components/form-sentiment';
import EditSaveBackdrop from '@/lib/components/edit-save-backdrop';
import { Topic } from "@/lib/models/topic";
import Engagement, { EngagementMethod } from '@/lib/models/engagement';

type Props = {
    methods: EngagementMethod[];
    groups: { id: string; name: string; level: string }[];
    createdBy: string;
    createdById: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session: Session | null = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false
            }
        };
    }

    const db = await getDatabaseConn();
    const user: User = await User.fetchUserByUsername(db, session.user.username);
    const methods: EngagementMethod[] = await Engagement.Methods(db);
    db.release();

    return {
        props: {
            methods: methods,
            groups: user.groups,
            createdBy: session.user.username,
            createdById: session.user.id,
        }
    }
}

function EmptyView() {
    return (
        <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color='#aaaaaa'><i>No Notes Added</i></Typography>
            </Box>
        </Grid>
    );
}

export default function EditEngagement({ methods, groups, createdBy, createdById }: Props) {
    const { contacts, loading, error } = useContacts();
    const [backdrop, setBackdrop] = useState<string | null>(null);
    const [sentimentValue, setSentimentValue] = useState<number>(50);

    const { users, loading: loadingUsers } = useUsers();
    const { topics } = useTopics();

    const { handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<EngagementForm>({
        mode: 'onSubmit',
        defaultValues: NewEngagementForm(methods[0]),
        resolver: yupResolver(EngagementFormSchema)
    });

    const notes = useFieldArray({ name: 'notes', control });

    const onSubmit: SubmitHandler<EngagementForm> = async data => {
        setBackdrop('save');
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
            setBackdrop('success');
        } else {
            setBackdrop('error');
            console.error(resp.statusText);
        }
    };

    const onError: SubmitErrorHandler<EngagementForm> = e => console.error(e);

    const resetForm = () => {
        setBackdrop(null);
        reset();
    };

    const sentimentRatingLabels: { [index: string]: string } = {
        0: 'Terrible',
        1: 'Bad',
        3: 'Neutral',
        4: 'Good',
        5: 'Great'
    };

    const sentimentColors: { [index: number]: string } = {
        0: '#ff0000',
        10: '#ff0000',
        20: '#ff0000',
        30: '#ff0000',
        40: '#ff0000',
        50: '#ff0000',
        60: '#00ff00',
        70: '#00ff00',
        80: '#00ff00',
        90: '#00ff00',
        100: '#00ff00',
    };

    return (
        <Box maxWidth='lg' sx={{ width: '100%', height: '100%', mx: 'auto' }} pt={2}>
            <EditSaveBackdrop
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
                            <FormTextField
                                label="Title"
                                field='title'
                                control={control}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormDatepicker control={control} field='date' label="Date" />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <FormAutocomplete
                                label="Method"
                                options={methods}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                getOptionLabel={(m: EngagementMethod) => m.name}
                                onChange={(v: EngagementMethod) => setValue('method', v)}
                                error={errors['method']}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormAutocomplete
                                label="Participants"
                                multiple
                                options={contacts.filter((c: Contact) => c.user_id === undefined || c.user_id !== createdById)}
                                isOptionEqualToValue={(o: Contact, v: Contact) => o.id === v.id}
                                getOptionLabel={(c: Contact) => `${c.first_name} ${c.last_name} (${c.organization.name})`}
                                onChange={values => setValue('contacts', values.map((v: Contact) => v.id))}
                                error={errors['contacts']}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormAutocomplete
                                label="Topics"
                                multiple
                                creatable
                                options={topics ?? []}
                                isOptionEqualToValue={(o: Topic, v: Topic) => o.id === v.id}
                                getOptionLabel={(option: Topic) => option.topic}
                                onChange={values => setValue('topics', values.map((t: Topic) => t.id))}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                            <Box sx={{ display: 'flex', mt: 1 }}>
                                <Typography variant='h6' sx={{ flexGrow: 1 }}>Notes</Typography>
                                <IconButton onClick={() => notes.append({ text: '', public: false })}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </Grid>

                        {notes.fields.length == 0 && <EmptyView />}
                        {notes.fields.map((note, index) => (
                            <Grid item xs={12} key={`note-${index}`}>
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <FormCheckbox control={control} field={`notes.${index}.public`} label="Public" />
                                    <FormAutocomplete
                                        multiple
                                        options={groups}
                                        disabled={watch(`notes.${index}.public`)}
                                        size="small"
                                        label="Groups"
                                        getOptionLabel={g => g.name}
                                        isOptionEqualToValue={(o, v) => o.id === v.id}
                                        onChange={v => setValue(`notes.${index}.groups`, v.map((g: any) => g.id))}
                                    />
                                </Box>
                                <FormTextField field={`notes.${index}.text`} label="Note" control={control} rows={5} />
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button type='submit' variant="contained" fullWidth>Save</Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}