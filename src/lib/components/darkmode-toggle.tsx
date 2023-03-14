import { ColorMode, ColorModeContext } from "@/pages/_app";
import { Box, Button, IconButton, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function DarkModeToggle() {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.primary',
                borderRadius: 1,
            }}
        >
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Box>
    )
}

export function DarkModeToggleButtons() {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const [mode, setMode] = useState<ColorMode>(theme.palette.mode);

    const handleModeToggle = (event: any, newMode: any) => {
        if (newMode !== null) {
            setMode(newMode);
            colorMode.setMode(newMode);
        }
    };

    return (
        <ToggleButtonGroup
            value={mode}
            exclusive
            fullWidth
            size='small'
            onChange={handleModeToggle}
            aria-label="color mode"
            sx={{ borderRadius: 0 }}
        >
            <ToggleButton value="light" aria-label='light mode' sx={{ borderRadius: 0 }}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: 1 }}>
                    <Brightness7Icon />
                    <Typography variant='subtitle2'>Light</Typography>
                </Box>
            </ToggleButton>
            <ToggleButton value="dark" aria-label='dark mode' sx={{ borderRadius: 0 }}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', columnGap: 1 }}>
                    <Brightness4Icon />
                    <Typography variant='subtitle2'>Dark</Typography>
                </Box>
            </ToggleButton>
        </ToggleButtonGroup>
    )
}