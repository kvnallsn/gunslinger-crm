import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { Backdrop, Box, Button, CircularProgress, Container, Paper, Typography } from "@mui/material";
import Link from "next/link";

interface Props {
    status: string | null;
    loadingText?: string;
    onClose: () => void;
    onReset: () => void;
    redirect: string;
    redirectText: string;
}

export default function EditSaveBackdrop(props: Props) {
    return (
        <Backdrop
            sx={{ background: '#ffffffaa', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={Boolean(props.status)}
        >
            <Paper elevation={4} sx={{ margin: 2, padding: 2 }}>
                <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: '1em' }}>
                    {props.status === 'save' &&
                        <>
                            <CircularProgress color='inherit' />
                            <Typography variant="subtitle1" sx={{ mt: 1 }}>{props.loadingText ?? "Loading"}</Typography>
                        </>
                    }

                    {props.status === 'success' &&
                        <>
                            <CheckCircleIcon color="success" fontSize="large" />
                            <Typography variant="subtitle1">Contact Saved</Typography>
                            <Box sx={{ display: 'flex', columnGap: '1em' }}>
                                <Button variant="outlined" onClick={props.onReset}>Create Another</Button>
                                <Link href={props.redirect}>
                                    <Button variant="contained">{props.redirectText}</Button>
                                </Link>
                            </Box>
                        </>
                    }

                    {props.status === 'error' &&
                        <>
                            <ErrorIcon color="error" fontSize="large" />
                            <Typography variant="subtitle1">Error!</Typography>
                            <Button variant="outlined" color="error" onClick={props.onClose}>Close</Button>
                        </>
                    }
                </Container>
            </Paper>
        </Backdrop>
    );
}