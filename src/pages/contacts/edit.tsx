import { useState } from "react";
import Link from 'next/link';
import { SqlClient, getDatabaseConn } from "@/lib/db";
import { Grade, Organization, Location, Contact, PhoneSystem, EmailSystem } from "@/lib/models";
import { ContactForm, ContactFormSchema, NewContactForm } from "@/lib/forms";
import { BLANK_UUID } from "@/lib/utils";
import { useForm, useFieldArray, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Container, Divider, Grid, IconButton, InputAdornment, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material";

import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import EmailIcon from '@mui/icons-material/Email';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetServerSidePropsContext } from "next";


type Props = {
    grades: Grade[];
    orgs: Organization[];
    locations: Location[];
    systems: PhoneSystem[];
    networks: EmailSystem[];
    form: ContactForm
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
    let db: SqlClient | undefined;
    let grades: Grade[] = [];
    let orgs: Organization[] = [];
    let locations: Location[] = [];
    let systems: PhoneSystem[] = [];
    let networks: EmailSystem[] = [];
    let form: ContactForm = NewContactForm();

    try {
        db = await getDatabaseConn();

        [grades, orgs, locations, systems, networks] = await Promise.all([
            Grade.fetchAll(db),
            Organization.fetchAll(db),
            Location.fetchAll(db),
            PhoneSystem.fetchAll(db),
            EmailSystem.fetchAll(db),
        ])

        orgs = [new Organization('', BLANK_UUID), ...orgs];
        locations = [new Location('', '', BLANK_UUID), ...locations];

        if ('id' in query) {
            // attempt to fetch existing contact
            const c = await Contact.fetch(db, String(query['id']));
            form = c.asForm()
        } else {
            // creating a new contact
            form.grade = grades[0].toJSON();
            form.org = orgs[0].toJSON();
            form.location = locations[0].toJSON();
        }
    } catch (error: any) {
        console.error(error);
    } finally {
        if (db) {
            db.release();
        }
    }

    return {
        props: {
            grades: grades.map(g => g.toJSON()),
            orgs: orgs.map(o => o.toJSON()),
            locations: locations.map(l => l.toJSON()),
            systems: systems.map(s => s.toJSON()),
            networks: networks.map(n => n.toJSON()),
            form: form
        }
    }
}

