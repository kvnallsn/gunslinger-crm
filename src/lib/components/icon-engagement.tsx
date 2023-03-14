import { Engagement } from '../models';

import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import Groups2Icon from '@mui/icons-material/Groups2';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

interface EngagementIconProps {
    engagement: Engagement;
}

export default function EngagementIcon(props: EngagementIconProps) {
    const { engagement } = props;

    const engagementIcon = (method: string) => {
        switch (method) {
            case 'Phone Call':
                return <PhoneIcon />;
            case 'Text / Direct Message':
                return <ChatOutlinedIcon />;
            case 'Email':
                return <EmailIcon />;
            case 'Meeting (In-Person)':
            case 'Meeting (Virtual)':
                return <BusinessCenterIcon />;
            case 'Conference (In-Person)':
            case 'Conference (Virtual)':
                return <Groups2Icon />;
            default:
                return <QuestionMarkIcon />;
        }
    }

    return engagementIcon(engagement.method.name);
}