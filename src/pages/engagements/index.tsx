import { useRouter } from "next/router";
import { formatDistanceToNow } from 'date-fns';

import { Avatar, Box, Button, Card, CardActionArea, CardHeader, Chip, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridCallbackDetails, GridCellParams, GridColumns, GridFilterInputValue, GridFilterItem, GridRowParams, MuiEvent } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import Diversity3Icon from '@mui/icons-material/Diversity3';

import { Engagement } from "@/lib/models";
import { useEngagements } from "@/lib/utils/hooks";
import { EngagementOrg, EngagementTopic } from "@/lib/models/engagement";
import EngagementIcon from '@/lib/components/icon-engagement';
import { Virtuoso } from 'react-virtuoso';
import GridToolbar from '@/lib/components/grid-toolbar';
import EmptyOverlay from '@/lib/components/overlay-empty';

interface MobileCardProps {
    engagement: Engagement;
    onClick: (id: string) => void;
}

function MobileCard(props: MobileCardProps) {
    const { engagement, onClick } = props;

    const relativeDate = formatDistanceToNow(new Date(engagement.date), { addSuffix: true });

    const Title = (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.875rem' }}>{`${engagement.title}`}</Typography>
            <Typography sx={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'text.secondary' }}>{engagement.username}</Typography>
        </Box>
    );

    const Subheader = (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{`${engagement.method.name}`}</Typography>
            <Typography sx={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'text.secondary' }}>{relativeDate}</Typography>
        </Box>
    );

    return (
        <Card sx={{ my: 1 }} variant='outlined'>
            <CardActionArea onClick={() => onClick(engagement.id)}>
                <CardHeader
                    avatar={<Avatar aria-label="contact"><EngagementIcon engagement={engagement} /></Avatar>}
                    title={Title}
                    subheader={Subheader}
                />
            </CardActionArea>
        </Card>
    );
}

export default function Engagements() {
    const router = useRouter();
    const theme = useTheme();
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

    const handleClick = (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => {
        openEngagement(params.row.id);
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
    ];

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{ height: '100%' }}>
            {isSmallScreen ?
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', mx: 1, pt: 1, rowGap: 1 }}>
                    <Button variant="outlined" fullWidth startIcon={<AddIcon />} onClick={() => router.push('/engagements/edit')}>Create Engagement</Button>
                    <Divider />
                    <Box sx={{ flexGrow: 1 }}>
                        <Virtuoso
                            totalCount={engagements.length}
                            itemContent={index => (
                                <MobileCard
                                    key={`engagement-${engagements[index].id}`}
                                    engagement={engagements[index]}
                                    onClick={openEngagement}
                                />
                            )}
                        />
                    </Box>
                </Box>
                :
                <DataGrid
                    rows={engagements}
                    columns={columns}
                    loading={loading}
                    sx={{
                        border: 0,
                    }}
                    components={{
                        Toolbar: GridToolbar,
                        NoRowsOverlay: EmptyOverlay,
                    }}
                    componentsProps={{
                        toolbar: {
                            onCreate: () => router.push(`/engagements/edit`),
                        },
                        noRowsOverlay: {
                            icon: <Diversity3Icon sx={{ fontSize: 40 }} />,
                            msg: "No Engagements"
                        }
                    }}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'date', sort: 'desc' }]
                        }
                    }}
                    onRowDoubleClick={handleClick}
                />
            }
        </Box>
    );
}