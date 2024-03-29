import React, { useState } from "react";
import Link from 'next/link';
import { Box, Button, Divider, Typography, List, ListItem, ListItemButton, ListItemText, AppBar, Toolbar, IconButton, Drawer, ButtonGroup, ListItemAvatar, Avatar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import DropdownMenu from "./dropdown-menu";
import DarkModeToggle, { DarkModeToggleButtons } from "./darkmode-toggle";

const drawerWidth = 240;

const routes = [
    { display: 'Contacts', route: '/contacts ' },
    { display: 'Engagements', route: '/engagements' },
];

const createRoutes = [
    { display: 'Contact', href: '/contacts/edit' },
    { display: 'Engagement', href: '/engagements/edit' },
];

const adminRoutes = [
    { display: 'Manage Users', href: '/admin/users' },
    { display: 'Manage Groups', href: '/admin/groups' }
];

export default function Navbar() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const handleDrawerToggle = () => {
        setMobileOpen(open => !open);
    };

    const isAuthenticated = status === 'authenticated';
    const isAdmin = session ? session.user.admin : false;
    const username = session ? session.user.username : '';

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6' sx={{ my: 2, textAlign: 'center' }}>
                GunslignerCRM
            </Typography>
            <Divider />
            <List disablePadding sx={{ flexGrow: 1 }}>
                <ListItem disablePadding>
                    <DarkModeToggleButtons />
                </ListItem>
                <Divider />
                {isAuthenticated &&
                    <React.Fragment>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>{username[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText>{username}</ListItemText>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                }
                {isAuthenticated && routes.map(item => (
                    <React.Fragment key={`drawer-${item.display}`}>
                        <ListItem disablePadding>
                            <Link passHref legacyBehavior key={item.display} href={item.route}>
                                <ListItemButton sx={{ textAlign: 'left' }} onClick={handleDrawerToggle}>
                                    <ListItemText primary={item.display} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
            {isAuthenticated ?
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ borderRadius: 0 }}
                    color="error"
                    onClick={() => logout()}
                >
                    Logout
                </Button>
                :
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ borderRadius: 0 }}
                    color="primary"
                    onClick={() => router.push('/auth/signin')}
                >
                    Login
                </Button>
            }
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
                    <Typography variant='h6' component='div' sx={{ display: 'block', mr: 2 }}>
                        GunslingerCRM
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        {isAuthenticated && routes.map(item => (
                            <Link key={item.display} href={item.route} passHref legacyBehavior>
                                <Button sx={{ my: 2, color: 'inherit' }}>
                                    {item.display}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'flex', columnGap: '1em' } }}>
                        <DarkModeToggle />
                        {isAuthenticated ?
                            <ButtonGroup color='inherit'>
                                {isAdmin && <DropdownMenu label="Admin" options={adminRoutes} menuId="admin-menu" />}
                                <DropdownMenu label="Create" options={createRoutes} menuId="create-menu" />
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