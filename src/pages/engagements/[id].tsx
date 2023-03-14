import LoadingBackdrop from '@/lib/components/loading-backdrop';
import { useEngagement, useEngagementNotes } from '@/lib/utils/hooks';
import { AppBar, Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Grid, Paper, Skeleton, TextField, Toolbar, Typography } from "@mui/material";
import { useTheme } from '@mui/system';
import { useRouter } from 'next/router';
import { green, orange, grey } from '@mui/material/colors';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';

function TabPanel(props: any) {
    const { name, children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`engagement-tabpanel-${name}`}
            aria-labelledby={`engagement-tab-${name}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

function EngagementCard(props: any) {
    const { contact } = props;

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {contact.firstName} {contact.lastName}
                </Typography>
                <Typography color="text.secondary">
                    {contact.org}
                </Typography>
            </CardContent>
        </Card>
    )
}

function EngagementNote(props: any) {
    const { note } = props;

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: (note.public ? green[500] : orange[500]) }}>
                        {note.public ? <PublicIcon /> : <LockIcon />}
                    </Avatar>
                }
                title={note.username}
                subheader={note.public ? 'Public Note' : note.group_names.join(", ")}
            />
            <CardContent>
                <TextField
                    fullWidth
                    multiline
                    rows={5}
                    value={note.note}
                    inputProps={{
                        readOnly: true
                    }}
                />
            </CardContent>
        </Card>
    )
}

function EngagementTopic(props: any) {
    const { topic } = props;

    return (
        <Chip label={topic.topic} variant="outlined" />
    );
}

function Section(props: any) {
    const { title, children } = props;
    const theme = useTheme();

    return (
        <Paper variant='outlined' sx={{ mb: 4 }}>
            <Box bgcolor={theme.palette.mode === 'dark' ? grey[800] : grey[100]}>
                <Typography variant='h6' color='inherit' sx={{ p: 1 }}>{title}</Typography>
            </Box>
            {children}
        </Paper>
    );
}

export default function EngagementDetail() {
    const router = useRouter();
    const { id } = router.query;

    const { engagement, loading } = useEngagement(id as string);
    const { notes, loading: notesLoading } = useEngagementNotes(id as string);

    const formatDate = (d: Date | undefined) => {
        if (d === undefined) {
            return 'No Date Specified';
        } else {
            return new Date(d).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
        }
    }

    if (loading) {
        return (
            <Box sx={{ height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <AppBar position="static" color="secondary">
                        <Toolbar variant="dense">
                            <Skeleton variant="text" sx={{ pr: 2, width: '160px' }} />
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ m: 2, flexGrow: 1 }}>
                        <Section title="Topics">
                            <Box sx={{ display: 'flex', columnGap: '1em', p: 1 }}>
                                <Skeleton variant="circular" width={40} height={40} />
                                <Skeleton variant="rectangular" width={210} height={40} />
                            </Box>
                        </Section>

                        <Section title="Participants">
                            <Box sx={{ display: 'flex', columnGap: '1em', p: 1 }}>
                                <Skeleton variant="circular" width={40} height={40} />
                                <Skeleton variant="rectangular" width={210} height={40} />
                            </Box>
                        </Section>

                        <Section title="Summary">
                            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1em', p: 1 }}>
                                <Skeleton variant="rectangular" width={610} height={80} />
                                <Skeleton variant="rectangular" width={610} height={20} />
                                <Skeleton variant="rectangular" width={610} height={20} />
                            </Box>
                        </Section>
                    </Box>
                </Box>
            </Box>
        );
    } else if (engagement === undefined) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 1, justifyContent: 'center', alignItems: 'center' }}>
                <InfoIcon color='warning' fontSize='large' />
                <Typography component='i' sx={{ color: 'text.secondary' }}>Engagement Not Found</Typography>
                <Button variant='contained' onClick={() => router.back()}>Go Back</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <AppBar position="static" color="secondary">
                    <Toolbar variant="dense">
                        <Typography variant='subtitle2' sx={{ pr: 2 }}>{engagement.title}</Typography>
                        <Typography variant="caption" sx={{ pr: 2 }}>{engagement.method.name}</Typography>
                        <Typography variant="caption">{formatDate(engagement.date)}</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                    </Toolbar>
                </AppBar>
                <Box sx={{ m: 2, flexGrow: 1 }}>
                    <Section title="Topics">
                        <Box sx={{ display: 'flex', columnGap: '1em', p: 1 }}>
                            {engagement.topics.map(t => <EngagementTopic key={`t-${t.id}`} topic={t} />)}
                        </Box>
                    </Section>

                    <Section title="Participants">
                        <Grid container spacing={2} sx={{ p: 1 }}>
                            {engagement.contacts.map(c => <Grid key={`eg - c - ${c.id} `} item xs={12} sm={4} md={3} lg={2}><EngagementCard contact={c} /></Grid>)}
                        </Grid>
                    </Section>

                    <Section title="Summary">
                        <TextField
                            fullWidth
                            value={engagement.summary}
                            inputProps={{ readOnly: true }}
                            multiline
                            rows={5}
                        />
                    </Section>

                    <Section title="Notes">
                        <Grid container rowSpacing={2} sx={{ p: 1 }}>
                            {notes.length == 0 ?
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center', p: 8 }}>
                                    <InfoIcon color='inherit' fontSize='large' sx={{ mb: 1 }} />
                                    <Typography component='i' sx={{ color: 'text.secondary' }}>No Notes Found</Typography>
                                </Box>
                                :
                                notes.map(note => <Grid key={`eg - n - ${note.id} `} item xs={12}><EngagementNote note={note} /></Grid>)
                            }
                        </Grid>
                    </Section>
                </Box>
            </Box>
        </Box >
    )
}