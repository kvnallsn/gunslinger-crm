// React
import { useEffect, useState } from "react"

// Local
import { Contact } from "@/lib/models"

// UI
import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns, GridRowParams } from "@mui/x-data-grid";

// Icons
import AddCommentIcon from '@mui/icons-material/AddComment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function Contacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const columns: GridColumns<Contact> = [
        { field: 'last_name', headerName: 'Last Name', flex: 1 },
        { field: 'first_name', headerName: 'First Name ', flex: 1},
        { field: 'grade', headerName: 'Grade / Rank', flex: 1, valueGetter: params => params.row.grade.name },
        { field: 'location', headerName: 'Location', flex: 1, valueGetter: params => `${params.row.location.city}, ${params.row.location.state}` },
        { field: 'org', headerName: 'Organization', flex: 2, valueGetter: params => params.row.organization.name },
        {
            field: 'actions',
            type: 'actions',
            getActions: (_params: GridRowParams) => [
                <GridActionsCellItem icon={<AddCommentIcon />} label="Add Engagement" />,
                <GridActionsCellItem icon={<EditIcon />} label="Edit" />
            ]
        },
    ];

    useEffect(() => {
        setLoading(true);
        setError(false);
        fetch('/api/contacts')
            .then(res => res.json())
            .then(data => setContacts(data.contacts))
            .catch(reason => {
                console.error(reason);
                setError(true);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box sx={{ height: '100%' }}>
            <DataGrid
                rows={contacts}
                columns={columns}
                loading={loading}
            />
        </Box>
    )
}