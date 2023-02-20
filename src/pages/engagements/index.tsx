import { Engagement } from "@/lib/models";
import { useEngagements } from "@/lib/utils/hooks";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";

export default function Engagements() {
    const { engagements, loading } = useEngagements();

    const columns: GridColumns<Engagement> = [
        { field: 'topic', headerName: 'Topic', flex: 1 },
        { field: 'date', headerName: 'Date/Time', type: 'dateTime', flex: 1, valueGetter: v => v && new Date(v.row.date) },
        {
            field: 'contacts', headerName: 'Contacts', flex: 2, renderCell: params => (
                <Box sx={{ display: 'flex', columnGap: '1em', overflowX: 'hidden' }}>
                    {params.row.contacts.map(c => <Chip key={`chip-${c.id}`} label={`${c.firstName} ${c.lastName}`} />)}
                </Box>
            )
        },
        { field: 'notes', headerName: 'Notes', flex: 2 }
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