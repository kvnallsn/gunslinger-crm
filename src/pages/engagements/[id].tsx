import LoadingBackdrop from '@/lib/components/loading-backdrop';
import { getDatabaseConn } from "@/lib/db";
import { Engagement } from "@/lib/models";
import { useEngagement } from '@/lib/utils/hooks';
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from 'next/router';
import { authOptions } from "../api/auth/[...nextauth]";

interface Props {
    engagement: Engagement,
}

export default function EngagementDetail() {
    const router = useRouter();
    const { id } = router.query;

    const { engagement, loading } = useEngagement(id as string);

    return (
        <Box>
            <LoadingBackdrop open={loading} />
            <AppBar position="static" color="secondary">
                <Toolbar variant="dense">
                    <Typography variant="caption" component="i" sx={{ pr: 2 }}>ENGAGEMENT</Typography>
                    <Typography variant="h6" component="div">{engagement?.topic}</Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}