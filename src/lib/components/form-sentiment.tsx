import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { FormControl, FormLabel, Rating, styled } from '@mui/material';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const icons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color='error' />,
        label: 'Very Dissastisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon color='error' />,
        label: 'Dissastisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon color='warning' />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon color='success' />,
        label: 'Sastisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon color='success' />,
        label: 'Very Sastisfied',
    }
};

function IconContainer(props: any) {
    const { value, ...other } = props;
    return <span {...other}>{icons[value].icon}</span>
}

export default function FormSentiment() {
    return (
        <FormControl>
            <FormLabel>Engagement Satisfiaction</FormLabel>
            <StyledRating
                name="test"
                defaultValue={3}
                IconContainerComponent={IconContainer}
                getLabelText={(value) => icons[value].label}
                highlightSelectedOnly
            />
        </FormControl>
    );
}