export default function EditContact({ grades, orgs, locations, systems, networks, form }: Props) {
    // component local state
    const [phoneMenuAnchor, setPhoneMenuAnchor] = useState<HTMLElement | null>(null);
    const [emailMenuAnchor, setEmailMenuAnchor] = useState<HTMLElement | null>(null);
    const phoneMenuOpen = Boolean(phoneMenuAnchor);
    const emailMenuOpen = Boolean(emailMenuAnchor);
    const [backdrop, setBackdrop] = useState<boolean>(false);
    const [backdropMode, setBackdropMode] = useState<string>('save');

    // form delcaration
    const { handleSubmit, control, watch, setValue, reset, resetField, formState: { errors } } = useForm<ContactForm>({
        mode: 'onSubmit',
        defaultValues: form,
        resolver: yupResolver(ContactFormSchema)
    });
    const phones = useFieldArray({ name: "phones", control })
    const emails = useFieldArray({ name: "emails", control })
    const onSubmit: SubmitHandler<ContactForm> = data => {
        setBackdrop(true);
        setBackdropMode('save');
        fetch(`/api/contact/edit`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
            .then(r => r.json())
            .then(r => {
                setBackdropMode('success');
            })
            .catch(e => {
                console.error(e);
                setBackdropMode('error');
            });
    };

    const onError = (e: any) => console.error(e);

    // form watched variables
    const location = watch('location');
    const org = watch('org');

    const openPhoneMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setPhoneMenuAnchor(event.currentTarget);
    };

    const closePhoneMenu = (system: string) => {
        phones.append({ system: system, number: "" });
        setPhoneMenuAnchor(null);
    };

    const openEmailMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setEmailMenuAnchor(event.currentTarget);
    };

    const closeEmailMenu = (system: string) => {
        emails.append({ system: system, address: "" });
        setEmailMenuAnchor(null);
    };

    const resetForm = () => {
        reset();
        setBackdrop(false);
    }

    return (
        <Box maxWidth='lg' sx={{ width: '100%', height: '100%', mx: 'auto' }} pt={2}>
            <Backdrop
                sx={{ background: '#ffffffaa', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdrop}
            >
                <Paper elevation={4} sx={{ margin: 2, padding: 2 }}>
                    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '1em' }}>
                        {backdropMode === 'save' &&
                            <>
                                <CircularProgress color='inherit' />
                                <Typography variant="subtitle1" sx={{ mt: 1 }}>Saving Contact</Typography>
                            </>
                        }

                        {backdropMode === 'success' &&
                            <>
                                <CheckCircleIcon color="success" fontSize="large" />
                                <Typography variant="subtitle1">Contact Saved</Typography>
                                <Box sx={{ display: 'flex', columnGap: '1em' }}>
                                    <Button variant="outlined" onClick={() => resetForm()}>Create Another</Button>
                                    <Link href="/contacts">
                                        <Button variant="contained">Go to Contacts</Button>
                                    </Link>
                                </Box>
                            </>
                        }

                        {backdropMode === 'error' &&
                            <>
                                <ErrorIcon color="error" fontSize="large" />
                                <Typography variant="subtitle1">Error!</Typography>
                                <Button variant="outlined" color="error" onClick={() => setBackdrop(false)}>Close</Button>
                            </>
                        }
                    </Container>
                </Paper>
            </Backdrop>
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
                        <Grid item xs={12} sm={2}>
                            <Controller
                                name="grade"
                                control={control}
                                render={({ field: { value }, fieldState: { error } }) => (
                                    <Autocomplete
                                        onChange={(_e, v) => v ? setValue('grade', v) : resetField('grade')}
                                        value={value}
                                        disablePortal
                                        options={grades}
                                        getOptionLabel={grade => grade.name}
                                        isOptionEqualToValue={(o, v) => o.id === v.id}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label="Grade"
                                                error={Boolean(error)}
                                                helperText={error && error.message}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Controller
                                name="firstName"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        fullWidth label="First Name"
                                        error={Boolean(error)}
                                        helperText={error && error.message}
                                        {...field}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Controller
                                name="lastName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        error={Boolean(errors.lastName)}
                                        helperText={errors.lastName && errors.lastName.message}
                                        {...field}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                onChange={(_e, v) => v ? setValue('location', v) : resetField('location')}
                                value={location}
                                disablePortal
                                options={locations}
                                getOptionLabel={l => l.id === BLANK_UUID ? 'New Location' : `${l.city}, ${l.state}`}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Location"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="location.city"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="City"
                                        disabled={location.id !== BLANK_UUID}
                                        error={Boolean(error)}
                                        helperText={error && error.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="location.state"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="State"
                                        disabled={location.id !== BLANK_UUID}
                                        error={Boolean(error)}
                                        helperText={error && error.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                onChange={(_e, v) => v ? setValue('org', v) : resetField('org')}
                                value={org}
                                disablePortal
                                options={orgs}
                                getOptionLabel={o => o.id === BLANK_UUID ? 'New Organization' : o.name}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                renderInput={params => <TextField {...params} label="Organization" />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Controller
                                name="org.name"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Organization Name"
                                        disabled={org.id !== BLANK_UUID}
                                        error={Boolean(error)}
                                        helperText={error && error.message}
                                    />
                                )}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Duty Title"
                                        error={Boolean(errors.title)}
                                        helperText={errors.title && errors.title.message}
                                        {...field}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <Divider sx={{ marginY: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">Phone Numbers</Typography>
                                <Button onClick={openPhoneMenu} size="small" variant="outlined" startIcon={<AddIcCallIcon />}>
                                    Add
                                </Button>
                                <Menu id="phone-menu" anchorEl={phoneMenuAnchor} open={phoneMenuOpen}>
                                    {systems.map(s => <MenuItem key={s.name} onClick={() => closePhoneMenu(s.name)}>{s.name}</MenuItem>)}
                                </Menu>
                            </Box>
                        </Grid>

                        {phones.fields.map((phone, index) => (
                            <Grid item xs={12} key={`phone-${index}`}>
                                <Controller
                                    name={`phones.${index}.number`}
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Phone Number"
                                            error={Boolean(error)}
                                            helperText={error && error.message}
                                            InputProps={{
                                                startAdornment: <InputAdornment position='start' sx={{ width: '100px' }}>{phone.system}</InputAdornment>,
                                                endAdornment: <InputAdornment position='end'>
                                                    <IconButton aria-label="delete phone" onClick={() => phones.remove(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        ))}

                        <Grid item xs={12} sm={12}>
                            <Divider sx={{ marginY: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">Email Addresses</Typography>
                                <Button onClick={openEmailMenu} size="small" variant="outlined" startIcon={<EmailIcon />}>
                                    Add
                                </Button>
                                <Menu id="email-menu" anchorEl={emailMenuAnchor} open={emailMenuOpen}>
                                    {networks.map(s => <MenuItem key={s.name} onClick={() => closeEmailMenu(s.name)}>{s.name}</MenuItem>)}
                                </Menu>
                            </Box>
                        </Grid>

                        {emails.fields.map((email, index) => (
                            <Grid item xs={12} key={`email-${index}`}>
                                <Controller
                                    name={`emails.${index}.address`}
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Email Address"
                                            error={Boolean(error)}
                                            helperText={error && error.message}
                                            InputProps={{
                                                startAdornment: <InputAdornment position='start' sx={{ width: '100px' }}>{email.system}</InputAdornment>,
                                                endAdornment: <InputAdornment position='end'>
                                                    <IconButton aria-label="delete email" onClick={() => emails.remove(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button type='submit' variant="contained" fullWidth>Save</Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    )
}