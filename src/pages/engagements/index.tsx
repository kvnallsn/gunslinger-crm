import { Engagement } from "@/lib/models";
import { useEngagements } from "@/lib/utils/hooks";
import { Box, Chip, TextField } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridCellParams, GridColumns, GridFilterInputValue, GridFilterItem, GridFilterOperator, GridToolbar } from "@mui/x-data-grid";
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/router";
import { EngagementOrg, EngagementTopic } from "@/lib/models/engagement";

export default function Engagements() {
    const router = useRouter();
    const { engagements, loading } = useEngagements();

    const openEngagement = async (id: string) => {
        await router.push(`/engagements/${encodeURIComponent(id)}`);
    };

    const orgsFilter = (filter: string) => {
        return (params: GridCellParams): boolean => {
            return params.row.orgs
                .map((item: EngagementOrg) => item.org_name.includes(filter))
                .reduce((acc: boolean, item: boolean) => acc || item, false);
        }
    }

    const topicsFilter = (filter: string) => {
        return (params: GridCellParams): boolean => {
            return params.row.topics
                .map((item: EngagementTopic) => item.topic.includes(filter))
                .reduce((acc: boolean, item: boolean) => acc || item, false);
        }
    }

    const makeFilter = (filter: (filter: string) => (params: GridCellParams) => boolean) => {
        return (item: GridFilterItem) => {
            if (!item.value) {
                return null;
            }

            return filter(item.value);
        }
    };

    const makeQuickFilter = (filter: (filter: string) => (params: GridCellParams) => boolean) => {
        return (value: string) => {
            if (!value || value.length < 2) {
                // require at least two characters to search
                return null;
            }

            return filter(value);
        }
    }

    const columns: GridColumns<Engagement> = [
        { field: 'date', headerName: 'Date/Time', type: 'dateTime', flex: 2, valueGetter: v => v && new Date(v.row.date) },
        { field: 'username', headerName: 'Created By', flex: 1 },
        { field: 'title', headerName: 'Title', flex: 2 },
        {
            field: 'topics', headerName: 'Topics', flex: 3, renderCell: params => (
                <Box sx={{ display: 'flex', columnGap: '1em', overflowX: 'hidden' }}>
                    {params.row.topics.map(t => <Chip key={`chip-topic-${t.id}`} label={t.topic} variant="outlined" />)}
                </Box>
            ),
            getApplyQuickFilterFn: makeQuickFilter(topicsFilter),
            filterOperators: [{
                label: 'Contains',
                value: 'contains',
                getApplyFilterFn: makeFilter(topicsFilter),
                InputComponent: GridFilterInputValue
            }],
            sortable: false,
        },
        {
            field: 'orgs', headerName: 'Organizations', flex: 3, renderCell: params => (
                <Box sx={{ display: 'flex', columnGap: '1em', overflowX: 'hidden' }}>
                    {params.row.orgs.map(o => <Chip key={`chip-org-${o.org_id}`} label={o.org_name} variant="outlined" />)}
                </Box>
            ),
            getApplyQuickFilterFn: makeQuickFilter(orgsFilter),
            filterOperators: [{
                label: 'Contains',
                value: 'contains',
                getApplyFilterFn: makeFilter(orgsFilter),
                InputComponent: GridFilterInputValue
            }],
            sortable: false
        },
        { field: 'method', headerName: 'Method', flex: 1, valueGetter: (params: GridCellParams) => params.row.method.name },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            getActions: params => [
                <GridActionsCellItem icon={<LaunchIcon />} label="Open Notes" onClick={() => openEngagement(params.row.id)} />,
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
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'date', sort: 'desc' }]
                    }
                }}
            />
        </Box>
    );
}