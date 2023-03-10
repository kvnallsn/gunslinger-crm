// React
import React, { useState } from "react"
import { useRouter } from 'next/router';
import { intlFormat } from "date-fns";

// Local
import { Contact } from "@/lib/models"
import { useContacts } from "@/lib/utils/hooks";

// UI
import { Avatar, Box, Card, CardContent, CardHeader, Divider, Drawer, Grid, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridCallbackDetails, GridColumns, GridRowParams, GridToolbar, MuiEvent } from "@mui/x-data-grid";

// Icons
import AddCommentIcon from '@mui/icons-material/AddComment';
import EditIcon from '@mui/icons-material/Edit';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import WorkIcon from '@mui/icons-material/Work';
import PlaceIcon from '@mui/icons-material/Place';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';

// Brand Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { grey } from '@mui/material/colors';

interface ContactCardProps {
    contact: Contact;
}

function NoContactsOverlay() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 1, width: '100%', height: '100%' }}>
            <ContactMailIcon sx={{ fontSize: 20 }} />
            <Typography variant="h6">No Contacts Found</Typography>
        </Box>
    )


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
        timeZone: 'UTC'
    }, {
        locale: 'en-US'
    })
}

function CardSubHeader(props: ContactCardProps) {
    const { contact } = props;

    return (
        <Box sx={{ display: 'flex', columnGap: 2 }}>
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

function ContactCard(props: ContactCardProps) {
    const { contact } = props;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2, height: '600px', overflowY: 'hidden' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, p: 1, bgcolor: grey[200], borderBottom: `1px solid ${grey[400]}` }}>
                <Typography variant='h5'>{`${contact.first_name} ${contact.last_name}`}</Typography>
                <CardSubHeader contact={contact} />
            </Box>
            <Grid container spacing={2} sx={{ flexGrow: 1, px: 1, overflowY: { xs: 'scroll', md: 'visible' } }}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6">Contact Information</Typography>
                    <Divider />
                    <List dense sx={{ height: '65%', overflowY: { xs: 'visible', md: 'scroll' } }}>
                        <ListSubheader>Phone Numbers</ListSubheader>
                        {contact.phones && contact.phones.map((c, index) => (
                            <>
                                <ListItem key={`phone-${c.number}`}>
                                    <ListItemAvatar>
                                        <Avatar><PhoneIcon /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText secondary={c.system}>{c.number}</ListItemText>
                                </ListItem>
                                <Divider variant='inset' key={`phone-divider-${index}`} />
                            </>
                        ))}
                        {!contact.phones &&
                            <ListItem key='no-phones'>
                                <ListItemAvatar>
                                    <Avatar><InfoIcon /></Avatar>
                                </ListItemAvatar>
                                <ListItemText>No Phones Found</ListItemText>
                            </ListItem>
                        }

                        <ListSubheader>Email Addresses</ListSubheader>
                        {contact.emails && contact.emails.map((e, index) => (
                            <>
                                <ListItem key={`email-${e.address}`}>
                                    <ListItemAvatar>
                                        <Avatar><EmailIcon /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText secondary={e.system}>{e.address}</ListItemText>
                                </ListItem>
                                <Divider variant='inset' key={`email-divider-${index}`} />
                            </>
                        ))}
                        {!contact.emails &&
                            <ListItem key='no-emails'>
                                <ListItemAvatar>
                                    <Avatar><InfoIcon /></Avatar>
                                </ListItemAvatar>
                                <ListItemText>No Emails Found</ListItemText>
                            </ListItem>
                        }

                        <ListSubheader>Social Media</ListSubheader>
                        <ListItem key='facebook'>
                            <ListItemAvatar>
                                <Avatar><FacebookIcon /></Avatar>
                            </ListItemAvatar>
                            <ListItemText>None</ListItemText>
                        </ListItem>
                        <Divider variant='inset' />
                        <ListItem key='linkedin'>
                            <ListItemAvatar>
                                <Avatar><LinkedInIcon /></Avatar>
                            </ListItemAvatar>
                            <ListItemText>None</ListItemText>
                        </ListItem>
                        <Divider variant='inset' />
                        <ListItem key='twitter'>
                            <ListItemAvatar>
                                <Avatar><FacebookIcon /></Avatar>
                            </ListItemAvatar>
                            <ListItemText>None</ListItemText>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6">Recent Engagements</Typography>
                    <Divider />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6">Notes</Typography>
                    <Divider />
                </Grid>
            </Grid>
        </Box>
    )
}

export default function Contacts() {
    const router = useRouter();
    const { contacts, loading, error } = useContacts();
    const [contact, setContact] = useState<Contact | undefined>(undefined);

    const toggleDrawer = (contact: Contact | undefined) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setContact(contact);
    };

    const handleClick = (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => {
        // open the drawer
        toggleDrawer(params.row)(event);
    }

    const columns: GridColumns<Contact> = [
        { field: 'last_name', headerName: 'Last Name', flex: 1 },
        { field: 'first_name', headerName: 'First Name ', flex: 1 },
        { field: 'grade', headerName: 'Grade / Rank', flex: 1, valueGetter: params => params.row.grade.name },
        { field: 'org', headerName: 'Organization', flex: 1, valueGetter: params => params.row.org.name },
        { field: 'location', headerName: 'Location', flex: 1, valueGetter: params => `${params.row.location.city}, ${params.row.location.state}` },
        { field: 'last_contact', headerName: 'Last Engagement', flex: 1, type: 'dateTime', valueGetter: params => params.row.last_contact ? new Date(params.row.last_contact) : '' },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    key={`add-engagement-${params.row.id}`}
                    icon={<AddCommentIcon />}
                    label="Add Engagement"
                />,
                <GridActionsCellItem
                    key={`edit-${params.row.id}`}
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => router.push({ pathname: '/contacts/edit', query: { id: params.row.id } })}
                />
            ]
        },
    ];

    return (
        <Box sx={{ height: '100%' }}>
            <DataGrid
                rows={contacts}
                columns={columns}
                loading={loading}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'last_contact', sort: 'desc' }]
                    }
                }}
                components={{
                    Toolbar: GridToolbar,
                    NoRowsOverlay: NoContactsOverlay,
                }}
                componentsProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    }
                }}
                onRowDoubleClick={handleClick}
            />
            <Drawer
                anchor='bottom'
                open={contact !== undefined}
                onClose={toggleDrawer(undefined)}
            >
                <Box sx={{ height: '100%' }}>
                    {contact ? <ContactCard contact={contact} /> : <></>}
                </Box>
            </Drawer>
        </Box>
    )
}