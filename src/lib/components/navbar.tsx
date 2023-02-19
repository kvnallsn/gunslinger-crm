import React, { useState } from "react";
import Link from 'next/link';
import { Box, Button, Divider, Typography, List, ListItem, ListItemButton, ListItemText, AppBar, Toolbar, IconButton, Drawer, ButtonGroup, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const drawerWidth = 240;

const routes = [
    { display: 'Home', route: '/' },
    { display: 'Contacts', route: '/contacts ' },
];

export default function Navbar() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [createAnchorEl, setCreateAnchorEl] = useState<HTMLElement | null>(null);
    const createMenuOpen = Boolean(createAnchorEl);

    const handleDrawerToggle = () => {
        setMobileOpen(open => !open);
    };

    const handleCreateMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setCreateAnchorEl(event.currentTarget);
    };

    const handleCreateMenuClose = () => {
        setCreateAnchorEl(null);
    };

    const navigate = (url: string) => {
        handleCreateMenuClose();
        router.push(url);
    };

    const isAuthenticated = status === 'authenticated';

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
            const data = await signOut({ redirect: false, callbackUrl: "/auth/signin" });
            router.push(data.url);
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
                        {isAuthenticated && routes.map(item => (
                            <Link key={item.display} href={item.route}>
                                <Button sx={{ color: '#fff' }}>
                                    {item.display}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'flex', columnGap: '1em' } }}>
                        {isAuthenticated ?
                            <ButtonGroup color='inherit'>
                                <Button
                                    id="create-button"
                                    aria-controls={createMenuOpen ? 'create-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={createMenuOpen ? 'true' : undefined}
                                    onClick={handleCreateMenuClick}
                                    endIcon={<KeyboardArrowDownIcon />}
                                >
                                    Create
                                </Button>
                                <Menu
                                    id="create-menu"
                                    anchorEl={createAnchorEl}
                                    open={createMenuOpen}
                                    onClose={handleCreateMenuClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    MenuListProps={{
                                        'aria-labelledby': 'create-button'
                                    }}
                                >
                                    <MenuItem onClick={() => navigate('/contacts/edit')}>Contact</MenuItem>
                                    <MenuItem onClick={() => navigate('/engagements/edit')}>Engagement</MenuItem>
                                </Menu>
                                <Button onClick={logout}>Logout</Button>
                            </ButtonGroup>
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