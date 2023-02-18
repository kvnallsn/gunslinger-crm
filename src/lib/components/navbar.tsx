import { useState } from "react";
import Link from 'next/link';
import SplitButton from "./splitbutton";
import { Box, Button, Divider, Typography, List, ListItem, ListItemButton, ListItemText, AppBar, Toolbar, IconButton, Drawer, ButtonGroup } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useSession } from "./session";
import { useRouter } from "next/router";

const drawerWidth = 240;

const routes = [
    { display: 'Home', route: '/' },
    { display: 'Contacts', route: '/contacts ' },
];

export default function Navbar() {
    const { session, setSession } = useSession();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(open => !open);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant='h6' sx={{ my: 2 }}>
                GunslignerCRM
            </Typography>
            <Divider />
            <List>
                {routes.map(item => (
                    <ListItem key={`drawer-${item.display}`} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }} href={item.route}>
                            <ListItemText primary={item.display} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const logout = async () => {
        try {
            const resp = await fetch(`/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!resp.ok) {
                throw new Error(`${resp.status}: ${resp.statusText}`);
            }

            setSession({ auth: false });

            router.push('/auth/signin');
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <>
            <AppBar component='nav' position='sticky'>
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label="open drawer"
                        edge='start'
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant='h6' component='div' sx={{ display: 'block' }}>
                        GunslingerCRM
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        {routes.map(item => (
                            <Link key={item.display} href={item.route}>
                                <Button sx={{ color: '#fff' }}>
                                    {item.display}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'flex', columnGap: '1em' } }}>
                        {session.auth ?
                            <>
                                <SplitButton />
                                <Button variant="contained" onClick={logout}>Logout</Button>
                            </>
                            :
                            <Button variant="contained" href="/auth/signin">Login</Button>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
            <Box component='nav'>
                <Drawer
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </>
    );
}