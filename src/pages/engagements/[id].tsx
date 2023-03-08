import LoadingBackdrop from '@/lib/components/loading-backdrop';
import { useEngagement, useEngagementNotes } from '@/lib/utils/hooks';
import { AppBar, Avatar, Box, Card, CardContent, CardHeader, Chip, Grid, Paper, TextField, Toolbar, Typography } from "@mui/material";
import { useTheme } from '@mui/system';
import { useRouter } from 'next/router';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { green, orange, grey } from '@mui/material/colors';

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
            return d.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            });
        }
    }

    return (
        <Box sx={{ height: '100%' }}>
            <LoadingBackdrop open={loading} />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <AppBar position="static" color="secondary">
                    <Toolbar variant="dense">
                        <Typography variant="caption" component="i" sx={{ pr: 2 }}>ENGAGEMENT</Typography>
                        <Typography variant="caption" sx={{ pl: 2 }}>{formatDate(engagement?.date)}</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                    </Toolbar>
                </AppBar>
                <Box sx={{ m: 2, flexGrow: 1 }}>
                    <Section title="Topics">
                        <Box sx={{ display: 'flex', columnGap: '1em', p: 1 }}>
                            {engagement?.topics.map(t => <EngagementTopic key={`t-${t.id}`} topic={t} />)}
                        </Box>
                    </Section>

                    <Section title="Participants">
                        <Grid container spacing={2} sx={{ p: 1 }}>
                            {engagement?.contacts.map(c => <Grid key={`eg - c - ${c.id} `} item xs={12} sm={4} md={3} lg={2}><EngagementCard contact={c} /></Grid>)}
                        </Grid>
                    </Section>

                    <Section title="Notes">
                        <Grid container rowSpacing={2} sx={{ p: 1 }}>
                            {notes?.map(note => <Grid key={`eg - n - ${note.id} `} item xs={12}><EngagementNote note={note} /></Grid>)}
                        </Grid>
                    </Section>
                </Box>
            </Box>
        </Box>
    )
}