// App imports
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// UI imports
import { AppBar, Avatar, Box, Button, Collapse, Divider, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DarkModeToggleButtons } from './darkmode-toggle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContactsIcon from '@mui/icons-material/Contacts';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { blue, grey } from '@mui/material/colors';

const drawerWidth = 240;
const appName = "GunslingerCRM";

const routes = [
    { display: 'Contacts', route: '/contacts', icon: <ContactsIcon /> },
    { display: 'Engagements', route: '/engagements', icon: <Diversity3Icon /> },
];

const adminRoutes = [
    { display: 'Manage Users', route: '/admin/users', icon: <PersonIcon /> },
    { display: 'Manage Groups', route: '/admin/groups', icon: <GroupIcon /> }
];

export default function AppNavBar() {
    const theme = useTheme();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [adminOpen, setAdminOpen] = useState<boolean>(false);

    const isAuthenticated = status === 'authenticated';
    const isAdmin = session ? session.user.admin : false;
    const username = session ? session.user.username : '';
    const email = session ? session.user.email : '';

    const isExtraSmallScreen = useMediaQuery(theme.breakpoints.only('xs'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    }

    const isDark = theme.palette.mode === 'dark';

    const logout = async () => {
        try {
            const data = await signOut({ redirect: false, callbackUrl: "/auth/signin" });
            router.push(data.url);
        } catch (err: any) {
            console.error(err);
        }
    };

    const drawer = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            bgcolor: isDark ? grey[900] : grey[100],
        }}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    {appName}
                </Typography>
            </Toolbar>
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
                                <Avatar sx={{ bgcolor: blue[400] }}>
                                    <AccountCircleIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText secondary={email}>{username}</ListItemText>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                }
                {isAuthenticated && routes.map(item => (
                    <React.Fragment key={`drawer-${item.display}`}>
                        <ListItem disablePadding>
                            <Link passHref legacyBehavior key={item.display} href={item.route}>
                                <ListItemButton
                                    sx={{ textAlign: 'left' }}
                                    onClick={handleDrawerToggle}
                                    selected={router.pathname === item.route}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.display} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
                {isAdmin &&
                    <React.Fragment>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setAdminOpen(!adminOpen)}>
                                <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                                <ListItemText>Admin</ListItemText>
                                {adminOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={adminOpen} timeout='auto' unmountOnExit>
                            <List disablePadding>
                                {adminRoutes.map(item => (
                                    <React.Fragment key={`drawer-${item.display}`}>
                                        <ListItem disablePadding>
                                            <Link passHref legacyBehavior key={item.display} href={item.route}>
                                                <ListItemButton
                                                    sx={{ textAlign: 'left', pl: 4 }}
                                                    onClick={handleDrawerToggle}
                                                    selected={router.pathname === item.route}
                                                >
                                                    <ListItemIcon>
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    <ListItemText primary={item.display} />
                                                </ListItemButton>
                                            </Link>
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </Collapse>
                    </React.Fragment>
                }
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

    return (
        <React.Fragment>
            <AppBar
                position="fixed"
                sx={{
                    display: { sm: 'none' }
                }}
            >
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        edge='start'
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {appName}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="navigation drawer"
            >
                <Drawer
                    variant={isExtraSmallScreen ? "temporary" : "permanent"}
                    open={isExtraSmallScreen ? mobileOpen : true}
                    onClose={isExtraSmallScreen ? handleDrawerToggle : undefined}
                    ModalProps={{
                        keepMounted: isExtraSmallScreen ? true : undefined, // better performance on mobile
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </React.Fragment>
    )
}