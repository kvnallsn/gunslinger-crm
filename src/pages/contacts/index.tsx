// React
import React, { useState } from "react"
import { useRouter } from 'next/router';
import { intlFormat } from "date-fns";

// Local
import { Contact } from "@/lib/models"
import { useContactEngagements, useContacts } from "@/lib/utils/hooks";

// UI
import { Avatar, Box, Card, CardContent, CardHeader, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridCallbackDetails, GridColumns, GridRowParams, GridToolbar, MuiEvent } from "@mui/x-data-grid";
import { FixedSizeList, FixedSizeListProps, ListChildComponentProps } from 'react-window';

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
import Groups2Icon from '@mui/icons-material/Groups2';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

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
    const { engagements } = useContactEngagements(contact.id);
    const router = useRouter();

    const engagementIcon = (method: string) => {
        switch (method) {
            case 'Phone Call':
                return <PhoneIcon />;
            case 'Text / Direct Message':
                return <ChatOutlinedIcon />;
            case 'Email':
                return <EmailIcon />;
            case 'Meeting (In-Person)':
            case 'Meeting (Virtual)':
                return <BusinessCenterIcon />;
            case 'Conference (In-Person)':
            case 'Conference (Virtual)':
                return <Groups2Icon />;
            default:
                return <QuestionMarkIcon />;
        }
    }

    const renderEngagementRow = (props: ListChildComponentProps) => {
        const e = engagements[props.index];
        return (
            <>
                <ListItem key={`eng-${e.id}`} disableGutters disablePadding>
                    <ListItemButton onClick={() => router.push(`/engagements/${e.id}`)}>
                        <ListItemAvatar>
                            <Avatar>{engagementIcon(e.method.name)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText secondary={formatDate(e.date)}>
                            {e.title}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <Divider key={`eng-divider-${props.index}`} />
            </>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 0, height: '100%', overflowY: 'hidden' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, p: 1, bgcolor: grey[200], borderBottom: `1px solid ${grey[400]}` }}>
                <Typography variant='h5'>{`${contact.first_name} ${contact.last_name}`}</Typography>
                <CardSubHeader contact={contact} />
            </Box>
            <Grid container spacing={0} sx={{ flexGrow: 1, overflowY: { xs: 'scroll', md: 'visible' } }}>
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', borderRight: `1px solid ${grey[300]}` }}>
                    <Box sx={{ bgcolor: grey[100], borderBottom: `1px solid ${grey[300]}`, p: 1, textAlign: 'center' }}>
                        <Typography variant="h6">Contact Information</Typography>
                    </Box>
                    <List dense sx={{ flexGrow: 1, overflowY: { xs: 'visible', md: 'auto' } }}>
                        <ListSubheader key='phone-subheader'>Phone Numbers</ListSubheader>
                        {contact.phones && contact.phones.map((c, index) => (
                            <>
                                <ListItem key={`phone-${c.system}-${c.number}`}>
                                    <ListItemAvatar>
                                        <Avatar><PhoneIcon /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText secondary={c.system}>{c.number}</ListItemText>
                                </ListItem>
                                <Divider key={`phone-divider-${index}`} />
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

                        <ListSubheader key='email-subheader'>Email Addresses</ListSubheader>
                        {contact.emails && contact.emails.map((e, index) => (
                            <>
                                <ListItem key={`email-${e.system}-${e.address}`}>
                                    <ListItemAvatar>
                                        <Avatar><EmailIcon /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText secondary={e.system}>{e.address}</ListItemText>
                                </ListItem>
                                <Divider key={`email-divider-${index}`} />
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

                        <ListSubheader key='sm-subheader'>Social Media</ListSubheader>
                        <ListItem key='facebook'>
                            <ListItemAvatar>
                                <Avatar><FacebookIcon /></Avatar>
                            </ListItemAvatar>
                            <ListItemText>None</ListItemText>
                        </ListItem>
                        <Divider key="linkedin-divider" />
                        <ListItem key='linkedin'>
                            <ListItemAvatar>
                                <Avatar><LinkedInIcon /></Avatar>
                            </ListItemAvatar>
                            <ListItemText>None</ListItemText>
                        </ListItem>
                        <Divider key="twitter-divider" />
                        <ListItem key='twitter'>
                            <ListItemAvatar>
                                <Avatar><TwitterIcon /></Avatar>
                            </ListItemAvatar>
                            <ListItemText>None</ListItemText>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} md={4} sx={{ borderRight: `1px solid ${grey[300]}` }}>
                    <Box sx={{ bgcolor: grey[100], borderBottom: `1px solid ${grey[300]}`, p: 1, textAlign: 'center' }}>
                        <Typography variant="h6">Engagements</Typography>
                    </Box>
                    <FixedSizeList
                        height={400}
                        width='100%'
                        itemSize={40}
                        itemCount={engagements.length}
                        overscanCount={5}
                    >
                        {renderEngagementRow}
                    </FixedSizeList>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{ bgcolor: grey[100], borderBottom: `1px solid ${grey[300]}`, p: 1, textAlign: 'center' }}>
                        <Typography variant="h6">Notes</Typography>
                    </Box>
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
                {contact ? <ContactCard contact={contact} /> : <></>}
                <Box sx={{ position: 'absolute ', top: '0px', right: '0px' }}>
                    <IconButton sx={{ m: 2 }} onClick={toggleDrawer(undefined)}>
                        <CloseOutlinedIcon />
                    </IconButton>
                </Box>
            </Drawer>
        </Box>
    )
}