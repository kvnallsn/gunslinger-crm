// React
import React from "react"
import { useRouter } from 'next/router';

// Local
import { Contact } from "@/lib/models"

// UI
import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns, GridRowParams, GridToolbar } from "@mui/x-data-grid";

// Icons
import AddCommentIcon from '@mui/icons-material/AddComment';
import EditIcon from '@mui/icons-material/Edit';
import { useContacts } from "@/lib/utils/hooks";

export default function Contacts() {
    const router = useRouter();
    const { contacts, loading, error } = useContacts();

    const columns: GridColumns<Contact> = [
        { field: 'last_name', headerName: 'Last Name', flex: 1 },
        { field: 'first_name', headerName: 'First Name ', flex: 1 },
        { field: 'grade', headerName: 'Grade / Rank', flex: 1, valueGetter: params => params.row.grade.name },
        { field: 'location', headerName: 'Location', flex: 1, valueGetter: params => `${params.row.location.city}, ${params.row.location.state}` },
        { field: 'org', headerName: 'Organization', flex: 2, valueGetter: params => params.row.organization.name },
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
            {contacts ?
                <DataGrid
                    rows={contacts}
                    columns={columns}
                    loading={loading}
                    components={{ Toolbar: GridToolbar }}
                    componentsProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                        }
                    }}
                />
                :
                <Box></Box>
            }
        </Box>
    )
}