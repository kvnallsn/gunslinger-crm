import { Typography } from '@mui/material';
import { ReactElement } from 'react';
import FlexColumnBox from './box-flexcolumn';

interface EmptyOverlayProps {
    // icon to display
    icon: ReactElement,

    // message to display below the icon
    msg: string;
}

export default function EmptyOverlay(props: EmptyOverlayProps) {
    const { icon, msg } = props;

    return (
        <FlexColumnBox sx={{ justifyContent: 'center', alignItems: 'center', rowGap: 1, width: '100%', height: '100%' }}>
            {icon}
            <Typography variant="h6">{msg}</Typography>
        </FlexColumnBox>
    )
}
