import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { FormControl, FormLabel, IconContainerProps, Rating, styled } from '@mui/material';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const icons = [
    {
        icon: <SentimentVeryDissatisfiedIcon color='error' />,
        label: 'Very Dissastisfied',
    },
    {
        icon: <SentimentDissatisfiedIcon color='error' />,
        label: 'Dissastisfied',
    },
    {
        icon: <SentimentSatisfiedIcon color='warning' />,
        label: 'Neutral',
    },
    {
        icon: <SentimentSatisfiedAltIcon color='success' />,
        label: 'Sastisfied',
    },
    {
        icon: <SentimentVerySatisfiedIcon color='success' />,
        label: 'Very Sastisfied',
    }
];

function IconContainer(props: IconContainerProps) {
    const { value, ...other } = props;
    return <span {...other}>{icons[value - 1].icon}</span>
}

export default function FormSentiment() {
    return (
        <FormControl>
            <FormLabel>Engagement Satisfiaction</FormLabel>
            <StyledRating
                name="test"
                defaultValue={3}
                IconContainerComponent={IconContainer}
                getLabelText={(value) => icons[value - 1].label}
                highlightSelectedOnly
            />
        </FormControl>
    );
}