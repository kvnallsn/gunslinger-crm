// React
import React, { ReactElement, useState } from "react"
import { useRouter } from 'next/router';
import { intlFormat } from "date-fns";

// Local
import { Contact, Engagement } from "@/lib/models"
import { useContactEngagements, useContactNotes, useContacts, useMe } from "@/lib/utils/hooks";

// UI
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Tab, Tabs, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// Icons
import WorkIcon from '@mui/icons-material/Work';
import PlaceIcon from '@mui/icons-material/Place';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import Groups2Icon from '@mui/icons-material/Groups2';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import InboxIcon from '@mui/icons-material/Inbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';

// Brand Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { grey } from '@mui/material/colors';
import { styled, ThemeProvider, useTheme } from '@mui/system';
import { ContactNote } from '../models/contact';
import EngagementIcon from './icon-engagement';
import { useSession } from 'next-auth/react';
import FormAutocomplete from './form-autocomplete';
import ContactNoteForm, { ContactNoteFormSchema, NewContactNoteForm } from '../forms/contact-note';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import FormTextField from './form-textfield';
import Group from '../models/groups';
import FlexColumnBox from './box-flexcolumn';
import color from '../utils/color';

interface ContactCardProps {
    contact: Contact;
}

interface AddNoteDialogProps {
    contact: Contact;
    open: boolean;
    onClose: (note?: ContactNote) => void;
}

function formatDate(date?: any): string {
    if (!date) {
        return "Never";
    }

    return intlFormat(Date.parse(date), {
        year: 'numeric',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Chicago',
        hour: '2-digit',
        minute: '2-digit'
    }, {
        locale: 'en-US'
    })
}

const NoteAccordion = styled((props: any) => (
    <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    }
}));

