// React
import React, { useState } from "react"
import { useRouter } from 'next/router';

// Local
import { Contact } from "@/lib/models"
import { useContacts } from "@/lib/utils/hooks";

// UI
import { Avatar, Box, Button, Card, CardActionArea, CardHeader, Divider, Drawer, IconButton, styled, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridCallbackDetails, GridColumns, GridRowParams, MuiEvent } from "@mui/x-data-grid";
import { Virtuoso } from 'react-virtuoso';

// Icons
import AddCommentIcon from '@mui/icons-material/AddComment';
import AddIcon from '@mui/icons-material/Add';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContactCard from '@/lib/components/card-contact';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { formatDistanceToNow } from 'date-fns';
import GridToolbar from '@/lib/components/grid-toolbar';

const ExpandMore = styled((props: any) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
    }),
}));

function NoContactsOverlay() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 1, width: '100%', height: '100%' }}>
            <ContactMailIcon sx={{ fontSize: 20 }} />
            <Typography variant="h6">No Contacts Found</Typography>
        </Box>
    )
}

interface MobileCardProps {
    contact: Contact;
    onClick: (contact: Contact) => void;
}

function MobileCard(props: MobileCardProps) {
    const { contact, onClick } = props;

    const lastContact = contact.last_contact ? formatDistanceToNow(new Date(contact.last_contact), { addSuffix: true }) : 'Never';

    const Title = (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.875rem' }}>{`${contact.last_name}, ${contact.first_name}`}</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{`${contact.location.city}, ${contact.location.state}`}</Typography>
        </Box>
    );

    const Subheader = (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{`${contact.grade.name}, ${contact.org.name}, ${contact.title}`}</Typography>
            <Typography sx={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'text.secondary' }}>{lastContact}</Typography>
        </Box>
    );

    return (
        <Card sx={{ my: 1 }} variant='outlined'>
            <CardActionArea onClick={() => onClick(contact)}>
                <CardHeader
                    avatar={<Avatar aria-label="contact">{`${contact.first_name[0]}${contact.last_name[0]}`}</Avatar>}
                    title={Title}
                    subheader={Subheader}
                />
            </CardActionArea>
        </Card>
    );
}

interface MobileCardListProps {
    contacts: Contact[];
    onClick: (contact: Contact) => void;
}

function MobileCardList(props: MobileCardListProps) {
    const { contacts, onClick } = props;

    return (
        <Virtuoso
            totalCount={contacts.length}
            itemContent={(index => <MobileCard key={`contact-${contacts[index].id}`} contact={contacts[index]} onClick={onClick} />)}
        />
    )
}

export default function Contacts() {
    const router = useRouter();
    const theme = useTheme();
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
    ];

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{ height: '100%' }}>
            {isSmallScreen ?
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', mx: 1, pt: 1, rowGap: 1 }}>
                    <Button variant="outlined" fullWidth startIcon={<AddIcon />} onClick={() => router.push('/contacts/edit')}>Create Contact</Button>
                    <Divider />
                    <Box sx={{ flexGrow: 1 }}>
                        <MobileCardList contacts={contacts} onClick={contact => setContact(contact)} />
                    </Box>
                </Box>
                :
                <DataGrid
                    rows={contacts}
                    columns={columns}
                    loading={loading}
                    sx={{
                        border: 0,
                    }}
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
                            onCreate: () => router.push(`/contacts/edit`)
                        }
                    }}
                    onRowDoubleClick={handleClick}
                />
            }
            <Drawer
                anchor='bottom'
                open={contact !== undefined}
                onClose={toggleDrawer(undefined)}
            >
                {contact && <ContactCard contact={contact} />}
                <Box sx={{ position: 'absolute ', top: '0px', right: '0px' }}>
                    <IconButton sx={{ m: 2 }} onClick={toggleDrawer(undefined)}>
                        <CloseOutlinedIcon />
                    </IconButton>
                </Box>
            </Drawer>
        </Box>
    )
}