import { Engagement } from "@/lib/models";
import { useEngagements } from "@/lib/utils/hooks";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Engagements() {
    const { engagements, loading } = useEngagements();

    const columns: GridColumns<Engagement> = [
        { field: 'topic', headerName: 'Topic', flex: 2 },
        { field: 'date', headerName: 'Date/Time', type: 'dateTime', flex: 2, valueGetter: v => v && new Date(v.row.date) },
        {
            field: 'contacts', headerName: 'Contacts', flex: 3, renderCell: params => (
                <Box sx={{ display: 'flex', columnGap: '1em', overflowX: 'hidden' }}>
                    {params.row.contacts.map(c => <Chip key={`chip-${c.id}`} label={`${c.firstName} ${c.lastName}`} />)}
                </Box>
            )
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            getActions: params => [
                <GridActionsCellItem icon={<LaunchIcon />} label="Open Notes" onClick={() => { }} />,
                <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => { }} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => { }} showInMenu />
            ]
        }
    ];

    return (
        <Box sx={{ height: '100%' }}>
            <DataGrid
                rows={engagements || []}
                columns={columns}
                loading={loading}
            />
        </Box>
    );
}