interface TabPanelProps {
    children: ReactElement;
    value: string;
    id: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, id } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== id}
            id={`tabpanel-${id}`}
            aria-labelledby={`tab-${id}`}
        >
            {value === id && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

function AddNoteDialog(props: AddNoteDialogProps) {
    const { open, onClose, contact } = props;
    const { data: session } = useSession();
    const { handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<ContactNoteForm>({
        mode: 'onSubmit',
        defaultValues: NewContactNoteForm(),
        resolver: yupResolver(ContactNoteFormSchema)
    });

    const { me, loading } = useMe(session?.user.username ?? '');

    const handleClose = () => {
        reset();
        onClose();
    };

    const badSession =
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Invalid Session</DialogTitle>
        </Dialog>;

    const onSubmit: SubmitHandler<ContactNoteForm> = async data => {
        const resp = await fetch(`/api/contact/notes?id=${contact.id}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (resp.ok) {
            reset();
            const note = await resp.json();
            onClose(note.data[0]);
        } else {
            console.error(resp);
        }
    };

    if (!session) {
        return badSession;
    }

    if (loading) {
        return <div>Loading...</div>
    } else if (!me) {
        return badSession;
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Add Contact Note</DialogTitle>
                <DialogContent dividers>
                    <FlexColumnBox sx={{ minWidth: { xs: '100%', sm: '300px', md: '500px' }, mt: 1 }}>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                            <FormAutocomplete
                                multiple
                                options={me.groups}
                                size="small"
                                label="Access Groups"
                                getOptionLabel={g => g.name}
                                isOptionEqualToValue={(o, v) => o.id === v.id}
                                onChange={v => setValue('groups', v.map((g: Group) => g.id))}
                            />
                        </Box>
                        <FormTextField field='text' label="Note" control={control} rows={10} />
                    </FlexColumnBox>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" type='submit'>Create</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

function CardSubHeader(props: ContactCardProps) {
    const { contact } = props;

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                <PersonIcon color="inherit" />
                <Typography>{contact.grade.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                <BusinessIcon color="inherit" />
                <Typography>{contact.org.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                <WorkIcon color="inherit" />
                <Typography>{contact.title}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                <PlaceIcon color="inherit" />
                <Typography>{`${contact.location.city}, ${contact.location.state}`}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                <CalendarMonthIcon color="inherit" />
                <Typography>{formatDate(contact.last_contact)}</Typography>
            </Box>
        </Box>
    );
}

interface ContactInfoListProps {
    contact: Contact;
}

function ContactInfoList(props: ContactInfoListProps) {
    const { contact } = props;

    return (
        <List dense>
            <ListSubheader disableSticky>Phone Numbers</ListSubheader>
            <Divider />
            {contact.phones && contact.phones.map((c, index) => (
                <React.Fragment key={`phone-${c.system}-${c.number}`}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar><PhoneIcon /></Avatar>
                        </ListItemAvatar>
                        <ListItemText secondary={c.system}>{c.number}</ListItemText>
                    </ListItem>
                    <Divider />
                </React.Fragment>
            ))}
            {!contact.phones &&
                <ListItem>
                    <ListItemAvatar>
                        <Avatar><InfoIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText>No Phones Found</ListItemText>
                </ListItem>
            }

            <ListSubheader disableSticky>Email Addresses</ListSubheader>
            <Divider />
            {contact.emails && contact.emails.map((e, index) => (
                <React.Fragment key={`email-${e.system}-${e.address}`}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar><EmailIcon /></Avatar>
                        </ListItemAvatar>
                        <ListItemText secondary={e.system}>{e.address}</ListItemText>
                    </ListItem>
                    <Divider />
                </React.Fragment>
            ))}
            {!contact.emails &&
                <ListItem>
                    <ListItemAvatar>
                        <Avatar><InfoIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText>No Emails Found</ListItemText>
                </ListItem>
            }

            {/**
            <ListSubheader disableSticky>Social Media</ListSubheader>
            <Divider />
            <ListItem>
                <ListItemAvatar>
                    <Avatar><FacebookIcon /></Avatar>
                </ListItemAvatar>
                <ListItemText>None</ListItemText>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemAvatar>
                    <Avatar><LinkedInIcon /></Avatar>
                </ListItemAvatar>
                <ListItemText>None</ListItemText>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemAvatar>
                    <Avatar><TwitterIcon /></Avatar>
                </ListItemAvatar>
                <ListItemText>None</ListItemText>
            </ListItem>
            */}
        </List>
    );
}

interface ContactEngagementProps {
    engagements: Engagement[];
}

function ContactEngagements(props: ContactEngagementProps) {
    const { engagements } = props;
    const router = useRouter();

    const renderEngagementRow = (props: ListChildComponentProps) => {
        const e = engagements[props.index];
        return (
            <React.Fragment key={`eng-${e.id}`}>
                <ListItem disableGutters disablePadding>
                    <ListItemButton onClick={() => router.push(`/engagements/${e.id}`)}>
                        <ListItemAvatar>
                            <Tooltip title={e.method.name}>
                                <Avatar><EngagementIcon engagement={e} /></Avatar>
                            </Tooltip>
                        </ListItemAvatar>
                        <ListItemText secondary={formatDate(e.date)}>
                            {e.title}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <Divider />
            </React.Fragment>
        );
    };

    return (
        <AutoSizer>
            {({ height, width }) => (
                <FixedSizeList
                    height={height}
                    width={width}
                    itemSize={40}
                    itemCount={engagements.length}
                    overscanCount={5}
                >
                    {renderEngagementRow}
                </FixedSizeList>
            )}
        </AutoSizer>
    );
}

interface ContactNotesProps {
    notes: ContactNote[];
    onCreate: () => void;
}

function ContactNotes(props: ContactNotesProps) {
    const { notes, onCreate } = props;

    return (
        notes.length > 0 ?
            <FlexColumnBox>
                <Button fullWidth sx={{ borderRadius: 0 }} onClick={onCreate}>Add Note</Button>
                {notes.map(note => (
                    <NoteAccordion key={`note-${note.id}`}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', pr: 1 }}>
                                <Typography>
                                    {formatDate(note.created_at)}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>
                                    {note.creator.username}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ border: `1px solid ${grey[500]}`, borderRadius: 1, px: 1, py: 2 }}>
                                <Typography>
                                    {note.note}
                                </Typography>
                            </Box>
                        </AccordionDetails>
                    </NoteAccordion>
                ))
                }
            </FlexColumnBox >
            :
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <InboxIcon fontSize='large' sx={{ color: grey[500], mb: 1 }} />
                <Typography variant='subtitle1' sx={{ color: grey[500], mb: 2 }}>No Notes Found!</Typography>
                <Button size="small" variant="contained" onClick={onCreate}>Create New Note</Button>
            </Box>
    )
}

export default function ContactCard(props: ContactCardProps) {
    const { contact } = props;
    const router = useRouter();
    const theme = useTheme();
    const [open, setOpen] = useState<boolean>(false);
    const [tab, setTab] = useState<string>('contact-info');

    const { engagements } = useContactEngagements(contact.id);
    const { notes, mutate: mutateNotes } = useContactNotes(contact.id);

    const handleAddNoteClose = async (note?: ContactNote) => {
        console.log(note);
        if (note) {
            console.log('mutating notes');
            mutateNotes([note, ...notes]);
        }

        setOpen(false);
    }

    return (
        <FlexColumnBox sx={{ minHeight: { md: '600px', lg: '800px' }, rowGap: 0, overflowY: 'hidden' }}>
            <FlexColumnBox sx={{ rowGap: 1, p: 1, bgcolor: color(200, 700), borderBottom: `1px solid ${color(400, 800)}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
                    <Typography variant='h5'>{`${contact.first_name} ${contact.last_name}`}</Typography>
                    <Button
                        size='small'
                        variant='outlined'
                        startIcon={<EditIcon />}
                        onClick={() => router.push(`/contacts/edit?id=${contact.id}`)}
                    >
                        Edit
                    </Button>
                </Box>
                <CardSubHeader contact={contact} />
            </FlexColumnBox>
            <Grid container spacing={0} sx={{ flexGrow: 1, overflowY: 'auto', display: { xs: 'none', md: 'flex' }, backgroundColor: theme.palette.background.paper }}>
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', borderRight: `1px solid ${color(300, 800)}` }}>
                    <Box sx={{ bgcolor: color(100, 700), borderBottom: `1px solid ${color(300, 800)}`, p: 1, textAlign: 'center' }}>
                        <Typography variant="h6">Contact Information</Typography>
                    </Box>
                    <ContactInfoList contact={contact} />
                </Grid>
                <Grid item xs={12} md={4} sx={{ borderRight: `1px solid ${color(300, 800)}` }}>
                    <FlexColumnBox sx={{ height: '100%' }}>
                        <Box sx={{ bgcolor: color(100, 700), borderBottom: `1px solid ${color(300, 800)}`, p: 1, textAlign: 'center' }}>
                            <Typography variant="h6">Engagements</Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <ContactEngagements engagements={engagements} />
                        </Box>
                    </FlexColumnBox>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ bgcolor: color(100, 700), borderBottom: `1px solid ${color(300, 800)}`, p: 1, textAlign: 'center' }}>
                        <Typography variant="h6">Notes</Typography>
                    </Box>
                    <ContactNotes notes={notes} onCreate={() => setOpen(true)} />
                </Grid>
            </Grid>
            <Box sx={{ flexGrow: 1, width: '100%', display: { xs: 'block', md: 'none' }, overflowY: 'scroll', backgroundColor: theme.palette.background.paper }}>
                <TabPanel value={tab} id='contact-info'>
                    <Box sx={{ minHeight: '400px', overflowY: 'auto' }}>
                        <ContactInfoList contact={contact} />
                    </Box>
                </TabPanel>
                <TabPanel value={tab} id='engagements'>
                    <Box sx={{ minHeight: '400px' }}>
                        <ContactEngagements engagements={engagements} />
                    </Box>
                </TabPanel>
                <TabPanel value={tab} id='notes'>
                    <Box sx={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                        <ContactNotes notes={notes} onCreate={() => setOpen(true)} />
                    </Box>
                </TabPanel>
            </Box>
            <Box sx={{ borderTop: 1, borderColor: 'divider', display: { xs: 'block', md: 'none' } }}>
                <Tabs variant='fullWidth' value={tab} onChange={(_event, value) => setTab(value)} aria-label='contact information'>
                    <Tab label="Details" value='contact-info' />
                    <Tab label="Engagements" value='engagements' />
                    <Tab label="Notes" value='notes' />
                </Tabs>
            </Box>
            <AddNoteDialog contact={contact} open={open} onClose={handleAddNoteClose} />
        </FlexColumnBox>
    )
}
