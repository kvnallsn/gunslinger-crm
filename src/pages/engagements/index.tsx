import { Engagement } from "@/lib/models";
import { useEngagements } from "@/lib/utils/hooks";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns, GridToolbar } from "@mui/x-data-grid";
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/router";

export default function Engagements() {
    const router = useRouter();
    const { engagements, loading } = useEngagements();

    const openEngagement = async (id: string) => {
        await router.push(`/engagements/${encodeURIComponent(id)}`);
    };

    const columns: GridColumns<Engagement> = [
        { field: 'date', headerName: 'Date/Time', type: 'dateTime', flex: 1, valueGetter: v => v && new Date(v.row.date) },
        { field: 'username', headerName: 'Created By', flex: 1 },
        {
            field: 'orgs', headerName: 'Organizations', flex: 3, renderCell: params => (
                <Box sx={{ display: 'flex', columnGap: '1em', overflowX: 'hidden' }}>
                    {params.row.orgs.map(o => <Chip key={`chip-org-${o.org_id}`} label={o.org_name} />)}
                </Box>
            )
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            getActions: params => [
                <GridActionsCellItem icon={<LaunchIcon />} label="Open Notes" onClick={() => openEngagement(params.row.id)} />,
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
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    }
                }}
            />
        </Box>
    );
}