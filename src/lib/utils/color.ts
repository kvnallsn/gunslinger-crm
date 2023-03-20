import { useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

export type ColorIndex = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export default function color(light: ColorIndex, dark: ColorIndex) {
    const theme = useTheme();
    return theme.palette.mode === 'dark' ? grey[dark] : grey[light];
}